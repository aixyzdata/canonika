# 🔧 Correção do Problema de Build do Harbor

## Problema Identificado

O Harbor estava apresentando problemas crônicos de build devido a inconsistências na configuração do Nginx:

1. **Problema Principal**: O `nginx.conf` estava configurado para servir arquivos de `/usr/share/nginx/html/dist`, mas os arquivos estavam sendo copiados para `/usr/share/nginx/html/`

2. **Sintomas**:
   - Página em branco no Harbor
   - Arquivos JavaScript sendo servidos como HTML
   - Assets não carregando corretamente

## Solução Implementada

### 1. Correção do nginx.conf
```nginx
# ANTES (incorreto):
location / {
    root /usr/share/nginx/html/dist;
    try_files $uri $uri/ /index.html;
    index index.html;
}

# DEPOIS (correto):
location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
    index index.html;
}
```

### 2. Script de Build Automatizado
Criado o script `harbor/build-and-deploy.sh` que:
- Limpa builds anteriores
- Instala dependências se necessário
- Faz o build da aplicação
- Verifica se o build foi bem-sucedido
- Rebuild do container Harbor

### 3. Como Usar o Script
```bash
cd harbor/web/
../build-and-deploy.sh
```

## Estrutura Correta dos Arquivos

```
harbor/
├── Dockerfile                    # Copia web/dist/ para /usr/share/nginx/html/
├── nginx/nginx.conf             # Configurado para servir de /usr/share/nginx/html/
└── web/
    ├── dist/                    # Build gerado pelo npm run build
    │   ├── index.html
    │   └── assets/
    ├── package.json
    └── build-and-deploy.sh      # Script de build automatizado
```

## Verificação de Funcionamento

Para verificar se está funcionando:

```bash
# Testar se o HTML está sendo servido
curl -s http://localhost:3701/ | head -5

# Testar se os assets estão sendo servidos corretamente
curl -s http://localhost:3701/assets/index-*.js | head -5

# Verificar se não retorna HTML para arquivos JS
curl -s http://localhost:3701/assets/index-*.js | grep -i "html"
```

## Prevenção de Problemas Futuros

1. **Sempre use o script de build**: `harbor/build-and-deploy.sh`
2. **Verifique a estrutura**: Os arquivos devem estar em `web/dist/` e serem copiados para `/usr/share/nginx/html/`
3. **Teste após mudanças**: Sempre teste se os assets estão sendo servidos corretamente

## Status Atual

✅ **PROBLEMA RESOLVIDO**
- Harbor funcionando em http://localhost:3701
- Assets sendo servidos corretamente
- JavaScript carregando sem erros
- Explorer disponível no menu
- Beacon com 1 subitem (Status) 