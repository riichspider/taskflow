class TaskService {
    constructor(storageService) {
        this.storage = storageService;
        this.tasks = [];
        this.listeners = [];
    }

    subscribe(callback) {
        this.listeners.push(callback);
    }

    notify() {
        this.listeners.forEach(cb => cb(this.tasks));
    }

    load() {
        this.tasks = this.storage.getTasks();
        this.notify();
    }

    add(text, priority = 'baixa', category = 'pessoal') {
        if (!text || !text.trim()) {
            throw new Error('Tarefa não pode estar vazia');
        }

        const task = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
            priority,
            category,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        this.tasks.push(task);
        this.storage.saveTasks(this.tasks);
        this.notify();
        return task;
    }

    update(id, updates) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index === -1) {
            throw new Error('Tarefa não encontrada');
        }

        this.tasks[index] = { ...this.tasks[index], ...updates };
        this.storage.saveTasks(this.tasks);
        this.notify();
        return this.tasks[index];
    }

    toggleComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) {
            throw new Error('Tarefa não encontrada');
        }

        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        
        this.storage.saveTasks(this.tasks);
        this.notify();
        return task;
    }

    delete(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.storage.saveTasks(this.tasks);
        this.notify();
    }

    getAll() {
        return [...this.tasks];
    }

    getByFilter(filter) {
        switch (filter) {
            case 'pending':
                return this.tasks.filter(t => !t.completed);
            case 'completed':
                return this.tasks.filter(t => t.completed);
            default:
                return this.tasks;
        }
    }

    search(query) {
        const q = query.toLowerCase();
        return this.tasks.filter(t => 
            t.text.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q)
        );
    }

    getStats() {
        return {
            total: this.tasks.length,
            completed: this.tasks.filter(t => t.completed).length,
            pending: this.tasks.filter(t => !t.completed).length,
            byPriority: {
                alta: this.tasks.filter(t => t.priority === 'alta').length,
                media: this.tasks.filter(t => t.priority === 'media').length,
                baixa: this.tasks.filter(t => t.priority === 'baixa').length
            },
            byCategory: {
                pessoal: this.tasks.filter(t => t.category === 'pessoal').length,
                trabalho: this.tasks.filter(t => t.category === 'trabalho').length,
                estudos: this.tasks.filter(t => t.category === 'estudos').length,
                saude: this.tasks.filter(t => t.category === 'saude').length
            }
        };
    }

    sortByPriority(tasks) {
        const priorityOrder = { alta: 0, media: 1, baixa: 2 };
        return [...tasks].sort((a, b) => 
            a.completed - b.completed || 
            priorityOrder[a.priority] - priorityOrder[b.priority]
        );
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}