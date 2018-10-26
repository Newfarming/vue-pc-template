<template>
  <fixed-header-container>
    <header-component class="header" slot="header"></header-component>
    <section class="content">
    </section>
  </fixed-header-container>
</template>

<script>
import 'assets/css/common'
import HeaderComponent from 'components/HeaderComponent'
import FixedHeaderContainer from 'components/FixedHeaderContainer'

export default {
  components: {
    HeaderComponent,
    FixedHeaderContainer
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
