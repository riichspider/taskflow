class SyncProvider {
    constructor(baseUrl = null) {
        this.baseUrl = baseUrl;
        this.isOnline = navigator.onLine;
        this.offlineQueue = [];
        
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    async init() {
        console.log('[SyncProvider] Inicializado');
    }

    setBaseUrl(url) {
        this.baseUrl = url;
    }

    async sync() {
        if (!this.baseUrl) {
            console.log('[SyncProvider] URL base não configurada, modo offline');
            return;
        }

        if (!this.isOnline) {
            console.log('[SyncProvider] Offline, sincronização adiada');
            return;
        }

        try {
            await this.processQueue();
            console.log('[SyncProvider] Sincronizado com sucesso');
        } catch (error) {
            console.error('[SyncProvider] Erro na sincronização:', error);
        }
    }

    async queueOperation(operation) {
        this.offlineQueue.push(operation);
        
        if (this.isOnline) {
            await this.sync();
        }
    }

    async processQueue() {
        while (this.offlineQueue.length > 0) {
            const operation = this.offlineQueue.shift();
            await this.executeOperation(operation);
        }
    }

    async executeOperation(operation) {
        const { type, endpoint, data } = operation;
        
        const methods = {
            'POST': 'POST',
            'PUT': 'PUT',
            'DELETE': 'DELETE'
        };

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: methods[type] || 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            this.offlineQueue.unshift(operation);
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
    }

    handleOnline() {
        this.isOnline = true;
        console.log('[SyncProvider] back online');
        this.sync();
    }

    handleOffline() {
        this.isOnline = false;
        console.log('[SyncProvider] gone offline');
    }
}

class NotificationService {
    constructor() {
        this.permission = 'default';
    }

    async init() {
        if ('Notification' in window) {
            this.permission = Notification.permission;
        }
    }

    async requestPermission() {
        if (!('Notification' in window)) {
            console.log('[Notifications] Não suportado');
            return false;
        }

        if (this.permission === 'granted') {
            return true;
        }

        const permission = await Notification.requestPermission();
        this.permission = permission;
        return permission === 'granted';
    }

    send(title, options = {}) {
        if (this.permission !== 'granted') {
            console.log('[Notifications] Permissão não concedida');
            return;
        }

        return new Notification(title, {
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">✨</text></svg>',
            badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">✨</text></svg>',
            ...options
        });
    }

    pomodoroComplete() {
        this.send('🍅 Pomodoro Completo!', {
            body: 'Ciclo de 25 minutos finalizado. Hora de uma pausa!',
            tag: 'pomodoro'
        });
    }

    taskReminder(taskText) {
        this.send('⏰ Lembrete de Tarefa', {
            body: taskText,
            tag: 'reminder'
        });
    }

    achievementUnlocked(achievement) {
        this.send(`🏆 ${achievement}`, {
            body: 'Nova conquista desbloqueada!',
            tag: 'achievement'
        });
    }
}