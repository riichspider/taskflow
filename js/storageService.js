class StorageService {
    constructor() {
        this.STORAGE_KEYS = {
            TASKS: 'taskflow_tasks',
            XP: 'taskflow_xp',
            LEVEL: 'taskflow_level',
            STREAK: 'taskflow_streak',
            LAST_DATE: 'taskflow_last_date',
            POMODOROS: 'taskflow_pomodoros',
            TASKS_COMPLETED: 'taskflow_tasks_completed',
            ACHIEVEMENTS: 'taskflow_achievements',
            THEME: 'taskflow_theme'
        };
        this.storageType = 'localStorage';
        this.syncProvider = null;
        this.useIndexedDB = false;
    }

    async init() {
        console.log('[StorageService] Inicializado com ' + this.storageType);
        
        if (this.useIndexedDB) {
            await this.initIndexedDB();
        }
        
        if (this.syncProvider) {
            await this.syncProvider.init();
        }
        
        return Promise.resolve();
    }

    async initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('TaskFlowDB', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains('tasks')) {
                    db.createObjectStore('tasks', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('userData')) {
                    db.createObjectStore('userData', { keyPath: 'key' });
                }
            };
        });
    }

    async saveToIndexedDB(storeName, data) {
        if (!this.db) return;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getFromIndexedDB(storeName, key) {
        if (!this.db) return null;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    setSyncProvider(provider) {
        this.syncProvider = provider;
    }

    async sync() {
        if (this.syncProvider) {
            await this.syncProvider.sync();
        }
    }

    getTasks() {
        const data = localStorage.getItem(this.STORAGE_KEYS.TASKS);
        return data ? JSON.parse(data) : [];
    }

    saveTasks(tasks) {
        localStorage.setItem(this.STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    }

    getXp() {
        return parseInt(localStorage.getItem(this.STORAGE_KEYS.XP) || '0');
    }

    setXp(xp) {
        localStorage.setItem(this.STORAGE_KEYS.XP, xp);
    }

    getLevel() {
        return parseInt(localStorage.getItem(this.STORAGE_KEYS.LEVEL) || '1');
    }

    setLevel(level) {
        localStorage.setItem(this.STORAGE_KEYS.LEVEL, level);
    }

    getStreak() {
        return parseInt(localStorage.getItem(this.STORAGE_KEYS.STREAK) || '0');
    }

    setStreak(streak) {
        localStorage.setItem(this.STORAGE_KEYS.STREAK, streak);
    }

    getLastDate() {
        return localStorage.getItem(this.STORAGE_KEYS.LAST_DATE) || '';
    }

    setLastDate(date) {
        localStorage.setItem(this.STORAGE_KEYS.LAST_DATE, date);
    }

    getPomodoros() {
        return parseInt(localStorage.getItem(this.STORAGE_KEYS.POMODOROS) || '0');
    }

    setPomodoros(count) {
        localStorage.setItem(this.STORAGE_KEYS.POMODOROS, count);
    }

    getTasksCompleted() {
        return parseInt(localStorage.getItem(this.STORAGE_KEYS.TASKS_COMPLETED) || '0');
    }

    setTasksCompleted(count) {
        localStorage.setItem(this.STORAGE_KEYS.TASKS_COMPLETED, count);
    }

    getAchievements() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.ACHIEVEMENTS) || '[]');
    }

    setAchievements(achievements) {
        localStorage.setItem(this.STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    }

    getTheme() {
        return localStorage.getItem(this.STORAGE_KEYS.THEME) || 'light';
    }

    setTheme(theme) {
        localStorage.setItem(this.STORAGE_KEYS.THEME, theme);
    }

    clear() {
        Object.values(this.STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }

    exportData() {
        return {
            tasks: this.getTasks(),
            xp: this.getXp(),
            level: this.getLevel(),
            streak: this.getStreak(),
            pomodoros: this.getPomodoros(),
            tasksCompleted: this.getTasksCompleted(),
            achievements: this.getAchievements()
        };
    }

    importData(data) {
        if (data.tasks) this.saveTasks(data.tasks);
        if (data.xp) this.setXp(data.xp);
        if (data.level) this.setLevel(data.level);
        if (data.streak) this.setStreak(data.streak);
        if (data.pomodoros) this.setPomodoros(data.pomodoros);
        if (data.tasksCompleted) this.setTasksCompleted(data.tasksCompleted);
        if (data.achievements) this.setAchievements(data.achievements);
    }
}