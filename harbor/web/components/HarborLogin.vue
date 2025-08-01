<template>
  <CanonikaLoginTemplate 
    module-name="Harbor"
    module-icon-class="icon-harbor"
    redirect-url="/"
    @login-success="handleLoginSuccess"
  />
</template>

<script>
import CanonikaLoginTemplate from '../../../shared/templates/CanonikaLoginTemplate.vue'

export default {
  name: 'HarborLogin',
  components: {
    CanonikaLoginTemplate
  },
  methods: {
    handleLoginSuccess(data) {
      this.$emit('login-success', data.user);
    }
  }
}
</script> 