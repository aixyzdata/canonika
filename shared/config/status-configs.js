// Configurações padronizadas para páginas de status dos serviços

export const serviceConfigs = {
  // ========================================
  // TOLLGATE - REFERÊNCIA
  // ========================================
  tollgate: {
    serviceName: 'Tollgate',
    serviceDescription: 'Sistema de Controle de Créditos e Pagamentos',
    serviceIcon: 'fas fa-credit-card',
    serviceStatus: 'online',
    statusText: 'ONLINE',
    
    metrics: [
      {
        id: 'balance',
        title: 'Saldo de Créditos',
        value: '1.247',
        label: 'Créditos Disponíveis',
        icon: 'fas fa-coins'
      },
      {
        id: 'daily-usage',
        title: 'Uso Diário',
        value: '125',
        label: 'Créditos Utilizados Hoje',
        icon: 'fas fa-chart-line'
      },
      {
        id: 'plan',
        title: 'Plano Ativo',
        value: 'Premium',
        label: 'R$ 149/mês',
        icon: 'fas fa-crown'
      },
      {
        id: 'renewal',
        title: 'Próxima Renovação',
        value: '15/08/2024',
        label: '5 dias restantes',
        icon: 'fas fa-calendar'
      }
    ],
    
    recentActivity: [
      {
        id: 1,
        title: 'Créditos Adicionados',
        description: '500 créditos adicionados ao saldo',
        time: '2 minutos atrás',
        icon: 'fas fa-plus'
      },
      {
        id: 2,
        title: 'Análise de Dados',
        description: 'Processamento de análise consumiu 25 créditos',
        time: '15 minutos atrás',
        icon: 'fas fa-chart-bar'
      },
      {
        id: 3,
        title: 'Processamento IA',
        description: 'Execução de modelo de IA consumiu 10 créditos',
        time: '1 hora atrás',
        icon: 'fas fa-brain'
      }
    ],
    
    systemStatus: [
      {
        id: 'api',
        name: 'API Tollgate',
        description: 'Serviço principal de controle',
        status: 'online',
        port: 'Port 3720'
      },
      {
        id: 'database',
        name: 'PostgreSQL',
        description: 'Banco de dados principal',
        status: 'online',
        port: 'Port 5432'
      },
      {
        id: 'redis',
        name: 'Redis Cache',
        description: 'Cache de sessões',
        status: 'online',
        port: 'Port 6379'
      }
    ],
    
    configurations: [
      {
        id: 'current-plan',
        name: 'Plano Atual',
        value: 'Premium (5.000 créditos/mês)'
      },
      {
        id: 'daily-limit',
        name: 'Limite Diário',
        value: '500 créditos'
      },
      {
        id: 'auto-renewal',
        name: 'Renovação Automática',
        value: 'Ativada'
      }
    ],
    
    actions: [
      {
        id: 'add-credits',
        title: 'Adicionar Créditos',
        description: 'Comprar créditos adicionais',
        icon: 'fas fa-plus',
        handler: () => console.log('Adicionar créditos')
      },
      {
        id: 'change-plan',
        title: 'Alterar Plano',
        description: 'Modificar plano atual',
        icon: 'fas fa-exchange-alt',
        handler: () => console.log('Alterar plano')
      },
      {
        id: 'billing',
        title: 'Faturamento',
        description: 'Ver histórico de pagamentos',
        icon: 'fas fa-file-invoice',
        handler: () => console.log('Ver faturamento')
      }
    ],
    
    primaryAction: {
      text: 'Adicionar Créditos',
      icon: 'fas fa-plus',
      handler: () => console.log('Ação principal')
    }
  },

  // ========================================
  // BEACON - SINALIZAÇÃO
  // ========================================
  beacon: {
    serviceName: 'Beacon',
    serviceDescription: 'Sistema de Sinalização e Comunicação',
    serviceIcon: 'fas fa-broadcast-tower',
    serviceStatus: 'online',
    statusText: 'ONLINE',
    
    metrics: [
      {
        id: 'active-signals',
        title: 'Sinais Ativos',
        value: '24',
        label: 'Sinais Transmitindo',
        icon: 'fas fa-signal'
      },
      {
        id: 'signal-strength',
        title: 'Força do Sinal',
        value: '98%',
        label: 'Qualidade de Transmissão',
        icon: 'fas fa-wifi'
      },
      {
        id: 'coverage-area',
        title: 'Área de Cobertura',
        value: '15km²',
        label: 'Raio de Alcance',
        icon: 'fas fa-map-marked-alt'
      },
      {
        id: 'uptime',
        title: 'Tempo Ativo',
        value: '99.9%',
        label: 'Disponibilidade',
        icon: 'fas fa-clock'
      }
    ],
    
    recentActivity: [
      {
        id: 1,
        title: 'Sinal Transmitido',
        description: 'Nova mensagem enviada para 15 dispositivos',
        time: '1 minuto atrás',
        icon: 'fas fa-paper-plane'
      },
      {
        id: 2,
        title: 'Dispositivo Conectado',
        description: 'Novo beacon registrado na rede',
        time: '5 minutos atrás',
        icon: 'fas fa-link'
      },
      {
        id: 3,
        title: 'Manutenção Programada',
        description: 'Atualização de firmware concluída',
        time: '1 hora atrás',
        icon: 'fas fa-tools'
      }
    ],
    
    systemStatus: [
      {
        id: 'api',
        name: 'API Beacon',
        description: 'Serviço principal de sinalização',
        status: 'online',
        port: 'Port 3701'
      },
      {
        id: 'websocket',
        name: 'WebSocket Server',
        description: 'Conexões em tempo real',
        status: 'online',
        port: 'Port 3702'
      },
      {
        id: 'database',
        name: 'MongoDB',
        description: 'Armazenamento de mensagens',
        status: 'online',
        port: 'Port 27017'
      }
    ],
    
    configurations: [
      {
        id: 'signal-frequency',
        name: 'Frequência de Sinal',
        value: '2.4 GHz'
      },
      {
        id: 'transmission-power',
        name: 'Potência de Transmissão',
        value: '20 dBm'
      },
      {
        id: 'encryption',
        name: 'Criptografia',
        value: 'AES-256'
      }
    ],
    
    actions: [
      {
        id: 'send-signal',
        title: 'Enviar Sinal',
        description: 'Transmitir nova mensagem',
        icon: 'fas fa-broadcast-tower',
        handler: () => console.log('Enviar sinal')
      },
      {
        id: 'configure-network',
        title: 'Configurar Rede',
        description: 'Ajustar parâmetros de rede',
        icon: 'fas fa-network-wired',
        handler: () => console.log('Configurar rede')
      },
      {
        id: 'view-devices',
        title: 'Ver Dispositivos',
        description: 'Listar beacons conectados',
        icon: 'fas fa-list',
        handler: () => console.log('Ver dispositivos')
      }
    ],
    
    primaryAction: {
      text: 'Enviar Sinal',
      icon: 'fas fa-broadcast-tower',
      handler: () => console.log('Enviar sinal')
    }
  },

  // ========================================
  // SKIPPER - ORQUESTRAÇÃO
  // ========================================
  skipper: {
    serviceName: 'Skipper',
    serviceDescription: 'Orquestrador de Navegação e Extração de Dados',
    serviceIcon: 'fas fa-ship',
    serviceStatus: 'online',
    statusText: 'ONLINE',
    
    metrics: [
      {
        id: 'active-simulations',
        title: 'Simulações Ativas',
        value: '3',
        label: 'Processos em Execução',
        icon: 'fas fa-play'
      },
      {
        id: 'extractions-today',
        title: 'Extrações Hoje',
        value: '47',
        label: 'Produtos Processados',
        icon: 'fas fa-download'
      },
      {
        id: 'success-rate',
        title: 'Taxa de Sucesso',
        value: '94%',
        label: 'Extrações Bem-sucedidas',
        icon: 'fas fa-chart-line'
      },
      {
        id: 'avg-processing-time',
        title: 'Tempo Médio',
        value: '2.3s',
        label: 'Por Extração',
        icon: 'fas fa-stopwatch'
      }
    ],
    
    recentActivity: [
      {
        id: 1,
        title: 'Simulação Iniciada',
        description: 'iPhone 15 Pro - Extração iniciada',
        time: '2 minutos atrás',
        icon: 'fas fa-play'
      },
      {
        id: 2,
        title: 'Extração Concluída',
        description: 'Samsung Galaxy S24 - 15 atributos extraídos',
        time: '5 minutos atrás',
        icon: 'fas fa-check'
      },
      {
        id: 3,
        title: 'Fonte Adicionada',
        description: 'Nova fonte de pesquisa configurada',
        time: '1 hora atrás',
        icon: 'fas fa-plus'
      }
    ],
    
    systemStatus: [
      {
        id: 'api',
        name: 'API Skipper',
        description: 'Serviço principal de orquestração',
        status: 'online',
        port: 'Port 3703'
      },
      {
        id: 'postgresql',
        name: 'PostgreSQL',
        description: 'Banco de dados de resultados',
        status: 'online',
        port: 'Port 5432'
      },
      {
        id: 'redis',
        name: 'Redis',
        description: 'Cache de sessões',
        status: 'online',
        port: 'Port 6379'
      },
      {
        id: 'milvus',
        name: 'Milvus',
        description: 'Vetorização de dados',
        status: 'online',
        port: 'Port 19530'
      }
    ],
    
    configurations: [
      {
        id: 'max-concurrent',
        name: 'Máximo Concorrente',
        value: '5 simulações'
      },
      {
        id: 'timeout',
        name: 'Timeout de Extração',
        value: '30 segundos'
      },
      {
        id: 'retry-attempts',
        name: 'Tentativas de Retry',
        value: '3 tentativas'
      }
    ],
    
    actions: [
      {
        id: 'start-simulation',
        title: 'Iniciar Simulação',
        description: 'Executar nova extração',
        icon: 'fas fa-play',
        handler: () => console.log('Iniciar simulação')
      },
      {
        id: 'manage-sources',
        title: 'Gerenciar Fontes',
        description: 'Configurar fontes de pesquisa',
        icon: 'fas fa-cog',
        handler: () => console.log('Gerenciar fontes')
      },
      {
        id: 'view-results',
        title: 'Ver Resultados',
        description: 'Histórico de extrações',
        icon: 'fas fa-chart-bar',
        handler: () => console.log('Ver resultados')
      }
    ],
    
    primaryAction: {
      text: 'Iniciar Simulação',
      icon: 'fas fa-play',
      handler: () => console.log('Iniciar simulação')
    }
  },

  // ========================================
  // GUARDIAN - SEGURANÇA
  // ========================================
  guardian: {
    serviceName: 'Guardian',
    serviceDescription: 'Sistema de Segurança e Proteção',
    serviceIcon: 'fas fa-shield-alt',
    serviceStatus: 'online',
    statusText: 'ONLINE',
    
    metrics: [
      {
        id: 'active-threats',
        title: 'Ameaças Ativas',
        value: '0',
        label: 'Sem ameaças detectadas',
        icon: 'fas fa-shield-check'
      },
      {
        id: 'blocked-attacks',
        title: 'Ataques Bloqueados',
        value: '127',
        label: 'Nas últimas 24h',
        icon: 'fas fa-ban'
      },
      {
        id: 'security-score',
        title: 'Score de Segurança',
        value: '98/100',
        label: 'Nível de Proteção',
        icon: 'fas fa-star'
      },
      {
        id: 'encrypted-data',
        title: 'Dados Criptografados',
        value: '100%',
        label: 'Transmissão Segura',
        icon: 'fas fa-lock'
      }
    ],
    
    recentActivity: [
      {
        id: 1,
        title: 'Ataque Bloqueado',
        description: 'Tentativa de SQL Injection bloqueada',
        time: '5 minutos atrás',
        icon: 'fas fa-shield-alt'
      },
      {
        id: 2,
        title: 'Certificado Renovado',
        description: 'SSL certificate atualizado automaticamente',
        time: '1 hora atrás',
        icon: 'fas fa-certificate'
      },
      {
        id: 3,
        title: 'Backup Realizado',
        description: 'Backup de segurança concluído',
        time: '6 horas atrás',
        icon: 'fas fa-save'
      }
    ],
    
    systemStatus: [
      {
        id: 'api',
        name: 'API Guardian',
        description: 'Serviço principal de segurança',
        status: 'online',
        port: 'Port 3704'
      },
      {
        id: 'firewall',
        name: 'Firewall',
        description: 'Proteção de rede',
        status: 'online',
        port: 'Port 3705'
      },
      {
        id: 'ids',
        name: 'IDS/IPS',
        description: 'Detecção de intrusão',
        status: 'online',
        port: 'Port 3706'
      }
    ],
    
    configurations: [
      {
        id: 'firewall-rules',
        name: 'Regras de Firewall',
        value: '247 regras ativas'
      },
      {
        id: 'encryption-level',
        name: 'Nível de Criptografia',
        value: 'AES-256-GCM'
      },
      {
        id: 'backup-frequency',
        name: 'Frequência de Backup',
        value: 'A cada 6 horas'
      }
    ],
    
    actions: [
      {
        id: 'security-scan',
        title: 'Scan de Segurança',
        description: 'Executar verificação completa',
        icon: 'fas fa-search',
        handler: () => console.log('Scan de segurança')
      },
      {
        id: 'view-logs',
        title: 'Ver Logs',
        description: 'Histórico de eventos de segurança',
        icon: 'fas fa-file-alt',
        handler: () => console.log('Ver logs')
      },
      {
        id: 'configure-rules',
        title: 'Configurar Regras',
        description: 'Gerenciar regras de segurança',
        icon: 'fas fa-cog',
        handler: () => console.log('Configurar regras')
      }
    ],
    
    primaryAction: {
      text: 'Scan de Segurança',
      icon: 'fas fa-search',
      handler: () => console.log('Scan de segurança')
    }
  },

  // ========================================
  // ECHO - COMUNICAÇÃO
  // ========================================
  echo: {
    serviceName: 'Echo',
    serviceDescription: 'Sistema de Chat e Comunicação',
    serviceIcon: 'fas fa-comments',
    serviceStatus: 'online',
    statusText: 'ONLINE',
    
    metrics: [
      {
        id: 'active-chats',
        title: 'Chats Ativos',
        value: '12',
        label: 'Conversas em Andamento',
        icon: 'fas fa-comments'
      },
      {
        id: 'messages-today',
        title: 'Mensagens Hoje',
        value: '1.247',
        label: 'Total de Mensagens',
        icon: 'fas fa-envelope'
      },
      {
        id: 'response-time',
        title: 'Tempo de Resposta',
        value: '1.2s',
        label: 'Média de Resposta',
        icon: 'fas fa-clock'
      },
      {
        id: 'satisfaction',
        title: 'Satisfação',
        value: '4.8/5',
        label: 'Avaliação dos Usuários',
        icon: 'fas fa-smile'
      }
    ],
    
    recentActivity: [
      {
        id: 1,
        title: 'Nova Conversa',
        description: 'Usuário iniciou chat de suporte',
        time: '1 minuto atrás',
        icon: 'fas fa-plus'
      },
      {
        id: 2,
        title: 'Mensagem Enviada',
        description: 'Resposta automática enviada',
        time: '3 minutos atrás',
        icon: 'fas fa-paper-plane'
      },
      {
        id: 3,
        title: 'Chat Finalizado',
        description: 'Conversa marcada como resolvida',
        time: '10 minutos atrás',
        icon: 'fas fa-check'
      }
    ],
    
    systemStatus: [
      {
        id: 'api',
        name: 'API Echo',
        description: 'Serviço principal de comunicação',
        status: 'online',
        port: 'Port 3707'
      },
      {
        id: 'websocket',
        name: 'WebSocket',
        description: 'Conexões em tempo real',
        status: 'online',
        port: 'Port 3708'
      },
      {
        id: 'redis',
        name: 'Redis',
        description: 'Cache de sessões',
        status: 'online',
        port: 'Port 6379'
      }
    ],
    
    configurations: [
      {
        id: 'auto-response',
        name: 'Resposta Automática',
        value: 'Ativada'
      },
      {
        id: 'max-chats',
        name: 'Máximo de Chats',
        value: '50 simultâneos'
      },
      {
        id: 'language',
        name: 'Idioma Principal',
        value: 'Português'
      }
    ],
    
    actions: [
      {
        id: 'start-chat',
        title: 'Iniciar Chat',
        description: 'Criar nova conversa',
        icon: 'fas fa-comment',
        handler: () => console.log('Iniciar chat')
      },
      {
        id: 'view-chats',
        title: 'Ver Conversas',
        description: 'Listar chats ativos',
        icon: 'fas fa-list',
        handler: () => console.log('Ver conversas')
      },
      {
        id: 'configure-bot',
        title: 'Configurar Bot',
        description: 'Ajustar respostas automáticas',
        icon: 'fas fa-robot',
        handler: () => console.log('Configurar bot')
      }
    ],
    
    primaryAction: {
      text: 'Iniciar Chat',
      icon: 'fas fa-comment',
      handler: () => console.log('Iniciar chat')
    }
  },

  // ========================================
  // DOCK - SISTEMA DE DOCKING
  // ========================================
  dock: {
    serviceName: 'Dock',
    serviceDescription: 'Sistema de Docking e Gerenciamento de Recursos',
    serviceIcon: 'fas fa-anchor',
    serviceStatus: 'online',
    statusText: 'ONLINE',
    
    metrics: [
      {
        id: 'active-docks',
        title: 'Docks Ativos',
        value: '8',
        label: 'Recursos Conectados',
        icon: 'fas fa-link'
      },
      {
        id: 'resource-usage',
        title: 'Uso de Recursos',
        value: '67%',
        label: 'Capacidade Utilizada',
        icon: 'fas fa-chart-pie'
      },
      {
        id: 'connection-speed',
        title: 'Velocidade de Conexão',
        value: '1.2GB/s',
        label: 'Taxa de Transferência',
        icon: 'fas fa-tachometer-alt'
      },
      {
        id: 'uptime',
        title: 'Tempo Ativo',
        value: '99.8%',
        label: 'Disponibilidade',
        icon: 'fas fa-clock'
      }
    ],
    
    recentActivity: [
      {
        id: 1,
        title: 'Recurso Conectado',
        description: 'Novo dispositivo dockado automaticamente',
        time: '2 minutos atrás',
        icon: 'fas fa-plus'
      },
      {
        id: 2,
        title: 'Transferência Concluída',
        description: 'Dados sincronizados com sucesso',
        time: '5 minutos atrás',
        icon: 'fas fa-check'
      },
      {
        id: 3,
        title: 'Manutenção Programada',
        description: 'Atualização de firmware concluída',
        time: '1 hora atrás',
        icon: 'fas fa-tools'
      }
    ],
    
    systemStatus: [
      {
        id: 'api',
        name: 'API Dock',
        description: 'Serviço principal de docking',
        status: 'online',
        port: 'Port 3709'
      },
      {
        id: 'database',
        name: 'PostgreSQL',
        description: 'Banco de dados de recursos',
        status: 'online',
        port: 'Port 5432'
      },
      {
        id: 'redis',
        name: 'Redis',
        description: 'Cache de conexões',
        status: 'online',
        port: 'Port 6379'
      }
    ],
    
    configurations: [
      {
        id: 'max-connections',
        name: 'Máximo de Conexões',
        value: '50 simultâneas'
      },
      {
        id: 'auto-dock',
        name: 'Docking Automático',
        value: 'Ativado'
      },
      {
        id: 'sync-interval',
        name: 'Intervalo de Sincronização',
        value: '30 segundos'
      }
    ],
    
    actions: [
      {
        id: 'add-resource',
        title: 'Adicionar Recurso',
        description: 'Conectar novo dispositivo',
        icon: 'fas fa-plus',
        handler: () => console.log('Adicionar recurso')
      },
      {
        id: 'manage-docks',
        title: 'Gerenciar Docks',
        description: 'Configurar pontos de docking',
        icon: 'fas fa-cog',
        handler: () => console.log('Gerenciar docks')
      },
      {
        id: 'view-resources',
        title: 'Ver Recursos',
        description: 'Listar dispositivos conectados',
        icon: 'fas fa-list',
        handler: () => console.log('Ver recursos')
      }
    ],
    
    primaryAction: {
      text: 'Adicionar Recurso',
      icon: 'fas fa-plus',
      handler: () => console.log('Adicionar recurso')
    }
  },

  // ========================================
  // LEDGER - CONTABILIDADE
  // ========================================
  ledger: {
    serviceName: 'Ledger',
    serviceDescription: 'Sistema de Contabilidade e Gestão Financeira',
    serviceIcon: 'fas fa-book',
    serviceStatus: 'online',
    statusText: 'ONLINE',
    
    metrics: [
      {
        id: 'total-transactions',
        title: 'Total de Transações',
        value: '2.847',
        label: 'Este Mês',
        icon: 'fas fa-exchange-alt'
      },
      {
        id: 'total-revenue',
        title: 'Receita Total',
        value: 'R$ 45.230',
        label: 'Receita do Mês',
        icon: 'fas fa-dollar-sign'
      },
      {
        id: 'pending-transactions',
        title: 'Transações Pendentes',
        value: '23',
        label: 'Aguardando Aprovação',
        icon: 'fas fa-clock'
      },
      {
        id: 'balance',
        title: 'Saldo Atual',
        value: 'R$ 12.450',
        label: 'Disponível',
        icon: 'fas fa-wallet'
      }
    ],
    
    recentActivity: [
      {
        id: 1,
        title: 'Transação Aprovada',
        description: 'Pagamento de R$ 1.250 aprovado',
        time: '5 minutos atrás',
        icon: 'fas fa-check'
      },
      {
        id: 2,
        title: 'Nova Transação',
        description: 'Recebimento de R$ 3.400 registrado',
        time: '15 minutos atrás',
        icon: 'fas fa-plus'
      },
      {
        id: 3,
        title: 'Relatório Gerado',
        description: 'Relatório mensal de contabilidade',
        time: '1 hora atrás',
        icon: 'fas fa-file-alt'
      }
    ],
    
    systemStatus: [
      {
        id: 'api',
        name: 'API Ledger',
        description: 'Serviço principal de contabilidade',
        status: 'online',
        port: 'Port 3710'
      },
      {
        id: 'database',
        name: 'PostgreSQL',
        description: 'Banco de dados financeiro',
        status: 'online',
        port: 'Port 5432'
      },
      {
        id: 'backup',
        name: 'Sistema de Backup',
        description: 'Backup automático de dados',
        status: 'online',
        port: 'Port 3711'
      }
    ],
    
    configurations: [
      {
        id: 'fiscal-year',
        name: 'Ano Fiscal',
        value: '2024'
      },
      {
        id: 'currency',
        name: 'Moeda Principal',
        value: 'Real (BRL)'
      },
      {
        id: 'auto-backup',
        name: 'Backup Automático',
        value: 'Diário às 02:00'
      }
    ],
    
    actions: [
      {
        id: 'new-transaction',
        title: 'Nova Transação',
        description: 'Registrar nova transação',
        icon: 'fas fa-plus',
        handler: () => console.log('Nova transação')
      },
      {
        id: 'generate-report',
        title: 'Gerar Relatório',
        description: 'Criar relatório financeiro',
        icon: 'fas fa-chart-bar',
        handler: () => console.log('Gerar relatório')
      },
      {
        id: 'view-transactions',
        title: 'Ver Transações',
        description: 'Histórico completo',
        icon: 'fas fa-list',
        handler: () => console.log('Ver transações')
      }
    ],
    
    primaryAction: {
      text: 'Nova Transação',
      icon: 'fas fa-plus',
      handler: () => console.log('Nova transação')
    }
  },

  // ========================================
  // MAPMAKER - CRIAÇÃO DE MAPAS
  // ========================================
  mapmaker: {
    serviceName: 'Mapmaker',
    serviceDescription: 'Sistema de Criação e Gestão de Mapas',
    serviceIcon: 'fas fa-map-marked-alt',
    serviceStatus: 'online',
    statusText: 'ONLINE',
    
    metrics: [
      {
        id: 'active-maps',
        title: 'Mapas Ativos',
        value: '156',
        label: 'Mapas em Uso',
        icon: 'fas fa-map'
      },
      {
        id: 'total-layers',
        title: 'Camadas Totais',
        value: '2.847',
        label: 'Camadas Criadas',
        icon: 'fas fa-layer-group'
      },
      {
        id: 'storage-used',
        title: 'Armazenamento',
        value: '45.2GB',
        label: 'Espaço Utilizado',
        icon: 'fas fa-hdd'
      },
      {
        id: 'processing-time',
        title: 'Tempo de Processamento',
        value: '1.8s',
        label: 'Média por Mapa',
        icon: 'fas fa-stopwatch'
      }
    ],
    
    recentActivity: [
      {
        id: 1,
        title: 'Mapa Criado',
        description: 'Novo mapa de rotas criado',
        time: '3 minutos atrás',
        icon: 'fas fa-plus'
      },
      {
        id: 2,
        title: 'Camada Adicionada',
        description: 'Camada de tráfego atualizada',
        time: '10 minutos atrás',
        icon: 'fas fa-layer-group'
      },
      {
        id: 3,
        title: 'Exportação Concluída',
        description: 'Mapa exportado em PDF',
        time: '1 hora atrás',
        icon: 'fas fa-download'
      }
    ],
    
    systemStatus: [
      {
        id: 'api',
        name: 'API Mapmaker',
        description: 'Serviço principal de mapas',
        status: 'online',
        port: 'Port 3712'
      },
      {
        id: 'database',
        name: 'PostgreSQL',
        description: 'Banco de dados geoespacial',
        status: 'online',
        port: 'Port 5432'
      },
      {
        id: 'tile-server',
        name: 'Tile Server',
        description: 'Servidor de tiles de mapas',
        status: 'online',
        port: 'Port 3713'
      }
    ],
    
    configurations: [
      {
        id: 'max-maps',
        name: 'Máximo de Mapas',
        value: '1.000 simultâneos'
      },
      {
        id: 'tile-format',
        name: 'Formato de Tiles',
        value: 'PNG 256x256'
      },
      {
        id: 'cache-size',
        name: 'Tamanho do Cache',
        value: '10GB'
      }
    ],
    
    actions: [
      {
        id: 'create-map',
        title: 'Criar Mapa',
        description: 'Criar novo mapa',
        icon: 'fas fa-plus',
        handler: () => console.log('Criar mapa')
      },
      {
        id: 'import-data',
        title: 'Importar Dados',
        description: 'Importar dados geoespaciais',
        icon: 'fas fa-upload',
        handler: () => console.log('Importar dados')
      },
      {
        id: 'view-maps',
        title: 'Ver Mapas',
        description: 'Listar todos os mapas',
        icon: 'fas fa-list',
        handler: () => console.log('Ver mapas')
      }
    ],
    
    primaryAction: {
      text: 'Criar Mapa',
      icon: 'fas fa-plus',
      handler: () => console.log('Criar mapa')
    }
  },

  // ========================================
  // QUARTER - GESTÃO DE USUÁRIOS
  // ========================================
  quarter: {
    serviceName: 'Quarter',
    serviceDescription: 'Sistema de Gestão de Usuários e Autenticação',
    serviceIcon: 'fas fa-users-cog',
    serviceStatus: 'online',
    statusText: 'ONLINE',
    
    metrics: [
      {
        id: 'total-users',
        title: 'Total de Usuários',
        value: '1.247',
        label: 'Usuários Registrados',
        icon: 'fas fa-users'
      },
      {
        id: 'active-users',
        title: 'Usuários Ativos',
        value: '1.156',
        label: 'Logados Hoje',
        icon: 'fas fa-user-check'
      },
      {
        id: 'new-users',
        title: 'Novos Usuários',
        value: '89',
        label: 'Registrados Hoje',
        icon: 'fas fa-user-plus'
      },
      {
        id: 'admins',
        title: 'Administradores',
        value: '12',
        label: 'Usuários Admin',
        icon: 'fas fa-shield-alt'
      }
    ],
    
    recentActivity: [
      {
        id: 1,
        title: 'Novo Usuário Registrado',
        description: 'João Silva criou sua conta',
        time: '5 minutos atrás',
        icon: 'fas fa-user-plus'
      },
      {
        id: 2,
        title: 'Login Realizado',
        description: 'Maria Santos fez login',
        time: '10 minutos atrás',
        icon: 'fas fa-sign-in-alt'
      },
      {
        id: 3,
        title: 'Permissão Alterada',
        description: 'Pedro Costa promovido a gerente',
        time: '1 hora atrás',
        icon: 'fas fa-user-edit'
      }
    ],
    
    systemStatus: [
      {
        id: 'api',
        name: 'API Quarter',
        description: 'Serviço principal de autenticação',
        status: 'online',
        port: 'Port 3714'
      },
      {
        id: 'database',
        name: 'PostgreSQL',
        description: 'Banco de dados de usuários',
        status: 'online',
        port: 'Port 5432'
      },
      {
        id: 'redis',
        name: 'Redis',
        description: 'Cache de sessões',
        status: 'online',
        port: 'Port 6379'
      }
    ],
    
    configurations: [
      {
        id: 'session-timeout',
        name: 'Timeout de Sessão',
        value: '24 horas'
      },
      {
        id: 'max-login-attempts',
        name: 'Tentativas de Login',
        value: '5 tentativas'
      },
      {
        id: 'password-policy',
        name: 'Política de Senha',
        value: 'Mínimo 8 caracteres'
      }
    ],
    
    actions: [
      {
        id: 'add-user',
        title: 'Adicionar Usuário',
        description: 'Criar novo usuário',
        icon: 'fas fa-user-plus',
        handler: () => console.log('Adicionar usuário')
      },
      {
        id: 'manage-roles',
        title: 'Gerenciar Roles',
        description: 'Configurar permissões',
        icon: 'fas fa-user-shield',
        handler: () => console.log('Gerenciar roles')
      },
      {
        id: 'view-users',
        title: 'Ver Usuários',
        description: 'Listar todos os usuários',
        icon: 'fas fa-list',
        handler: () => console.log('Ver usuários')
      }
    ],
    
    primaryAction: {
      text: 'Adicionar Usuário',
      icon: 'fas fa-user-plus',
      handler: () => console.log('Adicionar usuário')
    }
  },

  // ========================================
  // SEAGULL - VIGILÂNCIA
  // ========================================
  seagull: {
    serviceName: 'Seagull',
    serviceDescription: 'Sistema de Vigilância e Monitoramento',
    serviceIcon: 'fas fa-eye',
    serviceStatus: 'online',
    statusText: 'ONLINE',
    
    metrics: [
      {
        id: 'active-cameras',
        title: 'Câmeras Ativas',
        value: '24',
        label: 'Dispositivos Online',
        icon: 'fas fa-video'
      },
      {
        id: 'detection-rate',
        title: 'Taxa de Detecção',
        value: '98.5%',
        label: 'Precisão de Detecção',
        icon: 'fas fa-bullseye'
      },
      {
        id: 'alerts-today',
        title: 'Alertas Hoje',
        value: '47',
        label: 'Eventos Detectados',
        icon: 'fas fa-bell'
      },
      {
        id: 'storage-used',
        title: 'Armazenamento',
        value: '2.3TB',
        label: 'Gravações Salvadas',
        icon: 'fas fa-hdd'
      }
    ],
    
    recentActivity: [
      {
        id: 1,
        title: 'Movimento Detectado',
        description: 'Atividade detectada na câmera 3',
        time: '2 minutos atrás',
        icon: 'fas fa-running'
      },
      {
        id: 2,
        title: 'Alerta Processado',
        description: 'Análise de segurança concluída',
        time: '5 minutos atrás',
        icon: 'fas fa-shield-check'
      },
      {
        id: 3,
        title: 'Backup Realizado',
        description: 'Gravações salvas automaticamente',
        time: '1 hora atrás',
        icon: 'fas fa-save'
      }
    ],
    
    systemStatus: [
      {
        id: 'api',
        name: 'API Seagull',
        description: 'Serviço principal de vigilância',
        status: 'online',
        port: 'Port 3715'
      },
      {
        id: 'database',
        name: 'PostgreSQL',
        description: 'Banco de dados de eventos',
        status: 'online',
        port: 'Port 5432'
      },
      {
        id: 'storage',
        name: 'Sistema de Storage',
        description: 'Armazenamento de gravações',
        status: 'online',
        port: 'Port 3716'
      }
    ],
    
    configurations: [
      {
        id: 'recording-quality',
        name: 'Qualidade de Gravação',
        value: '1080p HD'
      },
      {
        id: 'motion-sensitivity',
        name: 'Sensibilidade de Movimento',
        value: 'Média'
      },
      {
        id: 'retention-period',
        name: 'Período de Retenção',
        value: '30 dias'
      }
    ],
    
    actions: [
      {
        id: 'view-cameras',
        title: 'Ver Câmeras',
        description: 'Acessar feeds ao vivo',
        icon: 'fas fa-video',
        handler: () => console.log('Ver câmeras')
      },
      {
        id: 'configure-alerts',
        title: 'Configurar Alertas',
        description: 'Ajustar detecções',
        icon: 'fas fa-cog',
        handler: () => console.log('Configurar alertas')
      },
      {
        id: 'view-recordings',
        title: 'Ver Gravações',
        description: 'Histórico de eventos',
        icon: 'fas fa-history',
        handler: () => console.log('Ver gravações')
      }
    ],
    
    primaryAction: {
      text: 'Ver Câmeras',
      icon: 'fas fa-video',
      handler: () => console.log('Ver câmeras')
    }
  },

  // ========================================
  // DIVER - CONSULTA CANÔNICA
  // ========================================
  diver: {
    serviceName: 'Diver',
    serviceDescription: 'Sistema de Consulta Canônica de Produtos e Empresas',
    serviceIcon: 'fas fa-search',
    serviceStatus: 'online',
    statusText: 'ONLINE',
    
    metrics: [
      {
        id: 'total-consultas',
        title: 'Consultas Realizadas',
        value: '1.247',
        label: 'Este Mês',
        icon: 'fas fa-search'
      },
      {
        id: 'produtos-encontrados',
        title: 'Produtos Encontrados',
        value: '892',
        label: 'Fichas Técnicas',
        icon: 'fas fa-box'
      },
      {
        id: 'empresas-cadastradas',
        title: 'Empresas Cadastradas',
        value: '156',
        label: 'Dados Canônicos',
        icon: 'fas fa-building'
      },
      {
        id: 'taxa-sucesso',
        title: 'Taxa de Sucesso',
        value: '94%',
        label: 'Consultas Bem-sucedidas',
        icon: 'fas fa-chart-line'
      }
    ],
    
    recentActivity: [
      {
        id: 1,
        title: 'Consulta Realizada',
        description: 'iPhone 15 Pro - Ficha técnica encontrada',
        time: '2 minutos atrás',
        icon: 'fas fa-search'
      },
      {
        id: 2,
        title: 'Empresa Cadastrada',
        description: 'Apple Inc. - Dados canônicos salvos',
        time: '5 minutos atrás',
        icon: 'fas fa-building'
      },
      {
        id: 3,
        title: 'NFe Processada',
        description: 'Nota fiscal com 12 produtos processados',
        time: '1 hora atrás',
        icon: 'fas fa-file-invoice'
      }
    ],
    
    systemStatus: [
      {
        id: 'api',
        name: 'API Diver',
        description: 'Serviço principal de consulta',
        status: 'online',
        port: 'Port 7723'
      },
      {
        id: 'wayfinder',
        name: 'Wayfinder',
        description: 'Base de dados canônica',
        status: 'online',
        port: 'Port 3717'
      },
      {
        id: 'skipper',
        name: 'Skipper',
        description: 'Enriquecimento de dados',
        status: 'online',
        port: 'Port 3703'
      }
    ],
    
    configurations: [
      {
        id: 'cache-timeout',
        name: 'Timeout de Cache',
        value: '24 horas'
      },
      {
        id: 'max-results',
        name: 'Máximo de Resultados',
        value: '50 por consulta'
      },
      {
        id: 'auto-enrichment',
        name: 'Enriquecimento Automático',
        value: 'Ativado'
      }
    ],
    
    actions: [
      {
        id: 'consulta-produto',
        title: 'Consultar Produto',
        description: 'Buscar por EAN ou descrição',
        icon: 'fas fa-search',
        handler: () => console.log('Consultar produto')
      },
      {
        id: 'upload-nfe',
        title: 'Upload NFe',
        description: 'Processar nota fiscal',
        icon: 'fas fa-file-upload',
        handler: () => console.log('Upload NFe')
      },
      {
        id: 'historico-consultas',
        title: 'Histórico',
        description: 'Ver consultas anteriores',
        icon: 'fas fa-history',
        handler: () => console.log('Histórico')
      }
    ],
    
    primaryAction: {
      text: 'Consultar Produto',
      icon: 'fas fa-search',
      handler: () => console.log('Consultar produto')
    }
  },

  // ========================================
  // FISHER - PESCA DE DADOS
  // ========================================
  fisher: {
    serviceName: 'Fisher',
    serviceDescription: 'Sistema de Pesca de Dados em Fontes Externas',
    serviceIcon: 'fas fa-fish',
    serviceStatus: 'online',
    statusText: 'ONLINE',
    
    metrics: [
      {
        id: 'missoes-executadas',
        title: 'Missões Executadas',
        value: '47',
        label: 'Este Mês',
        icon: 'fas fa-rocket'
      },
      {
        id: 'dados-processados',
        title: 'Dados Processados',
        value: '2.3M',
        label: 'Registros Extraídos',
        icon: 'fas fa-database'
      },
      {
        id: 'fontes-ativas',
        title: 'Fontes Ativas',
        value: '8',
        label: 'Fontes Configuradas',
        icon: 'fas fa-link'
      },
      {
        id: 'taxa-sucesso',
        title: 'Taxa de Sucesso',
        value: '96%',
        label: 'Missões Bem-sucedidas',
        icon: 'fas fa-chart-line'
      }
    ],
    
    recentActivity: [
      {
        id: 1,
        title: 'Missão Concluída',
        description: 'Receita Federal - 15.2K registros processados',
        time: '5 minutos atrás',
        icon: 'fas fa-check'
      },
      {
        id: 2,
        title: 'Nova Fonte Adicionada',
        description: 'Open Food Facts configurada',
        time: '1 hora atrás',
        icon: 'fas fa-plus'
      },
      {
        id: 3,
        title: 'Dados Normalizados',
        description: '2.1M registros convertidos para formato canônico',
        time: '2 horas atrás',
        icon: 'fas fa-cogs'
      }
    ],
    
    systemStatus: [
      {
        id: 'api',
        name: 'API Fisher',
        description: 'Serviço principal de pesca',
        status: 'online',
        port: 'Port 7724'
      },
      {
        id: 'database',
        name: 'PostgreSQL',
        description: 'Banco de dados de resultados',
        status: 'online',
        port: 'Port 5432'
      },
      {
        id: 'storage',
        name: 'Sistema de Storage',
        description: 'Armazenamento de dados brutos',
        status: 'online',
        port: 'Port 7725'
      }
    ],
    
    configurations: [
      {
        id: 'update-frequency',
        name: 'Frequência de Atualização',
        value: 'Diária'
      },
      {
        id: 'retry-policy',
        name: 'Política de Retry',
        value: '3 tentativas'
      },
      {
        id: 'data-retention',
        name: 'Retenção de Dados',
        value: '90 dias'
      }
    ],
    
    actions: [
      {
        id: 'executar-missao',
        title: 'Executar Missão',
        description: 'Iniciar nova pesca de dados',
        icon: 'fas fa-rocket',
        handler: () => console.log('Executar missão')
      },
      {
        id: 'gerenciar-fontes',
        title: 'Gerenciar Fontes',
        description: 'Configurar fontes de dados',
        icon: 'fas fa-cog',
        handler: () => console.log('Gerenciar fontes')
      },
      {
        id: 'ver-historico',
        title: 'Ver Histórico',
        description: 'Histórico de missões',
        icon: 'fas fa-history',
        handler: () => console.log('Ver histórico')
      }
    ],
    
    primaryAction: {
      text: 'Executar Missão',
      icon: 'fas fa-rocket',
      handler: () => console.log('Executar missão')
    }
  },

  // ========================================
  // WAYFINDER - NAVEGAÇÃO
  // ========================================
  wayfinder: {
    serviceName: 'Wayfinder',
    serviceDescription: 'Sistema de Navegação e Roteamento',
    serviceIcon: 'fas fa-route',
    serviceStatus: 'online',
    statusText: 'ONLINE',
    
    metrics: [
      {
        id: 'active-routes',
        title: 'Rotas Ativas',
        value: '156',
        label: 'Navegações em Andamento',
        icon: 'fas fa-route'
      },
      {
        id: 'avg-travel-time',
        title: 'Tempo Médio',
        value: '23min',
        label: 'Tempo de Viagem',
        icon: 'fas fa-clock'
      },
      {
        id: 'traffic-score',
        title: 'Score de Tráfego',
        value: '8.5/10',
        label: 'Condições de Tráfego',
        icon: 'fas fa-chart-line'
      },
      {
        id: 'fuel-efficiency',
        title: 'Eficiência',
        value: '92%',
        label: 'Economia de Combustível',
        icon: 'fas fa-gas-pump'
      }
    ],
    
    recentActivity: [
      {
        id: 1,
        title: 'Nova Rota Calculada',
        description: 'Rota otimizada para destino',
        time: '3 minutos atrás',
        icon: 'fas fa-route'
      },
      {
        id: 2,
        title: 'Tráfego Atualizado',
        description: 'Condições de tráfego atualizadas',
        time: '5 minutos atrás',
        icon: 'fas fa-traffic-light'
      },
      {
        id: 3,
        title: 'Desvio Aplicado',
        description: 'Rota alterada devido a obstáculo',
        time: '10 minutos atrás',
        icon: 'fas fa-arrow-right'
      }
    ],
    
    systemStatus: [
      {
        id: 'api',
        name: 'API Wayfinder',
        description: 'Serviço principal de navegação',
        status: 'online',
        port: 'Port 3717'
      },
      {
        id: 'database',
        name: 'PostgreSQL',
        description: 'Banco de dados de rotas',
        status: 'online',
        port: 'Port 5432'
      },
      {
        id: 'gps',
        name: 'Sistema GPS',
        description: 'Serviço de localização',
        status: 'online',
        port: 'Port 3718'
      }
    ],
    
    configurations: [
      {
        id: 'route-preference',
        name: 'Preferência de Rota',
        value: 'Mais Rápida'
      },
      {
        id: 'traffic-updates',
        name: 'Atualizações de Tráfego',
        value: 'A cada 5 minutos'
      },
      {
        id: 'fuel-efficiency',
        name: 'Modo Econômico',
        value: 'Ativado'
      }
    ],
    
    actions: [
      {
        id: 'calculate-route',
        title: 'Calcular Rota',
        description: 'Criar nova rota',
        icon: 'fas fa-route',
        handler: () => console.log('Calcular rota')
      },
      {
        id: 'view-traffic',
        title: 'Ver Tráfego',
        description: 'Condições de tráfego',
        icon: 'fas fa-traffic-light',
        handler: () => console.log('Ver tráfego')
      },
      {
        id: 'manage-routes',
        title: 'Gerenciar Rotas',
        description: 'Histórico de navegação',
        icon: 'fas fa-list',
        handler: () => console.log('Gerenciar rotas')
      }
    ],
    
    primaryAction: {
      text: 'Calcular Rota',
      icon: 'fas fa-route',
      handler: () => console.log('Calcular rota')
    }
  }
}

// Função para obter configuração de um serviço
export function getServiceConfig(serviceName) {
  return serviceConfigs[serviceName] || null
}

// Função para listar todos os serviços disponíveis
export function getAvailableServices() {
  return Object.keys(serviceConfigs)
} 