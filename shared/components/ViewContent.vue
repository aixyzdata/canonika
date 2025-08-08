<template>
  <div class="canonika-view-content">
    <!-- Header da View usando ViewHeader component -->
    <CanonikaViewHeader
      v-if="title || subtitle"
      :title="title"
      :subtitle="subtitle"
      :status="status"
      :actions="actions"
    >
      <template #actions>
        <slot name="actions"></slot>
      </template>
    </CanonikaViewHeader>

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
import CanonikaViewHeader from './ViewHeader.vue'

export default {
  name: 'CanonikaViewContent',
  components: {
    CanonikaViewHeader
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    status: {
      type: Object,
      default: null
    },
    actions: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
@import '../styles/view-content.css';
</style> 