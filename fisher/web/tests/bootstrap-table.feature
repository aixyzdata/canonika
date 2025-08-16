Feature: Bootstrap Table SEFAZ
  Como um usuário do Fisher
  Eu quero que a tela Sefaz use tabelas Bootstrap responsivas
  Para ter uma experiência visual consistente e simples

  Background:
    Given que estou na página Sefaz do Fisher

  Scenario: Verificar se a tabela Bootstrap está funcionando
    When eu clico no botão Sincronizar SEFAZ
    And eu inspeciono a tabela de arquivos CNPJ
    Then eu devo ver uma tabela Bootstrap responsiva
    And a tabela deve ter colunas "Pasta", "Arquivo", "Tamanho", "Status", "Ações"
    And a tabela deve ter pelo menos 5 linhas de dados
    And a tabela deve ter paginação Bootstrap

  Scenario: Verificar funcionalidades da tabela
    When eu clico no botão Sincronizar SEFAZ
    And eu clico no botão de download de um arquivo
    Then deve ser executada a ação de download
    When eu clico no botão de visualizar um arquivo
    Then deve ser executada a ação de visualização

  Scenario: Verificar responsividade da tabela
    When eu clico no botão Sincronizar SEFAZ
    And eu redimensiono a janela do navegador
    Then a tabela deve se adaptar ao novo tamanho
    And a tabela deve permanecer funcional

  Scenario: Verificar navegação entre abas
    When eu clico na aba "Teste de Conexão"
    Then eu devo ver a tabela de testes de conexão
    And a tabela deve mostrar serviços SEFAZ
    And eu devo ver o botão "Executar Testes" 