<template>
  <div class="hot-reload-test">
    <h2>🧪 Teste de Hot Reload</h2>
    <p>Se você vê esta mensagem, o hot reload está funcionando!</p>
    <p>Timestamp: {{ timestamp }}</p>
    <p>Contador: {{ counter }}</p>
    <button @click="increment">Incrementar</button>
    <div class="status">
      <span class="status-dot online"></span>
      Hot Reload Ativo
    </div>
  </div>
</template>

<script>
export default {
  name: 'HotReloadTest',
  data() {
    return {
      timestamp: new Date().toLocaleTimeString(),
      counter: 0
    }
  },
  methods: {
    increment() {
      this.counter++
    }
  }
}
</script>

<style scoped>
.hot-reload-test {
  padding: 2rem;
  background: linear-gradient(135deg, #334155 0%, #475569 100%);
  border-radius: 1rem;
  border: 2px solid #3b82f6;
  margin: 1rem;
  text-align: center;
}

.hot-reload-test h2 {
  color: #3b82f6;
  margin-bottom: 1rem;
}

.hot-reload-test p {
  color: #e2e8f0;
  margin: 0.5rem 0;
}

.hot-reload-test button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  margin: 1rem 0;
}

.hot-reload-test button:hover {
  background: #2563eb;
}

.status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  color: #10b981;
  font-weight: 600;
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-dot.online {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}
</style> 