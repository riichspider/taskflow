# 🚀 Como Subir para o GitHub

## Pré-requisitos
- Git instalado
- Conta no GitHub

## Passo a Passo

### 1. Criar repositório no GitHub
1. Acesse [github.com](https://github.com)
2. Clique em **New repository**
3. Nome: `taskflow`
4. Público (Public)
5. Clique **Create repository**

### 2. No seu terminal, executar:

```bash
cd C:/sistema-tarefas

git add .

git commit -m "TaskFlow - Sistema de tarefas gamificado

- Arquitetura modular (5 módulos JS)
- Sistema de gamificação com XP e níveis
- 15 conquistas
- Timer Pomodoro integrado
- Modo escuro/claro
- Acessibilidade completa (ARIA)
- Preparado para IndexedDB e backend"

git branch -M main

git remote add origin https://github.com/SEU_USUARIO/taskflow.git

git push -u origin main
```

**Substitua `SEU_USUARIO` pelo seu username do GitHub!**

---

## Para Atualizações Futuras

```bash
git add .
git commit -m "Descrição da mudança"
git push
```

---

## Estrutura que será enviada

```
taskflow/
├── index.html      (8KB)
├── README.md
├── css/
│   └── styles.css  (14KB)
├── js/
│   ├── app.js
│   ├── taskService.js
│   ├── gamificationService.js
│   ├── storageService.js
│   └── syncProvider.js
└── QA/
    └── testes.md
```