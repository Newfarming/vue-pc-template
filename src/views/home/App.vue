<template>
  <div>123456
    <componentA></componentA>
  </div>

</template>

<script>
import 'assets/css/common'
// import utils from 'assets/js/utils'

import componentA from 'components/componentA'
// import MyCarousel from 'components/MyCarousel'
// import DiwaliBack from 'assets/image/activity/diwali_back.jpg'
// import Diwali from 'assets/image/activity/diwali.jpg'
export default {
  components: {
    componentA
  },
  async created () {
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
