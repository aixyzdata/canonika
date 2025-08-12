// =============================================================================
// CANONIKA - PADRONIZAÇÃO DE STATUS DO SISTEMA
// =============================================================================

/**
 * Função helper para padronizar o status do sistema
 * Formato: [SERVIÇO] [STATUS]
 * Exemplos: "QUARTER ONLINE", "TEMPLATE OFFLINE", "HARBOR ONLINE"
 * 
 * @param {string} serviceName - Nome do serviço (ex: 'quarter', 'template', 'harbor')
 * @param {boolean} isOnline - Status de conectividade
 * @returns {string} Status padronizado
 */
export function getStandardizedStatus(serviceName, isOnline) {
  const status = isOnline ? 'ONLINE' : 'OFFLINE'
  return `${serviceName.toUpperCase()} ${status}`
}

/**
 * Função helper para obter o status padrão inicial de um serviço
 * Usado quando o status ainda não foi verificado
 * 
 * @param {string} serviceName - Nome do serviço
 * @returns {string} Status padrão inicial
 */
export function getDefaultStatus(serviceName) {
  return getStandardizedStatus(serviceName, true) // Assume online por padrão
}

/**
 * Função helper para verificar se um status está no formato padronizado
 * 
 * @param {string} status - Status a ser verificado
 * @returns {boolean} True se está no formato padronizado
 */
export function isStandardizedStatus(status) {
  if (!status || typeof status !== 'string') return false
  
  // Verifica se segue o padrão [SERVIÇO] [STATUS]
  const pattern = /^[A-Z]+\s+(ONLINE|OFFLINE|WARNING)$/
  return pattern.test(status)
}

/**
 * Função helper para extrair informações de um status padronizado
 * 
 * @param {string} status - Status padronizado
 * @returns {object} Objeto com serviceName e isOnline
 */
export function parseStandardizedStatus(status) {
  if (!isStandardizedStatus(status)) {
    return { serviceName: null, isOnline: null }
  }
  
  const parts = status.split(' ')
  const serviceName = parts.slice(0, -1).join(' ').toLowerCase()
  const statusPart = parts[parts.length - 1]
  const isOnline = statusPart === 'ONLINE'
  
  return { serviceName, isOnline }
}

/**
 * Configuração padrão de status para todos os serviços
 */
export const STATUS_CONFIG = {
  // Serviços principais
  QUARTER: {
    name: 'QUARTER',
    defaultStatus: 'QUARTER ONLINE',
    healthEndpoint: '/api/health'
  },
  TEMPLATE: {
    name: 'TEMPLATE',
    defaultStatus: 'TEMPLATE ONLINE',
    healthEndpoint: '/api/health'
  },
  HARBOR: {
    name: 'HARBOR',
    defaultStatus: 'HARBOR ONLINE',
    healthEndpoint: '/api/health'
  },
  BEACON: {
    name: 'BEACON',
    defaultStatus: 'BEACON ONLINE',
    healthEndpoint: '/api/health'
  },
  
  // Serviços de dados
  FISHER: {
    name: 'FISHER',
    defaultStatus: 'FISHER ONLINE',
    healthEndpoint: '/api/health'
  },
  DIVER: {
    name: 'DIVER',
    defaultStatus: 'DIVER ONLINE',
    healthEndpoint: '/api/health'
  },
  
  // Serviços de monitoramento
  SEAGULL: {
    name: 'SEAGULL',
    defaultStatus: 'SEAGULL ONLINE',
    healthEndpoint: '/api/health'
  },
  GUARDIAN: {
    name: 'GUARDIAN',
    defaultStatus: 'GUARDIAN ONLINE',
    healthEndpoint: '/api/health'
  },
  
  // Serviços de navegação
  WAYFINDER: {
    name: 'WAYFINDER',
    defaultStatus: 'WAYFINDER ONLINE',
    healthEndpoint: '/api/health'
  },
  SKIPPER: {
    name: 'SKIPPER',
    defaultStatus: 'SKIPPER ONLINE',
    healthEndpoint: '/api/health'
  },
  
  // Serviços de comunicação
  ECHO: {
    name: 'ECHO',
    defaultStatus: 'ECHO ONLINE',
    healthEndpoint: '/api/health'
  },
  LEDGER: {
    name: 'LEDGER',
    defaultStatus: 'LEDGER ONLINE',
    healthEndpoint: '/api/health'
  },
  
  // Serviços de infraestrutura
  DOCK: {
    name: 'DOCK',
    defaultStatus: 'DOCK ONLINE',
    healthEndpoint: '/api/health'
  },
  MAPMAKER: {
    name: 'MAPMAKER',
    defaultStatus: 'MAPMAKER ONLINE',
    healthEndpoint: '/api/health'
  }
}

/**
 * Função helper para obter configuração de status de um serviço
 * 
 * @param {string} serviceName - Nome do serviço
 * @returns {object} Configuração do serviço
 */
export function getServiceStatusConfig(serviceName) {
  const upperServiceName = serviceName.toUpperCase()
  return STATUS_CONFIG[upperServiceName] || {
    name: upperServiceName,
    defaultStatus: getDefaultStatus(serviceName),
    healthEndpoint: '/api/health'
  }
}

/**
 * Função helper para verificar status de um serviço via API
 * 
 * @param {string} serviceName - Nome do serviço
 * @param {string} baseUrl - URL base do serviço
 * @param {number} timeout - Timeout em ms (padrão: 3000)
 * @returns {Promise<object>} Resultado da verificação
 */
export async function checkServiceStatus(serviceName, baseUrl = '', timeout = 3000) {
  const config = getServiceStatusConfig(serviceName)
  const healthUrl = `${baseUrl}${config.healthEndpoint}`
  
  try {
    console.log(`🔍 Verificando status da API do ${serviceName}...`)
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(timeout)
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log(`✅ API do ${serviceName} está online:`, data)
      
      return {
        success: true,
        status: getStandardizedStatus(serviceName, true),
        isOnline: true,
        data: data
      }
    } else {
      throw new Error(`HTTP ${response.status}`)
    }
  } catch (error) {
    console.error(`❌ Erro ao verificar status da API do ${serviceName}:`, error)
    
    return {
      success: false,
      status: getStandardizedStatus(serviceName, false),
      isOnline: false,
      error: error.message
    }
  }
} 