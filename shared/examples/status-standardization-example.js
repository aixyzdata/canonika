// =============================================================================
// CANONIKA - EXEMPLO DE USO DA PADRONIZAÇÃO DE STATUS
// =============================================================================

import { 
  getStandardizedStatus, 
  getDefaultStatus, 
  checkServiceStatus,
  getServiceStatusConfig,
  isStandardizedStatus,
  parseStandardizedStatus
} from '../config/status-standardization.js'

/**
 * EXEMPLO 1: Uso básico em um componente Vue
 */
export function exemploUsoBasico() {
  // Em um componente Vue
  const headerConfig = {
    logoText: 'CANONIKA',
    logoSubtitle: 'TEMPLATE',
    user: {
      name: 'Administrador',
      initial: 'A'
    },
    systemStatus: getDefaultStatus('template'), // "TEMPLATE ONLINE"
    isOnline: true
  }
  
  return headerConfig
}

/**
 * EXEMPLO 2: Verificação de status em um serviço
 */
export async function exemploVerificacaoStatus() {
  // Verificar status do Template
  const result = await checkServiceStatus('template', 'http://localhost:3790', 3000)
  
  console.log('Status do Template:', result.status) // "TEMPLATE ONLINE" ou "TEMPLATE OFFLINE"
  console.log('Está online?', result.isOnline)
  
  return result
}

/**
 * EXEMPLO 3: Uso em um componente Vue com verificação automática
 */
export const exemploComponenteVue = {
  name: 'ExemploComponente',
  data() {
    return {
      headerConfig: {
        logoText: 'CANONIKA',
        logoSubtitle: 'HARBOR',
        user: {
          name: 'Administrador',
          initial: 'A'
        },
        systemStatus: getDefaultStatus('harbor'), // "HARBOR ONLINE"
        isOnline: true
      }
    }
  },
  async mounted() {
    // Verificar status ao montar o componente
    await this.checkServiceStatus()
  },
  methods: {
    async checkServiceStatus() {
      try {
        const result = await checkServiceStatus('harbor', '', 3000)
        
        // Atualizar status do header
        this.headerConfig.systemStatus = result.status
        this.headerConfig.isOnline = result.isOnline
        
        console.log('Status atualizado:', this.headerConfig.systemStatus)
      } catch (error) {
        console.error('Erro ao verificar status:', error)
        
        // Em caso de erro, definir como offline
        this.headerConfig.systemStatus = getStandardizedStatus('harbor', false)
        this.headerConfig.isOnline = false
      }
    }
  }
}

/**
 * EXEMPLO 4: Uso em múltiplos serviços
 */
export async function exemploMultiplosServicos() {
  const servicos = ['quarter', 'template', 'harbor', 'beacon']
  const resultados = {}
  
  for (const servico of servicos) {
    const resultado = await checkServiceStatus(servico, '', 2000)
    resultados[servico] = resultado
  }
  
  console.log('Status de todos os serviços:', resultados)
  
  return resultados
}

/**
 * EXEMPLO 5: Validação de status padronizado
 */
export function exemploValidacao() {
  const statusValidos = [
    'QUARTER ONLINE',
    'TEMPLATE OFFLINE',
    'HARBOR ONLINE',
    'BEACON WARNING'
  ]
  
  const statusInvalidos = [
    'ONLINE',
    'OFFLINE',
    'Quarter Online',
    'template online'
  ]
  
  console.log('Status válidos:')
  statusValidos.forEach(status => {
    console.log(`${status}: ${isStandardizedStatus(status)}`)
  })
  
  console.log('Status inválidos:')
  statusInvalidos.forEach(status => {
    console.log(`${status}: ${isStandardizedStatus(status)}`)
  })
}

/**
 * EXEMPLO 6: Parse de status padronizado
 */
export function exemploParse() {
  const statusExemplos = [
    'QUARTER ONLINE',
    'TEMPLATE OFFLINE',
    'HARBOR WARNING'
  ]
  
  statusExemplos.forEach(status => {
    const parsed = parseStandardizedStatus(status)
    console.log(`Status: ${status}`)
    console.log(`  Serviço: ${parsed.serviceName}`)
    console.log(`  Online: ${parsed.isOnline}`)
    console.log('---')
  })
}

/**
 * EXEMPLO 7: Configuração de serviço
 */
export function exemploConfiguracao() {
  const servicos = ['quarter', 'template', 'harbor', 'fisher']
  
  servicos.forEach(servico => {
    const config = getServiceStatusConfig(servico)
    console.log(`Configuração do ${servico}:`, config)
  })
} 