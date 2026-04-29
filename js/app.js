class TaskFlowApp {
    constructor() {
        this.storage = new StorageService();
        this.taskService = new TaskService(this.storage);
        this.gamification = new GamificationService(this.storage);
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.editingTaskId = null;
        this.deletingTaskId = null;
        
        this.pomodoroTime = 25 * 60;
        this.pomodoroRemaining = this.pomodoroTime;
        this.pomodoroRunning = false;
        this.pomodoroInterval = null;
        
        this.theme = 'light';
        this.init();
    }

    async init() {
        await this.storage.init();
        this.gamification.load(this.taskService.getAll());
        this.taskService.load();
        
        this.initElements();
        this.initEvents();
        this.applyTheme();
        this.render();
        
        console.log('[TaskFlow] Aplicativo inicializado');
    }

    initElements() {
        this.elements = {
            taskInput: document.getElementById('taskInput'),
            addBtn: document.getElementById('addBtn'),
            prioritySelect: document.getElementById('prioritySelect'),
            categorySelect: document.getElementById('categorySelect'),
            searchInput: document.getElementById('searchInput'),
            taskList: document.getElementById('taskList'),
            filterTabs: document.querySelectorAll('.filter-tab'),
            statItems: document.querySelectorAll('.stat-item'),
            
            totalCount: document.getElementById('totalCount'),
            pendingCount: document.getElementById('pendingCount'),
            completedCount: document.getElementById('completedCount'),
            
            xpFill: document.getElementById('xpFill'),
            xpNum: document.getElementById('xpNum'),
            xpMax: document.getElementById('xpMax'),
            levelNum: document.getElementById('levelNum'),
            streakCount: document.getElementById('streakCount'),
            
            editModal: document.getElementById('editModal'),
            editInput: document.getElementById('editInput'),
            editPriority: document.getElementById('editPriority'),
            editCategory: document.getElementById('editCategory'),
            cancelEdit: document.getElementById('cancelEdit'),
            saveEdit: document.getElementById('saveEdit'),
            
            confirmModal: document.getElementById('confirmModal'),
            cancelDelete: document.getElementById('cancelDelete'),
            confirmDelete: document.getElementById('confirmDelete'),
            
            timerToggle: document.getElementById('timerToggle'),
            timerReset: document.getElementById('timerReset'),
            timerDisplay: document.getElementById('timerDisplay'),
            progressCircle: document.getElementById('progressCircle'),
            
            achievementsGrid: document.getElementById('achievementsGrid'),
            
            themeToggle: document.getElementById('themeToggle')
        };
    }

    initEvents() {
        this.elements.addBtn.addEventListener('click', () => this.addTask());
        this.elements.taskInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') this.addTask();
        });

        this.elements.searchInput.addEventListener('input', e => {
            this.searchQuery = e.target.value.toLowerCase();
            this.render();
        });

        this.elements.filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.elements.filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentFilter = tab.dataset.filter;
                this.render();
            });
        });

        this.elements.statItems.forEach(item => {
            item.addEventListener('click', () => {
                this.elements.statItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                const filterMap = { all: 'all', pending: 'pending', completed: 'completed' };
                this.currentFilter = filterMap[item.dataset.filter];
                this.elements.filterTabs.forEach(tab => {
                    tab.classList.toggle('active', tab.dataset.filter === this.currentFilter);
                });
                this.render();
            });
        });

        this.elements.cancelEdit.addEventListener('click', () => this.closeEditModal());
        this.elements.saveEdit.addEventListener('click', () => this.saveEdit());
        
        this.elements.cancelDelete.addEventListener('click', () => this.closeConfirmModal());
        this.elements.confirmDelete.addEventListener('click', () => this.confirmDelete());

        this.elements.timerToggle.addEventListener('click', () => this.togglePomodoro());
        this.elements.timerReset.addEventListener('click', () => this.resetPomodoro());

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                this.closeEditModal();
                this.closeConfirmModal();
            }
        });

        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        this.taskService.subscribe(() => this.render());
        this.gamification.subscribe(() => this.updateGamificationDisplay());
    }

    addTask() {
        const text = this.elements.taskInput.value.trim();
        if (!text) {
            this.showAlert('Digite uma tarefa!');
            return;
        }

        const priority = this.elements.prioritySelect.value;
        const category = this.elements.categorySelect.value;
        
        this.taskService.add(text, priority, category);
        this.gamification.onTaskCreated();
        this.gamification.checkAchievements(this.taskService.getAll());
        
        this.elements.taskInput.value = '';
        this.render();
    }

    toggleTask(id) {
        const task = this.taskService.toggleComplete(id);
        if (task.completed) {
            this.gamification.onTaskCompleted(task.priority, this.taskService.getAll());
            this.gamification.checkAchievements(this.taskService.getAll());
        }
    }

    openEditModal(id) {
        const task = this.taskService.getAll().find(t => t.id === id);
        if (task) {
            this.editingTaskId = id;
            this.elements.editInput.value = task.text;
            this.elements.editPriority.value = task.priority;
            this.elements.editCategory.value = task.category;
            this.elements.editModal.classList.add('active');
            this.elements.editInput.focus();
        }
    }

    closeEditModal() {
        this.elements.editModal.classList.remove('active');
        this.editingTaskId = null;
    }

    saveEdit() {
        const text = this.elements.editInput.value.trim();
        if (!text) {
            this.showAlert('A tarefa não pode estar vazia!');
            return;
        }

        this.taskService.update(this.editingTaskId, {
            text,
            priority: this.elements.editPriority.value,
            category: this.elements.editCategory.value
        });
        
        this.closeEditModal();
        this.render();
    }

    openConfirmModal(id) {
        this.deletingTaskId = id;
        this.elements.confirmModal.classList.add('active');
    }

    closeConfirmModal() {
        this.elements.confirmModal.classList.remove('active');
        this.deletingTaskId = null;
    }

    confirmDelete() {
        if (this.deletingTaskId) {
            this.taskService.delete(this.deletingTaskId);
        }
        this.closeConfirmModal();
    }

    togglePomodoro() {
        if (this.pomodoroRunning) {
            clearInterval(this.pomodoroInterval);
            this.pomodoroRunning = false;
            this.elements.timerToggle.textContent = '▶ Iniciar';
        } else {
            this.pomodoroRunning = true;
            this.elements.timerToggle.textContent = '⏸ Pausar';
            this.pomodoroInterval = setInterval(() => this.tickPomodoro(), 1000);
        }
    }

    tickPomodoro() {
        if (this.pomodoroRemaining > 0) {
            this.pomodoroRemaining--;
            this.updatePomodoroDisplay();
        } else {
            this.pomodoroInterval && clearInterval(this.pomodoroInterval);
            
            const newAchievements = this.gamification.onPomodoroComplete();
            this.showAchievement('🍅', 'Pomodoro!', 'Ciclo de 25min completo!');
            
            newAchievements.forEach(ach => {
                this.showAchievement(ach.icon, 'Conquista!', ach.name);
            });
            
            this.resetPomodoro();
        }
    }

    resetPomodoro() {
        this.pomodoroInterval && clearInterval(this.pomodoroInterval);
        this.pomodoroRunning = false;
        this.pomodoroRemaining = this.pomodoroTime;
        this.elements.timerToggle.textContent = '▶ Iniciar';
        this.updatePomodoroDisplay();
    }

    updatePomodoroDisplay() {
        const mins = Math.floor(this.pomodoroRemaining / 60).toString().padStart(2, '0');
        const secs = (this.pomodoroRemaining % 60).toString().padStart(2, '0');
        this.elements.timerDisplay.textContent = `${mins}:${secs}`;
        
        const progress = 157 - (this.pomodoroRemaining / this.pomodoroTime) * 157;
        this.elements.progressCircle.style.strokeDashoffset = progress;
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.storage.setTheme(this.theme);
        this.applyTheme();
    }

    applyTheme() {
        this.theme = this.storage.getTheme();
        document.documentElement.setAttribute('data-theme', this.theme);
    }

    updateGamificationDisplay() {
        const state = this.gamification.getState();
        
        this.elements.xpFill.style.width = `${state.xpProgress}%`;
        this.elements.xpNum.textContent = state.xp;
        this.elements.xpMax.textContent = state.xpPerLevel;
        this.elements.levelNum.textContent = state.level;
        this.elements.streakCount.textContent = state.streak;
        
        this.elements.achievementsGrid.innerHTML = this.gamification.ACHIEVEMENTS.map(ach => {
            const unlocked = state.achievements.includes(ach.id);
            return `
                <div class="achievement ${unlocked ? 'unlocked' : ''}" 
                     role="img" 
                     aria-label="${ach.name}: ${unlocked ? 'Desbloqueada' : 'Bloqueada'}">
                    <div class="achievement-icon">${ach.icon}</div>
                    <div class="achievement-name">${ach.name}</div>
                </div>
            `;
        }).join('');
    }

    render() {
        let tasks = this.taskService.getAll();
        
        if (this.currentFilter === 'pending') {
            tasks = tasks.filter(t => !t.completed);
        } else if (this.currentFilter === 'completed') {
            tasks = tasks.filter(t => t.completed);
        }
        
        if (this.searchQuery) {
            tasks = tasks.filter(t => 
                t.text.toLowerCase().includes(this.searchQuery) ||
                t.category.toLowerCase().includes(this.searchQuery)
            );
        }
        
        tasks = this.taskService.sortByPriority(tasks);
        
        const stats = this.taskService.getStats();
        this.elements.totalCount.textContent = stats.total;
        this.elements.pendingCount.textContent = stats.pending;
        this.elements.completedCount.textContent = stats.completed;
        
        this.updateGamificationDisplay();
        
        if (tasks.length === 0) {
            this.elements.taskList.innerHTML = `
                <li class="empty-state" role="status" aria-live="polite">
                    <div class="empty-state-icon" aria-hidden="true">📝</div>
                    <p>Nenhuma tarefa encontrada</p>
                </li>
            `;
            return;
        }

        this.elements.taskList.innerHTML = tasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}" 
                role="article" 
                aria-label="${task.text}, ${task.completed ? 'concluída' : 'pendente'}, prioridade ${task.priority}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                     onclick="app.toggleTask(${task.id})"
                     role="checkbox" 
                     aria-checked="${task.completed}"
                     tabindex="0"
                     onkeydown="if(event.key==='Enter') app.toggleTask(${task.id})">
                </div>
                <div class="task-details">
                    <div class="task-title">${this.taskService.escapeHtml(task.text)}</div>
                    <div class="task-tags" role="list" aria-label="Categorias">
                        <span class="tag tag-priority-${task.priority}" role="listitem">${task.priority}</span>
                        <span class="tag tag-category-${task.category}" role="listitem">${task.category}</span>
                        <span class="tag tag-date" role="listitem">${this.taskService.formatDate(task.createdAt)}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn-icon btn-edit" 
                            onclick="app.openEditModal(${task.id})"
                            aria-label="Editar tarefa"
                            title="Editar">
                        ✏️
                    </button>
                    <button class="btn-icon btn-delete" 
                            onclick="app.openConfirmModal(${task.id})"
                            aria-label="Excluir tarefa"
                            title="Excluir">
                        🗑️
                    </button>
                </div>
            </li>
        `).join('');
    }

    showAlert(message) {
        alert(message);
    }

    showAchievement(icon, title, desc) {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.setAttribute('role', 'alert');
        popup.innerHTML = `
            <h4>${icon} ${title}</h4>
            <p>${desc}</p>
        `;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 3500);
    }
}

const app = new TaskFlowApp();