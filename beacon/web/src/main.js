import { createApp } from 'vue'

createApp({
  template: `
    <div style="padding: 2rem; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); min-height: 100vh; color: white; font-family: Arial, sans-serif;">
      <div style="max-width: 800px; margin: 0 auto;">
        <h1 style="text-align: center; color: #60a5fa; font-size: 2.5rem; margin-bottom: 1rem;">🚀 Beacon</h1>
        <p style="text-align: center; color: #94a3b8; font-size: 1.1rem; margin-bottom: 2rem;">Sistema de Monitoramento</p>
        
        <!-- TESTE DE ALTERAÇÃO - Se você vê isso, as mudanças estão funcionando! -->
        <div style="background: #ef4444; color: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 2rem; text-align: center;">
          <h3>🎯 TESTE DE ALTERAÇÃO</h3>
          <p>Se você vê esta caixa vermelha, as alterações estão sendo aplicadas corretamente!</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleTimeString()}</p>
        </div>
        
        <div style="background: rgba(15, 23, 42, 0.6); border-radius: 1rem; padding: 2rem; margin-bottom: 2rem;">
          <h2 style="color: #f1f5f9; margin-bottom: 1rem;">✅ Status do Sistema</h2>
          <p style="color: #94a3b8; margin-bottom: 1rem;">Beacon está funcionando perfeitamente!</p>
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 0.5rem; padding: 1rem;">
            <p style="color: #10b981; margin: 0;">🟢 Sistema Online</p>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
          <div style="background: rgba(15, 23, 42, 0.6); border-radius: 0.75rem; padding: 1.5rem;">
            <h3 style="color: #60a5fa; margin-bottom: 0.5rem;">📡 WebSocket</h3>
            <p style="color: #94a3b8; font-size: 0.9rem;">Conexão em tempo real</p>
            <div style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; display: inline-block; margin-top: 0.5rem;">Ativo</div>
          </div>
          
          <div style="background: rgba(15, 23, 42, 0.6); border-radius: 0.75rem; padding: 1.5rem;">
            <h3 style="color: #60a5fa; margin-bottom: 0.5rem;">🔌 API</h3>
            <p style="color: #94a3b8; font-size: 0.9rem;">Endpoints REST</p>
            <div style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; display: inline-block; margin-top: 0.5rem;">Funcionando</div>
          </div>
          
          <div style="background: rgba(15, 23, 42, 0.6); border-radius: 0.75rem; padding: 1.5rem;">
            <h3 style="color: #60a5fa; margin-bottom: 0.5rem;">⚙️ Configurações</h3>
            <p style="color: #94a3b8; font-size: 0.9rem;">Parâmetros do sistema</p>
            <div style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; display: inline-block; margin-top: 0.5rem;">Pendente</div>
          </div>
        </div>
      </div>
    </div>
  `
}).mount('#app')

console.log('🚀 Beacon iniciado com sucesso!') 