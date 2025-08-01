import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../../src/App.vue'

describe('Quarter App Component', () => {
  let wrapper

  beforeEach(() => {
    // Limpar mocks antes de cada teste
    vi.clearAllMocks()
    
    // Mock do window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: ''
      },
      writable: true
    })
    
    wrapper = mount(App)
  })

  describe('Renderização do Componente', () => {
    it('deve renderizar o header com logo Canonika', () => {
      expect(wrapper.find('.logo-text').text()).toBe('CANONIKA')
      expect(wrapper.find('.logo-subtitle').text()).toBe('QUARTER')
    })

    it('deve renderizar o formulário de login', () => {
      expect(wrapper.find('.login-form').exists()).toBe(true)
      expect(wrapper.find('input[type="email"]').exists()).toBe(true)
      expect(wrapper.find('input[type="password"]').exists()).toBe(true)
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('deve ter credenciais padrão preenchidas', () => {
      const emailInput = wrapper.find('input[type="email"]')
      const passwordInput = wrapper.find('input[type="password"]')
      
      expect(emailInput.element.value).toBe('admin@canonika.io')
      expect(passwordInput.element.value).toBe('admin123')
    })
  })

  describe('Validação de Login', () => {
    it('deve aceitar credenciais válidas', async () => {
      const form = wrapper.find('.login-form')
      
      await form.trigger('submit')
      
      // Verificar se localStorage foi chamado
      expect(localStorage.setItem).toHaveBeenCalledWith('canonika_authenticated', 'true')
      expect(localStorage.setItem).toHaveBeenCalledWith('canonika_user', expect.any(String))
    })

    it('deve rejeitar credenciais inválidas', async () => {
      // Alterar credenciais para inválidas
      await wrapper.setData({
        loginForm: {
          email: 'invalid@email.com',
          password: 'wrongpassword'
        }
      })

      const form = wrapper.find('.login-form')
      await form.trigger('submit')

      // Verificar se erro foi exibido
      expect(wrapper.find('.error-message').text()).toBe('Credenciais inválidas.')
    })

    it('deve redirecionar para Harbor após login válido', async () => {
      const form = wrapper.find('.login-form')
      
      await form.trigger('submit')
      
      // Verificar se redirecionamento foi chamado
      expect(window.location.href).toBe('http://localhost:3701')
    })
  })

  describe('Estados do Componente', () => {
    it('deve mostrar erro quando credenciais são inválidas', async () => {
      await wrapper.setData({
        loginForm: {
          email: 'invalid@email.com',
          password: 'wrongpassword'
        }
      })

      const form = wrapper.find('.login-form')
      await form.trigger('submit')

      expect(wrapper.vm.error).toBe('Credenciais inválidas.')
      expect(wrapper.find('.error-message').exists()).toBe(true)
    })

    it('deve limpar erro quando credenciais são válidas', async () => {
      // Primeiro, definir um erro
      await wrapper.setData({ error: 'Erro anterior' })
      expect(wrapper.vm.error).toBe('Erro anterior')

      // Fazer login válido
      const form = wrapper.find('.login-form')
      await form.trigger('submit')

      expect(wrapper.vm.error).toBe(null)
    })
  })

  describe('Métodos do Componente', () => {
    it('deve salvar estado de autenticação corretamente', async () => {
      const form = wrapper.find('.login-form')
      await form.trigger('submit')

      // Verificar se saveAuthState foi chamado
      expect(localStorage.setItem).toHaveBeenCalledWith('canonika_authenticated', 'true')
      expect(localStorage.setItem).toHaveBeenCalledWith('canonika_user', expect.any(String))
    })

    it('deve salvar dados do usuário corretamente', async () => {
      const form = wrapper.find('.login-form')
      await form.trigger('submit')

      // Verificar se dados do usuário foram salvos
      const setItemCalls = localStorage.setItem.mock.calls
      const userDataCall = setItemCalls.find(call => call[0] === 'canonika_user')
      
      expect(userDataCall).toBeDefined()
      const userData = JSON.parse(userDataCall[1])
      expect(userData.email).toBe('admin@canonika.io')
      expect(userData.roles).toContain('canonika_admin')
    })
  })

  describe('Interface do Usuário', () => {
    it('deve ter campos de input acessíveis', () => {
      const emailInput = wrapper.find('input[type="email"]')
      const passwordInput = wrapper.find('input[type="password"]')
      
      expect(emailInput.attributes('placeholder')).toBe('Email')
      expect(passwordInput.attributes('placeholder')).toBe('Senha')
      expect(emailInput.attributes('required')).toBeDefined()
      expect(passwordInput.attributes('required')).toBeDefined()
    })

    it('deve ter botão de submit com texto correto', () => {
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.text()).toContain('ENTRAR')
    })

    it('deve ter status online no header', () => {
      const statusIndicator = wrapper.find('.status-indicator.online')
      expect(statusIndicator.exists()).toBe(true)
    })
  })
}) 