# 🏆 TaskFlow - Sistema de Tarefas Gamificado

> Um sistema de gerenciamento de tarefas com elementos de gamificação para aumentar sua produtividade.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Diferenciais

### 🎮 Sistema de Gamificação Completo
- **XP e Níveis**: Ganhe experiência ao criar e completar tarefas
- **Sequência de Dias (Streak)**: Mantenha sua produtividade diária
- **15 Conquistas (Achievements)**: Desbloqueie conquistas únicas
- **Timer Pomodoro**: Foco profissional integrado

### 🏗️ Arquitetura Modular
- Separação clara em módulos JavaScript
- Ready para escalabilidade
- Prepardo para backend/IndexedDB

### ♿ Acessibilidade (A11y)
- Navegação completa via teclado
- Atributos ARIA apropriados
- Alto contraste e readable

### 🎨 Tema Claro/Escuro
- Design responsivo
- Modo escuro disponível

## 🚀 Funcionalidades

| Funcionalidade | Descrição |
|----------------|-----------|
| ✅ Adicionar tarefas | Com prioridade e categoria |
| ✅ Editar tarefas | Modal completo |
| ✅ Excluir tarefas | Com confirmação |
| ✅ Filtrar | Todas/Pendentes/Concluídas |
| ✅ Buscar | Tempo real |
| ✅ XP Progress | Barra visual |
| ✅ Níveis | Progressão infinita |
| ✅ Conquistas | 15 disponíveis |
| ✅ Pomodoro | Timer 25 min |
| ✅ Persistência | localStorage |
| ✅ Tema | Claro/Escuro |

## 🛠️ Tecnologias

- **HTML5** - Semântico e acessível
- **CSS3** - Flexbox, Grid, CSS Variables, Animações
- **JavaScript ES6+** - POO, Módulos, Async/Await

## 📁 Estrutura do Projeto

```
taskflow/
├── index.html              # Estrutura principal
├── README.md               # Documentação
├── css/
│   └── styles.css         # Estilos completos
├── js/
│   ├── app.js             # Aplicação principal
│   ├── taskService.js     # Lógica de tarefas
│   ├── gamificationService.js # Sistema XP/Gamificação
│   ├── storageService.js  # Persistência
│   └── syncProvider.js    # Sincronização (preparado)
└── QA/
    └── testes.md          # Casos de teste
```

## 📦 Como Usar

### Instalação Local
```bash
git clone https://github.com/seu-usuario/taskflow.git
cd taskflow
# Abra index.html no navegador
```

### Usando Servidor Local
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

## 🎯 Prioridades e XP

| Prioridade | XP ao Completar |
|------------|-----------------|
| 🔥 Alta    | 30 XP           |
| ⚡ Média   | 20 XP           |
| ☕ Baixa   | 10 XP           |

## 🏅 Conquistas

| Ícone | Nome | Requisito |
|-------|------|-----------|
| 🌟 | Primeira Tarefa | Criar 1 tarefa |
| 🎯 | 10 Tarefas | Criar 10 tarefas |
| ✅ | Primeira Concluída | Completar 1 tarefa |
| 🏅 | 10 Concluídas | Completar 10 tarefas |
| 🌈 | 50 Concluídas | Completar 50 tarefas |
| 🔥 | 3 Dias Seguidos | Manter 3 dias de sequência |
| 💪 | Semana Produtiva | 7 dias de sequência |
| 👑 | Mês Produtivo | 30 dias de sequência |
| ⭐ | Nível 5 | Chegar ao nível 5 |
| 🏆 | Mestre | Chegar ao nível 10 |
| 🍅 | 5 Pomodoros | Completar 5 ciclos |
| 🥇 | 25 Pomodoros | Completar 25 ciclos |
| 🚀 | Prioridade Alta | Completar tarefa alta |
| 🎨 | Todas Categorias | Usar todas as 4 categorias |
| 📊 | Mestre de Prioridades | Usar todas as prioridades |

## 🔄 Preparado para Futuro

### Backend Integration
O `SyncProvider` está pronto para integrar com qualquer API REST:
```javascript
const sync = new SyncProvider('https://api.seusite.com');
storage.setSyncProvider(sync);
```

### IndexedDB
Suporte nativo已开始准备:
```javascript
storage.useIndexedDB = true;
await storage.init();
```

### Notificações
Serviço de notificações pronto:
```javascript
const notifications = new NotificationService();
await notifications.requestPermission();
notifications.pomodoroComplete();
```

## 🎨 Paleta de Cores

### Claro
- Primary: `#667eea`
- Secondary: `#764ba2`
- Success: `#2ed573`
- Warning: `#ffa502`
- Danger: `#ff4757`

### Escuro
- Primary: `#7c8ff5`
- Background: `#1a1a2e`
- Card: `#16213e`

---

**Desenvolvido para fins educacionais e demonstração de habilidades em desenvolvimento web moderno.**

MIT License - Feito com ❤️