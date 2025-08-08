# 🚀 Canonika - Quick Prompt

**Canonika**: Plataforma de microserviços modular. Harbor (3701) carrega views dinamicamente.

## 🏗️ Estrutura
```
quarter/ (80) → harbor/ (3701) → [serviços]
├── api/ (FastAPI)
├── web/ (Vue.js 3 + Vite)
└── views/ (Harbor views)
```

## 📝 Convenções
- **Arquivos**: kebab-case (`user-profile.vue`)
- **Componentes**: PascalCase (`UserProfile.vue`)
- **APIs**: snake_case (`get_user_profile`)
- **CSS**: `canonika-` prefix

## 🚀 Comandos
```bash
./create-service.sh notification 3710 8010  # Novo serviço
./dev.sh start                              # Desenvolvimento
./dev.sh css                               # Mudanças CSS
docker-compose build [serviço]             # Mudanças estruturais
```

## 🎨 Padrão View
```vue
<template>
  <div class="service-view">
    <div class="view-header">
      <div class="view-title">{{ title }}</div>
      <div class="view-status">{{ status }}</div>
    </div>
    <div class="view-content"><!-- Conteúdo --></div>
  </div>
</template>
```

## 🔧 Troubleshooting
```bash
git reset --hard 05d1121                    # Reset estável
docker-compose down && docker-compose up -d # Rebuild completo
cd harbor/web && npm run dev               # Hot reload
```

## 📚 Recursos
- `CURSOR_CONTEXT.md` - Contexto completo
- `TEMPLATES.md` - Templates
- `create-service.sh` - Automação
- `README.md` - Visão geral

**Stack**: Vue.js 3 + FastAPI + PostgreSQL + Redis + Docker + Keycloak 