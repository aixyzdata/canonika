import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../../App.vue'

describe('Harbor App Component - Logout', () => {
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
    
    // Mock do localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    })
    
    wrapper = mount(App)
  })

  describe('Logout Functionality', () => {
    it('deve limpar o estado do usuário ao fazer logout', async () => {
      // Given: Usuário está logado
      await wrapper.setData({
        user: {
          id: 'user-001',
          name: 'Test User',
          email: 'test@example.com'
        }
      })
      expect(wrapper.vm.user).toBeTruthy()

      // When: Executar logout
      await wrapper.vm.logout()

      // Then: Usuário deve ser null
      expect(wrapper.vm.user).toBeNull()
    })

    it('deve limpar o localStorage ao fazer logout', async () => {
      // Given: Usuário está logado
      await wrapper.setData({
        user: {
          id: 'user-001',
          name: 'Test User',
          email: 'test@example.com'
        }
      })

      // When: Executar logout
      await wrapper.vm.logout()

      // Then: localStorage deve ser limpo
      expect(localStorage.removeItem).toHaveBeenCalledWith('canonika_user')
      expect(localStorage.removeItem).toHaveBeenCalledWith('canonika_authenticated')
    })

    it('deve redirecionar para o Quarter ao fazer logout', async () => {
      // Given: Usuário está logado
      await wrapper.setData({
        user: {
          id: 'user-001',
          name: 'Test User',
          email: 'test@example.com'
        }
      })

      // When: Executar logout
      await wrapper.vm.logout()

      // Then: Deve redirecionar para o Quarter
      expect(window.location.href).toBe('http://localhost:80')
    })

    it('deve executar clearAuthState ao fazer logout', async () => {
      // Given: Usuário está logado
      await wrapper.setData({
        user: {
          id: 'user-001',
          name: 'Test User',
          email: 'test@example.com'
        }
      })

      // Spy no método clearAuthState
      const clearAuthStateSpy = vi.spyOn(wrapper.vm, 'clearAuthState')

      // When: Executar logout
      await wrapper.vm.logout()

      // Then: clearAuthState deve ser chamado
      expect(clearAuthStateSpy).toHaveBeenCalled()
    })
  })

  describe('Logout Button', () => {
    it('deve ter botão de logout visível quando usuário está logado', async () => {
      // Given: Usuário está logado
      await wrapper.setData({
        user: {
          id: 'user-001',
          name: 'Test User',
          email: 'test@example.com'
        }
      })

      // Then: Botão de logout deve estar visível
      const logoutButton = wrapper.find('.logout-btn')
      expect(logoutButton.exists()).toBe(true)
      expect(logoutButton.text()).toContain('Sair')
    })

    it('deve executar logout quando botão é clicado', async () => {
      // Given: Usuário está logado
      await wrapper.setData({
        user: {
          id: 'user-001',
          name: 'Test User',
          email: 'test@example.com'
        }
      })

      // Spy no método logout
      const logoutSpy = vi.spyOn(wrapper.vm, 'logout')

      // When: Clicar no botão de logout
      const logoutButton = wrapper.find('.logout-btn')
      await logoutButton.trigger('click')

      // Then: Método logout deve ser chamado
      expect(logoutSpy).toHaveBeenCalled()
    })

    it('deve ter ícone de logout no botão', async () => {
      // Given: Usuário está logado
      await wrapper.setData({
        user: {
          id: 'user-001',
          name: 'Test User',
          email: 'test@example.com'
        }
      })

      // Then: Botão deve ter ícone
      const logoutButton = wrapper.find('.logout-btn')
      const icon = logoutButton.find('i.fas.fa-sign-out-alt')
      expect(icon.exists()).toBe(true)
    })
  })

  describe('Logout Integration', () => {
    it('deve limpar todos os dados de autenticação ao fazer logout', async () => {
      // Given: Usuário está logado com dados no localStorage
      localStorage.setItem('canonika_user', JSON.stringify({
        id: 'user-001',
        name: 'Test User',
        email: 'test@example.com'
      }))
      localStorage.setItem('canonika_authenticated', 'true')

      await wrapper.setData({
        user: {
          id: 'user-001',
          name: 'Test User',
          email: 'test@example.com'
        }
      })

      // When: Executar logout
      await wrapper.vm.logout()

      // Then: Todos os dados devem ser removidos
      expect(localStorage.removeItem).toHaveBeenCalledWith('canonika_user')
      expect(localStorage.removeItem).toHaveBeenCalledWith('canonika_authenticated')
      expect(wrapper.vm.user).toBeNull()
    })

    it('deve redirecionar corretamente após logout completo', async () => {
      // Given: Usuário está logado
      await wrapper.setData({
        user: {
          id: 'user-001',
          name: 'Test User',
          email: 'test@example.com'
        }
      })

      // When: Executar logout
      await wrapper.vm.logout()

      // Then: Deve redirecionar para Quarter e limpar dados
      expect(window.location.href).toBe('http://localhost:80')
      expect(wrapper.vm.user).toBeNull()
      expect(localStorage.removeItem).toHaveBeenCalled()
    })
  })
}) 