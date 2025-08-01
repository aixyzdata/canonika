// Setup para testes do Quarter
import { vi } from 'vitest'

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

// Mock do window.location
Object.defineProperty(window, 'location', {
  value: {
    href: ''
  },
  writable: true
})

// Mock global do vi para localStorage
global.localStorage = localStorageMock 