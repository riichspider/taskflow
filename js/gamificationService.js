class GamificationService {
    constructor(storageService) {
        this.storage = storageService;
        this.xp = 0;
        this.level = 1;
        this.streak = 0;
        this.pomodoros = 0;
        this.tasksCompleted = 0;
        this.achievements = [];
        
        this.XP_VALUES = {
            CREATE_TASK: 10,
            PRIORITY_ALTA: 30,
            PRIORITY_MEDIA: 20,
            PRIORITY_BAIXA: 10,
            POMODORO: 25
        };
        
        this.ACHIEVEMENTS = [
            { id: 'first', name: 'Primeira Tarefa', icon: '🌟', check: (ctx) => ctx.tasks.length >= 1 },
            { id: 'ten', name: '10 Tarefas', icon: '🎯', check: (ctx) => ctx.tasks.length >= 10 },
            { id: 'completed1', name: 'Primeira Concluída', icon: '✅', check: (ctx) => ctx.tasksCompleted >= 1 },
            { id: 'completed10', name: '10 Concluídas', icon: '🏅', check: (ctx) => ctx.tasksCompleted >= 10 },
            { id: 'completed50', name: '50 Concluídas', icon: '🌈', check: (ctx) => ctx.tasksCompleted >= 50 },
            { id: 'streak3', name: '3 Dias Seguidos', icon: '🔥', check: (ctx) => ctx.streak >= 3 },
            { id: 'streak7', name: 'Semana Produtiva', icon: '💪', check: (ctx) => ctx.streak >= 7 },
            { id: 'streak30', name: 'Mês Produtivo', icon: '👑', check: (ctx) => ctx.streak >= 30 },
            { id: 'level5', name: 'Nível 5', icon: '⭐', check: (ctx) => ctx.level >= 5 },
            { id: 'level10', name: 'Mestre', icon: '🏆', check: (ctx) => ctx.level >= 10 },
            { id: 'pomodoro5', name: '5 Pomodoros', icon: '🍅', check: (ctx) => ctx.pomodoros >= 5 },
            { id: 'pomodoro25', name: '25 Pomodoros', icon: '🥇', check: (ctx) => ctx.pomodoros >= 25 },
            { id: 'high', name: 'Prioridade Alta', icon: '🚀', check: (ctx) => ctx.highPriorityCompleted },
            { id: 'all-cat', name: 'Todas Categorias', icon: '🎨', check: (ctx) => ctx.hasAllCategories },
            { id: 'all-priorities', name: 'Mestre de Prioridades', icon: '📊', check: (ctx) => ctx.hasAllPriorities }
        ];

        this.listeners = [];
    }

    subscribe(callback) {
        this.listeners.push(callback);
    }

    notify() {
        this.listeners.forEach(cb => cb(this.getState()));
    }

    load(tasks) {
        this.xp = this.storage.getXp();
        this.level = this.storage.getLevel();
        this.streak = this.storage.getStreak();
        this.pomodoros = this.storage.getPomodoros();
        this.tasksCompleted = this.storage.getTasksCompleted();
        this.achievements = this.storage.getAchievements();
        this.updateStreak();
        this.notify();
    }

    getState() {
        return {
            xp: this.xp,
            level: this.level,
            streak: this.streak,
            pomodoros: this.pomodoros,
            tasksCompleted: this.tasksCompleted,
            achievements: this.achievements,
            xpPerLevel: this.getXpPerLevel(),
            xpProgress: this.getXpProgress()
        };
    }

    getXpPerLevel() {
        return 100 * this.level;
    }

    getXpProgress() {
        return (this.xp / this.getXpPerLevel()) * 100;
    }

    addXp(amount) {
        let newXp = this.xp + amount;
        let newLevel = this.level;
        
        while (newXp >= this.getXpPerLevel()) {
            newXp -= this.getXpPerLevel();
            newLevel++;
        }
        
        this.xp = newXp;
        this.level = newLevel;
        
        this.storage.setXp(this.xp);
        this.storage.setLevel(this.level);
        
        const leveledUp = newLevel > this.level;
        this.notify();
        
        if (leveledUp) {
            return { leveledUp: true, newLevel };
        }
        
        return { leveledUp: false };
    }

    onTaskCreated() {
        return this.addXp(this.XP_VALUES.CREATE_TASK);
    }

    onTaskCompleted(taskPriority, tasks) {
        this.tasksCompleted++;
        this.storage.setTasksCompleted(this.tasksCompleted);
        
        let amount;
        switch (taskPriority) {
            case 'alta': amount = this.XP_VALUES.PRIORITY_ALTA; break;
            case 'media': amount = this.XP_VALUES.PRIORITY_MEDIA; break;
            default: amount = this.XP_VALUES.PRIORITY_BAIXA;
        }
        
        const result = this.addXp(amount);
        this.updateStreak();
        
        return result;
    }

    onPomodoroComplete() {
        this.pomodoros++;
        this.storage.setPomodoros(this.pomodoros);
        this.addXp(this.XP_VALUES.POMODORO);
        return this.checkAchievements();
    }

    updateStreak() {
        const today = new Date().toDateString();
        const lastDate = this.storage.getLastDate();
        
        if (lastDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastDate === yesterday.toDateString()) {
                this.streak++;
            } else if (lastDate !== today) {
                this.streak = lastDate ? 1 : 0;
            }
            
            this.storage.setStreak(this.streak);
            this.storage.setLastDate(today);
        }
    }

    checkAchievements(tasks = []) {
        const newlyUnlocked = [];
        const ctx = {
            tasks,
            tasksCompleted: this.tasksCompleted,
            streak: this.streak,
            level: this.level,
            pomodoros: this.pomodoros,
            highPriorityCompleted: tasks.some(t => t.priority === 'alta' && t.completed),
            hasAllCategories: ['pessoal', 'trabalho', 'estudos', 'saude'].every(
                c => tasks.some(t => t.category === c)
            ),
            hasAllPriorities: ['alta', 'media', 'baixa'].every(
                p => tasks.some(t => t.priority === p)
            )
        };

        this.ACHIEVEMENTS.forEach(ach => {
            if (!this.achievements.includes(ach.id) && ach.check(ctx)) {
                this.achievements.push(ach.id);
                newlyUnlocked.push(ach);
            }
        });

        this.storage.setAchievements(this.achievements);
        
        if (newlyUnlocked.length > 0) {
            this.notify();
        }

        return newlyUnlocked;
    }

    reset() {
        this.xp = 0;
        this.level = 1;
        this.streak = 0;
        this.pomodoros = 0;
        this.tasksCompleted = 0;
        this.achievements = [];
        
        this.storage.clear();
        this.notify();
    }
}