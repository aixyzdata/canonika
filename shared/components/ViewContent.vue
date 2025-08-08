<template>
  <div class="canonika-view-content">
    <!-- Header da View -->
    <div v-if="title || subtitle" class="view-header">
      <div class="view-title-section">
        <h1 v-if="title" class="view-title">{{ title }}</h1>
        <p v-if="subtitle" class="view-subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="actions" class="view-actions">
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <div class="view-main-content">
      <slot></slot>
    </div>

    <!-- Footer da View (opcional) -->
    <div v-if="$slots.footer" class="view-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CanonikaViewContent',
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    actions: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
/* View Content - Padrão Canonika */
.canonika-view-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
  color: #e2e8f0;
}

/* Header da View */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #64748b;
  background: #334155;
  flex-shrink: 0;
}

.view-title-section {
  flex: 1;
}

.view-title {
  font-size: 2rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.5rem;
  line-height: 1.2;
}

.view-subtitle {
  font-size: 1.125rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.5;
}

.view-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

/* Conteúdo Principal */
.view-main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
  color: #e2e8f0;
}

/* Footer da View */
.view-footer {
  padding: 1rem 2rem;
  border-top: 1px solid #64748b;
  background: #334155;
  flex-shrink: 0;
}

/* Quando dentro de sidebar-collapsed (usuário autenticado) */
.sidebar-collapsed .canonika-view-content {
  background: #f8f9fa;
  color: #212529;
}

.sidebar-collapsed .view-header {
  border-bottom-color: #e9ecef;
  background: white;
}

.sidebar-collapsed .view-title {
  color: #212529;
}

.sidebar-collapsed .view-subtitle {
  color: #6c757d;
}

.sidebar-collapsed .view-main-content {
  background: #f8f9fa;
  color: #212529;
}

.sidebar-collapsed .view-footer {
  border-top-color: #e9ecef;
  background: white;
}

/* Responsive */
@media (max-width: 768px) {
  .view-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .view-title {
    font-size: 1.5rem;
  }
  
  .view-subtitle {
    font-size: 1rem;
  }
  
  .view-main-content {
    padding: 1rem;
  }
  
  .view-footer {
    padding: 1rem;
  }
}

/* Dark Theme (quando aplicável) */
.canonika-view-content.dark-theme {
  background: #1e293b;
  color: #e2e8f0;
}

.canonika-view-content.dark-theme .view-header {
  background: #334155;
  border-bottom-color: #475569;
}

.canonika-view-content.dark-theme .view-title {
  color: #e2e8f0;
}

.canonika-view-content.dark-theme .view-subtitle {
  color: #94a3b8;
}

.canonika-view-content.dark-theme .view-main-content {
  background: #1e293b;
}

.canonika-view-content.dark-theme .view-footer {
  background: #334155;
  border-top-color: #475569;
}
</style> 