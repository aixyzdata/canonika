FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependências Python
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY api/ .

# Criar diretórios necessários
RUN mkdir -p data/cnpj cache

# Expor porta
EXPOSE 3706

# Comando para iniciar a aplicação
CMD ["python", "main.py"] 