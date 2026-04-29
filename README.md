# 🏆 TaskFlow - Sistema de Tarefas Gamificado

> Um sistema de gerenciamento de tarefas com elementos de gamificação para aumentar sua produtividade. Ganha XP, suba de nível e desbloqueie conquistas!

[![Generic badge](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://www.w3.org/html/)
[![Generic badge](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/Overview.en.html)
[![Generic badge](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Generic badge](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Generic badge](https://img.shields.io/badge/Version-4.0-purple?style=for-the-badge)]()
[![Generic badge](https://img.shields.io/badge/A11y-Complete-blue?style=for-the-badge)]()

---

## ✨ Demonstração

**[🔗 Acesse o projeto online](https://taskflow-roan.vercel.app)** *(em breve)*

```
🎮 Crie tarefas → Complete → Ganhe XP → Suba de nível → Desbloqueie conquistas!
```

---

## 🚀 Funcionalidades

| Status | Funcionalidade | Descrição |
|:------:|----------------|------------|
| ✅ | Adicionar tarefas | Com prioridade e categoria |
| ✅ | Editar tarefas | Modal completo |
| ✅ | Excluir tarefas | Com confirmação |
| ✅ | Filtrar | Todas / Pendentes / Concluídas |
| ✅ | Buscar | Tempo real |
| ✅ | XP Progress | Barra visual animated |
| ✅ | Níveis | Progressão infinita |
| ✅ | 15 Conquistas | Sistema de achievements |
| ✅ | Pomodoro | Timer 25 min com círculo |
| ✅ | Modo Escuro | Toggle theme |
| ✅ | A11y | Keyboard navigation + ARIA |
| ✅ | Persistência | localStorage |

---

## 🎮 Sistema de Gamificação

### xp por Ação

| Ação | XP |
|------|------|
| Criar tarefa | +10 |
| Completar baixa | +10 |
| Completar média | +20 |
| Completar alta | +30 |
| Pomodoro | +25 |

### Níveis
A cada 100 XP × nível, você sobe de nível!
```
Nível 1 → 2: 100 XP
Nível 2 → 3: 200 XP
Nível 3 → 4: 300 XP
...
```

---

## 🏅 Conquistas (15 Total)

| Ícone | Nome | Requisito |
|:-----:|------|-----------|
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

---

## 🏗️ Arquitetura

```
taskflow/
├── index.html              # Estrutura com ARIA
├── css/
│   └── styles.css         # CSS Variables + Dark Mode
├── js/
│   ├── app.js             # Controller principal
│   ├── taskService.js     # Lógica de tarefas (CRUD)
│   ├── gamificationService.js # XP, levels, achievements
│   ├── storageService.js  # localStorage + IndexedDB ready
│   └── syncProvider.js    # API sync ready
└── README.md
```

---

## 🎯 Diferenciais

1. **Gamificação Real** - Não é só um todo-list, é um jogo de produtividade
2. **Arquitetura Modular** - 5 arquivos JS separados, fácil manutenção
3. **Acessibilidade Completa** - keyboard navigation, ARIA, SR-only
4. **Responsivo** - Mobile-first, funciona em qualquer tela
5. **Modo Escuro** - Tema claro/escuro com CSS variables
6. **Prepardo para Futuro** - IndexedDB e backend-ready

---

## 🛠️ Tecnologias

- **HTML5** - Semântico, acessível
- **CSS3** - Flexbox, Grid, Variables, Animations
- **JavaScript ES6+** - POO, Modules, Async

---

## 📦 Como Usar

### Clone e abra
```bash
git clone https://github.com/riichspider/taskflow.git
cd taskflow
# Abra index.html no navegador
```

### ou use um servidor local
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

Acesse: `http://localhost:8000`

---

## 🎨 Paleta de Cores

### Light Mode
- Primary: `#667eea`
- Secondary: `#764ba2`
- Success: `#2ed573`

### Dark Mode
- Primary: `#7c8ff5`
- Background: `#1a1a2e`

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova`)
3. Commit (`git commit -m 'Add nova feature'`)
4. Push (`git push origin feature/nova`)
5. Abra um Pull Request

---

## 📄 Licença

MIT License - Livre para usar e modificar.

---

**⭐️ Curtiu? Deixe uma estrela no repositório!**

Feito com ❤️ por [@riichspider](https://github.com/riichspider)