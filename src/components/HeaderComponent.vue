<template>
  <div>
    <top-bar :isMini="isMiniTopBar"></top-bar>
    <search :showSearch="isSearchShow"></search>
    <category v-if="isCategoryShow"></category>
  </div>
</template>

<script>
import TopBar from 'components/TopBar'
import Search from 'components/Search'
import Category from 'components/Category'

export default {
  components: {
    TopBar,
    Search,
    Category
  },
  props: {
    isCategoryShow: {
      type: Boolean,
      default: true
    },
    isSearchShow: { // 是否显示搜索栏
      type: Boolean,
      default: true
    },
    isMiniTopBar: { // 是否显示mini版本的topbar
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  }
}
</script>
