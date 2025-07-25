# Canonika - Plataforma de Desenvolvimento Simplificada

## 🚀 Ambiente de Desenvolvimento Rápido

O Canonika agora possui um ambiente de desenvolvimento simplificado e funcional, focado em velocidade e produtividade.

### 📋 Pré-requisitos

- Docker e Docker Compose
- Git

### 🏃‍♂️ Início Rápido

```bash
# Clone o repositório
git clone <repository-url>
cd canonika

# Inicie o ambiente de desenvolvimento
./dev.sh start
```

### 🌐 Serviços Disponíveis

Após iniciar o ambiente, você terá acesso aos seguintes serviços:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Harbor** | http://localhost:3701 | Portal principal e dashboard |
| **Skipper** | http://localhost:3702 | Orquestrador de navegação e extração |
| **Tollgate** | http://localhost:3703 | Sistema de controle e auditoria |
| **Quarter** | http://localhost:3704 | Gerenciamento de recursos |

### 🗄️ Infraestrutura

- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### 🛠️ Comandos de Desenvolvimento

```bash
# Iniciar ambiente
./dev.sh start

# Parar ambiente
./dev.sh stop

# Reiniciar ambiente
./dev.sh restart

# Ver logs em tempo real
./dev.sh logs

# Verificar status dos containers
./dev.sh status

# Reconstruir imagens
./dev.sh rebuild

# Limpar tudo (containers, volumes, imagens)
./dev.sh clean

# Mostrar ajuda
./dev.sh help
```

### 🏗️ Arquitetura Simplificada

O ambiente atual inclui apenas os serviços essenciais:

- **Harbor**: Portal principal com dashboard
- **Skipper**: Sistema de simulação e extração de dados
- **Tollgate**: Controle de acesso e auditoria
- **Quarter**: Gerenciamento de recursos

### 🔧 Desenvolvimento

#### Estrutura de Volumes

Os containers estão configurados com volumes para desenvolvimento em tempo real:

- `./shared/styles` → `/usr/share/nginx/html/shared/styles`
- `./{service}/web` → `/usr/share/nginx/html`
- `./{service}/api` → `/app/api`

#### Hot Reload

As mudanças nos arquivos são refletidas automaticamente nos containers. Para aplicar mudanças:

1. Edite os arquivos no seu editor
2. As mudanças são aplicadas automaticamente
3. Recarregue a página no navegador

### 🐛 Troubleshooting

#### Problemas Comuns

**Container não inicia:**
```bash
./dev.sh clean
./dev.sh rebuild
```

**Porta já em uso:**
```bash
# Verifique se há outros containers rodando
docker ps
# Pare containers conflitantes
docker stop <container-id>
```

**Problemas de permissão:**
```bash
# No macOS/Linux
chmod +x dev.sh
```

### 📁 Estrutura do Projeto

```
canonika/
├── harbor/          # Portal principal
├── skipper/         # Orquestrador
├── tollgate/        # Controle e auditoria
├── quarter/         # Gerenciamento
├── shared/          # Estilos e templates compartilhados
├── docker-compose.yml
└── dev.sh           # Script de desenvolvimento
```

### 🎯 Próximos Passos

1. **Desenvolvimento**: Foque no desenvolvimento dos módulos principais
2. **Testes**: Implemente testes automatizados
3. **Documentação**: Documente APIs e funcionalidades
4. **Deploy**: Configure ambiente de produção

### 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Desenvolva e teste suas mudanças
4. Envie um pull request

### 📞 Suporte

Para dúvidas ou problemas:

- Abra uma issue no GitHub
- Consulte a documentação em `DEVELOPMENT.md`
- Verifique os logs com `./dev.sh logs`

---

**Canonika** - Desenvolvimento simplificado, resultados extraordinários! 🚀 