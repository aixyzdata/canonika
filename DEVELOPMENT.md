# 🚀 Canonika - Ambiente de Desenvolvimento

## 📋 Visão Geral

Este ambiente de desenvolvimento permite fazer mudanças em tempo real nos arquivos CSS sem precisar recompilar os containers Docker.

## 🛠️ Configuração

### Pré-requisitos
- Docker e Docker Compose instalados
- Acesso ao terminal

### Estrutura de Arquivos
```
canonika/
├── docker-compose.yml          # Produção
├── docker-compose.dev.yml      # Desenvolvimento (com volumes)
├── dev.sh                      # Script de desenvolvimento
├── shared/styles/              # CSS compartilhado
│   ├── canonika-theme.css
│   └── canonika-icons.css
└── [módulos]/
```

## 🎯 Como Usar

### 1. Iniciar Ambiente de Desenvolvimento
```bash
./dev.sh start
```

### 2. Fazer Mudanças CSS
Edite qualquer arquivo em `./shared/styles/`:
- `canonika-theme.css` - Tema principal
- `canonika-icons.css` - Ícones dos módulos

### 3. Aplicar Mudanças
```bash
./dev.sh css
```

### 4. Verificar Status
```bash
./dev.sh status
```

### 5. Ver Logs
```bash
./dev.sh logs
```

### 6. Parar Ambiente
```bash
./dev.sh stop
```

## 🌐 Acesso aos Módulos

| Módulo | Porta | URL |
|--------|-------|-----|
| Harbor | 7721 | http://localhost:7721 |
| Skipper | 7722 | http://localhost:7722 |
| Wayfinder | 7723 | http://localhost:7723 |
| Mapmaker | 7724 | http://localhost:7724 |
| Quartermaster | 7725 | http://localhost:7725 |
| Ledger | 7726 | http://localhost:7726 |
| Seagull | 7727 | http://localhost:7727 |
| Beacon | 7728 | http://localhost:7728 |
| Dock | 7729 | http://localhost:7729 |
| Guardian | 7730 | http://localhost:7730 |
| Echo | 7731 | http://localhost:7731 |
| Tollgate | 7732 | http://localhost:7732 |

## ⚡ Vantagens do Ambiente de Desenvolvimento

### ✅ **Antes (Produção)**
- Mudanças CSS requerem rebuild completo
- Tempo: 2-5 minutos por mudança
- Processo: `docker-compose build` → `docker-compose up`

### 🚀 **Agora (Desenvolvimento)**
- Mudanças CSS aplicadas em segundos
- Tempo: 10-30 segundos por mudança
- Processo: `./dev.sh css`

## 🔧 Comandos Disponíveis

```bash
./dev.sh start     # Inicia ambiente de desenvolvimento
./dev.sh stop      # Para todos os containers
./dev.sh restart   # Reinicia todos os containers
./dev.sh logs      # Mostra logs dos containers
./dev.sh status    # Mostra status dos containers
./dev.sh css       # Aplica mudanças CSS em tempo real
./dev.sh help      # Mostra ajuda
```

## 📁 Volumes Montados

O ambiente de desenvolvimento usa volumes para os arquivos CSS:

```yaml
volumes:
  - ./shared/styles:/usr/share/nginx/html/shared/styles
```

Isso permite que mudanças nos arquivos CSS sejam refletidas imediatamente nos containers.

## 🎨 Exemplo de Fluxo de Trabalho

1. **Iniciar ambiente:**
   ```bash
   ./dev.sh start
   ```

2. **Editar CSS:**
   ```bash
   # Edite ./shared/styles/canonika-theme.css
   # Faça suas mudanças
   ```

3. **Aplicar mudanças:**
   ```bash
   ./dev.sh css
   ```

4. **Verificar resultado:**
   - Acesse qualquer módulo (ex: http://localhost:7721)
   - As mudanças estarão aplicadas

## 🔍 Troubleshooting

### Containers não iniciam
```bash
# Verificar logs
./dev.sh logs

# Reiniciar tudo
./dev.sh stop
./dev.sh start
```

### Mudanças CSS não aparecem
```bash
# Forçar reinicialização dos containers
./dev.sh css

# Ou reiniciar tudo
./dev.sh restart
```

### Problemas de permissão
```bash
# Tornar script executável
chmod +x dev.sh
```

## 🚀 Produção vs Desenvolvimento

| Aspecto | Produção | Desenvolvimento |
|---------|----------|-----------------|
| Arquivo | `docker-compose.yml` | `docker-compose.dev.yml` |
| Volumes | Não | Sim (CSS compartilhado) |
| Rebuild | Necessário | Não necessário |
| Tempo de mudança | 2-5 min | 10-30 seg |
| Comando | `docker-compose up` | `./dev.sh start` |

## 📝 Notas Importantes

- O ambiente de desenvolvimento usa volumes para os arquivos CSS
- Mudanças são aplicadas reiniciando apenas os containers necessários
- O script `dev.sh` automatiza todo o processo
- Para produção, use o `docker-compose.yml` original

## 🎯 Próximos Passos

1. Use `./dev.sh start` para iniciar o ambiente
2. Faça suas mudanças CSS
3. Use `./dev.sh css` para aplicar
4. Desfrute do desenvolvimento mais rápido! 🚀

## ⚠️ Limitações

### Quando Recompilar é Necessário

Para mudanças que **NÃO** são apenas CSS, você ainda precisa recompilar:

- **Mudanças em HTML/Vue.js** - Requer rebuild
- **Mudanças em JavaScript** - Requer rebuild  
- **Mudanças em Dockerfile** - Requer rebuild
- **Mudanças em dependências** - Requer rebuild
- **Mudanças estruturais** - Requer rebuild

### Comando para Recompilar

```bash
# Para mudanças que não são apenas CSS
docker-compose build [serviço]
docker-compose up -d [serviço]
```

### Exemplo de Fluxo Completo

```bash
# 1. Para mudanças CSS apenas (rápido)
./dev.sh css

# 2. Para mudanças estruturais (mais lento)
docker-compose build harbor
docker-compose up -d harbor
```

## 🎯 Resumo

- **CSS apenas**: Use `./dev.sh css` (10-30 segundos)
- **Mudanças estruturais**: Use `docker-compose build` (2-5 minutos)
- **Desenvolvimento**: Use `./dev.sh start`
- **Produção**: Use `docker-compose up` 