<template>
  <section class="container">
    <header class="header">
      <slot name="header" :scroll="handleScroll"></slot>
    </header>
    <main class="main">
      <slot></slot>
    </main>
  </section>
</template>

<script>
export default {
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  data () {
    return {

    }
  },
  methods: {
    handleScroll (event) {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.$store.commit('updateScrollTop', scrollTop)
    }
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style lang="scss">
  .container {
    .header {
      background: $white;
      width: 100%;
      top: 0;
      z-index: 999;
    }
    .main {
      max-width: 1200px;
      margin: 0 auto;
      margin-bottom: 30px;
    }
  }
</style>
