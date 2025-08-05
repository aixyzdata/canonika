# language: pt
Funcionalidade: Beacon WebSocket Broker - Sistema Completo
  Como um usuário do sistema Canonika
  Eu quero usar o Beacon como broker de eventos e WebSocket
  Para que eu possa ter comunicação em tempo real entre serviços

  Contexto:
    Dado que estou acessando o Beacon sem autenticação
    E que o sistema Beacon está operacional

  # ========================================
  # CENÁRIOS DE AUTENTICAÇÃO E REDIRECIONAMENTO
  # ========================================

  Cenário: Redirecionamento automático para Quarter
    Quando acesso o Beacon sem estar autenticado
    Então devo ser redirecionado automaticamente para o Quarter
    E a URL deve conter o parâmetro redirect_to com a URL do Beacon

  Cenário: Login no Quarter e retorno para Beacon
    Dado que fui redirecionado para o Quarter com redirect_to
    Quando faço login com credenciais válidas
    E clico no botão "ENTRAR"
    Então devo ser redirecionado de volta para o Beacon
    E devo ver a interface do Beacon
    E minha sessão deve ser preservada

  # ========================================
  # CENÁRIOS ESPECÍFICOS DO PROBLEMA IDENTIFICADO
  # ========================================

  Cenário: Redirecionamento com URL correta do Quarter
    Dado que estou acessando http://localhost:3703/
    Quando o Beacon detecta que não estou autenticado
    Então devo ser redirecionado para http://localhost?redirect_to=http%3A//localhost%3A3703/
    E a URL do Quarter deve estar correta
    E o parâmetro redirect_to deve estar codificado corretamente

  Cenário: Validação de autenticação no localStorage
    Dado que o Beacon verifica minha autenticação
    Quando não há dados de autenticação no localStorage
    Então devo ser redirecionado para o Quarter
    E o Beacon deve limpar dados corrompidos do localStorage

  Cenário: Login no Quarter com credenciais válidas
    Dado que estou na página de login do Quarter
    Quando preencho email com "admin@canonika.io"
    E preencho senha com "admin123"
    E clico no botão "ENTRAR"
    Então devo ser autenticado com sucesso
    E devo ser redirecionado de volta para o Beacon
    E minha sessão deve ser salva no localStorage

  Cenário: Login no Quarter com credenciais inválidas
    Dado que estou na página de login do Quarter
    Quando preencho email com "wrong@email.com"
    E preencho senha com "wrongpass"
    E clico no botão "ENTRAR"
    Então devo ver uma mensagem de erro
    E não devo ser redirecionado
    E devo permanecer na página de login

  Cenário: Retorno do Quarter para Beacon após login
    Dado que fiz login no Quarter com sucesso
    Quando sou redirecionado de volta para o Beacon
    Então devo ver a interface do Beacon
    E não devo ser redirecionado novamente para o Quarter
    E minha sessão deve estar ativa

  Cenário: Logout e limpeza de sessão
    Dado que estou logado no Beacon
    Quando faço logout
    Então minha sessão deve ser limpa do localStorage
    E devo ser redirecionado para o Quarter
    E não devo ter acesso à interface do Beacon

  # ========================================
  # CENÁRIOS DE FALHA E RECUPERAÇÃO
  # ========================================

  Cenário: localStorage corrompido
    Dado que o localStorage contém dados corrompidos
    Quando o Beacon tenta verificar minha autenticação
    Então o Beacon deve lidar com o erro graciosamente
    E devo ser redirecionado para o Quarter
    E os dados corrompidos devem ser limpos

  Cenário: URL do Quarter indisponível
    Dado que o Quarter não está respondendo
    Quando o Beacon tenta redirecionar para o Quarter
    Então devo ver uma mensagem de erro
    E o Beacon deve tentar novamente após um tempo
    E devo ter opção de tentar manualmente

  # ========================================
  # CENÁRIOS DE WEBSOCKET
  # ========================================

  Cenário: Conexão WebSocket bem-sucedida
    Dado que estou logado no Beacon
    Quando a página carrega completamente
    Então o WebSocket deve conectar automaticamente
    E o status da conexão deve mostrar "CONECTADO"
    E o client ID deve ser gerado

  Cenário: Reconexão automática do WebSocket
    Dado que o WebSocket está conectado
    Quando a conexão é perdida
    Então o sistema deve tentar reconectar automaticamente
    E após a reconexão, o status deve voltar para "CONECTADO"
    E as subscrições anteriores devem ser restauradas

  Cenário: Heartbeat do WebSocket
    Dado que o WebSocket está conectado
    Quando o sistema envia heartbeat
    Então o servidor deve responder com timestamp
    E a conexão deve permanecer ativa

  Cenário: Falha na conexão WebSocket
    Dado que o servidor WebSocket está indisponível
    Quando tento conectar
    Então o sistema deve mostrar status "DESCONECTADO"
    E deve tentar reconectar após intervalo

  # ========================================
  # CENÁRIOS DE TÓPICOS E SUBSCRIÇÕES
  # ========================================

  Cenário: Subscrição a um tópico
    Dado que estou logado no Beacon
    E o WebSocket está conectado
    Quando me inscrevo no tópico "sistema.notificacoes"
    Então devo receber confirmação de subscrição
    E o tópico deve aparecer na lista de tópicos ativos

  Cenário: Recebimento de evento em tópico inscrito
    Dado que estou inscrito no tópico "sistema.notificacoes"
    Quando um evento é publicado neste tópico
    Então devo receber o evento em tempo real
    E o evento deve aparecer no log de eventos
    E os dados do evento devem estar corretos

  Cenário: Cancelamento de subscrição
    Dado que estou inscrito no tópico "sistema.notificacoes"
    Quando cancelo a subscrição
    Então devo receber confirmação de cancelamento
    E o tópico deve ser removido da lista de tópicos ativos
    E não devo mais receber eventos deste tópico

  Cenário: Subscrição a múltiplos tópicos
    Dado que estou logado no Beacon
    Quando me inscrevo em vários tópicos
    Então devo receber eventos de todos os tópicos
    E cada tópico deve aparecer na lista separadamente

  # ========================================
  # CENÁRIOS DE PUBLICAÇÃO DE EVENTOS
  # ========================================

  Cenário: Publicação de evento simples
    Dado que estou logado no Beacon
    E o WebSocket está conectado
    Quando publico um evento no tópico "teste.evento"
    Então o evento deve ser enviado com sucesso
    E devo receber confirmação de publicação
    E o evento deve aparecer no log de eventos

  Cenário: Publicação de evento com dados complexos
    Dado que estou logado no Beacon
    Quando publico um evento com dados JSON complexos
    Então o evento deve ser processado corretamente
    E os dados devem ser preservados
    E o evento deve ser distribuído para todos os inscritos

  Cenário: Publicação de evento com prioridade
    Dado que estou logado no Beacon
    Quando publico um evento com prioridade "high"
    Então o evento deve ser marcado com prioridade alta
    E deve ser processado com prioridade
    E a prioridade deve aparecer no log

  Cenário: Publicação de evento com TTL
    Dado que estou logado no Beacon
    Quando publico um evento com TTL de 60 segundos
    Então o evento deve ser processado
    E deve expirar após 60 segundos
    E não deve mais estar disponível após expiração

  # ========================================
  # CENÁRIOS DE MÉTRICAS E MONITORAMENTO
  # ========================================

  Cenário: Visualização de métricas em tempo real
    Dado que estou logado no Beacon
    Quando acesso a página de métricas
    Então devo ver métricas atualizadas em tempo real
    E devo ver número de clientes conectados
    E devo ver número de tópicos ativos
    E devo ver total de mensagens processadas

  Cenário: Histórico de eventos
    Dado que estou logado no Beacon
    Quando acesso o histórico de eventos
    Então devo ver lista de eventos recentes
    E devo ver detalhes de cada evento
    E devo poder filtrar por tópico
    E devo poder filtrar por período

  Cenário: Métricas de performance
    Dado que estou logado no Beacon
    Quando monitoro a performance
    Então devo ver tempo de resposta médio
    E devo ver taxa de mensagens por segundo
    E devo ver uso de memória
    E devo ver uptime do sistema

  # ========================================
  # CENÁRIOS DE CLIENTES E CONEXÕES
  # ========================================

  Cenário: Listagem de clientes conectados
    Dado que estou logado no Beacon
    Quando acesso a lista de clientes
    Então devo ver todos os clientes conectados
    E devo ver informações de cada cliente
    E devo ver tópicos inscritos por cliente
    E devo ver tempo de conexão

  Cenário: Desconexão de cliente
    Dado que há múltiplos clientes conectados
    Quando um cliente se desconecta
    Então o cliente deve ser removido da lista
    E as métricas devem ser atualizadas
    E os outros clientes não devem ser afetados

  Cenário: Reconexão de cliente
    Dado que um cliente se desconectou
    Quando o cliente reconecta
    Então o cliente deve aparecer novamente na lista
    E deve manter o mesmo client ID
    E deve restaurar subscrições anteriores

  # ========================================
  # CENÁRIOS DE COMANDOS E CONTROLE
  # ========================================

  Cenário: Execução de comando get_metrics
    Dado que estou logado no Beacon
    E o WebSocket está conectado
    Quando executo o comando "get_metrics"
    Então devo receber métricas detalhadas do sistema
    E as métricas devem estar atualizadas

  Cenário: Execução de comando get_topics
    Dado que estou logado no Beacon
    Quando executo o comando "get_topics"
    Então devo receber lista de todos os tópicos ativos
    E devo ver número de inscritos por tópico

  Cenário: Execução de comando get_clients
    Dado que estou logado no Beacon
    Quando executo o comando "get_clients"
    Então devo receber lista de todos os clientes
    E devo ver informações detalhadas de cada cliente

  # ========================================
  # CENÁRIOS DE FALHAS E RECUPERAÇÃO
  # ========================================

  Cenário: Falha no servidor WebSocket
    Dado que estou conectado ao WebSocket
    Quando o servidor WebSocket falha
    Então o sistema deve detectar a falha
    E deve tentar reconectar automaticamente
    E deve mostrar status de erro
    E deve restaurar conexão quando servidor voltar

  Cenário: Perda de mensagens durante falha
    Dado que estou conectado ao WebSocket
    Quando a conexão é perdida durante envio de mensagem
    Então a mensagem deve ser enfileirada
    E deve ser reenviada após reconexão
    E não deve haver perda de dados

  Cenário: Limpeza de eventos expirados
    Dado que há eventos com TTL no sistema
    Quando os eventos expiram
    Então os eventos devem ser removidos automaticamente
    E o espaço de memória deve ser liberado
    E as métricas devem ser atualizadas

  # ========================================
  # CENÁRIOS DE PERFORMANCE E CARGA
  # ========================================

  Cenário: Múltiplos clientes conectados
    Dado que há 10 clientes conectados
    Quando todos enviam mensagens simultaneamente
    Então o sistema deve processar todas as mensagens
    E não deve haver perda de performance
    E as métricas devem refletir a carga

  Cenário: Alto volume de eventos
    Dado que estou logado no Beacon
    Quando publico 100 eventos rapidamente
    Então todos os eventos devem ser processados
    E o sistema deve manter performance
    E não deve haver perda de eventos

  Cenário: Múltiplos tópicos ativos
    Dado que há 50 tópicos ativos
    Quando eventos são publicados em vários tópicos
    Então o sistema deve distribuir eventos corretamente
    E cada inscrito deve receber apenas eventos dos tópicos inscritos

  # ========================================
  # CENÁRIOS DE SEGURANÇA E VALIDAÇÃO
  # ========================================

  Cenário: Validação de dados de evento
    Dado que estou logado no Beacon
    Quando tento publicar evento com dados inválidos
    Então o sistema deve rejeitar o evento
    E deve retornar erro de validação
    E o evento não deve ser processado

  Cenário: Proteção contra spam
    Dado que estou logado no Beacon
    Quando envio muitas mensagens rapidamente
    Então o sistema deve limitar a taxa de envio
    E deve proteger contra spam
    E deve manter estabilidade do sistema

  Cenário: Sanitização de dados
    Dado que estou logado no Beacon
    Quando publico evento com dados maliciosos
    Então o sistema deve sanitizar os dados
    E deve prevenir ataques
    E deve manter segurança

  # ========================================
  # CENÁRIOS DE INTEGRAÇÃO COM OUTROS SERVIÇOS
  # ========================================

  Cenário: Integração com Harbor
    Dado que estou logado no Beacon
    Quando o Harbor publica evento
    Então o Beacon deve receber o evento
    E deve distribuir para inscritos
    E deve registrar o evento no log

  Cenário: Integração com Guardian
    Dado que estou logado no Beacon
    Quando o Guardian publica evento de segurança
    Então o Beacon deve processar o evento
    E deve aplicar prioridade alta
    E deve notificar clientes relevantes

  Cenário: Integração com Quarter
    Dado que estou logado no Beacon
    Quando o Quarter publica evento de autenticação
    Então o Beacon deve processar o evento
    E deve atualizar status de autenticação
    E deve notificar outros serviços

  # ========================================
  # CENÁRIOS DE INTERFACE E USABILIDADE
  # ========================================

  Cenário: Navegação entre views
    Dado que estou logado no Beacon
    Quando navego entre dashboard e status
    Então a navegação deve funcionar corretamente
    E o conteúdo deve ser atualizado
    E o estado deve ser preservado

  Cenário: Responsividade da interface
    Dado que estou logado no Beacon
    Quando redimensiono a janela do navegador
    Então a interface deve se adaptar
    E todos os elementos devem permanecer visíveis
    E a funcionalidade deve ser mantida

  Cenário: Acessibilidade
    Dado que estou logado no Beacon
    Quando uso leitor de tela
    Então todos os elementos devem ser acessíveis
    E deve haver navegação por teclado
    E deve haver descrições adequadas

  # ========================================
  # CENÁRIOS DE LOGS E AUDITORIA
  # ========================================

  Cenário: Logs de sistema
    Dado que estou logado no Beacon
    Quando executo ações no sistema
    Então todas as ações devem ser registradas
    E os logs devem conter informações detalhadas
    E os logs devem ser persistentes

  Cenário: Auditoria de eventos
    Dado que estou logado no Beacon
    Quando eventos são processados
    Então deve haver rastreamento completo
    E deve ser possível auditar todas as ações
    E deve haver histórico de auditoria

  Cenário: Exportação de dados
    Dado que estou logado no Beacon
    Quando solicito exportação de dados
    Então os dados devem ser exportados corretamente
    E o formato deve ser adequado
    E deve incluir todas as informações relevantes 