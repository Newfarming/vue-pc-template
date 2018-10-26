
<template>
  <div class="aside">
    <breadcrumb></breadcrumb>
    <el-collapse v-model="activeNames" class="aside-comp">
      <el-collapse-item :title="category.title" :name="category.name">
        <ul>
          <li v-for="sub in category.subs" :key="sub.id" @click="onSubCategoryClick(sub.id)" :class="{active: sub.isSelected}">{{sub.title}}</li>
        </ul>
      </el-collapse-item>
    </el-collapse>
    <side-filter></side-filter>
  </div>
</template>

<script>
import utils from 'assets/js/utils'
import config from 'assets/js/conf'
import Breadcrumb from 'components/Breadcrumb'
import SideFilter from 'components/SideFilter'

export default {
  components: {
    Breadcrumb,
    SideFilter
  },
  async created () {
    let { categoryId } = utils.parseQueryString()
    this.$store.dispatch('initAsideInfo', categoryId)
    this.setSEO()
  },
  data () {
    return {
    }
  },
  methods: {
    onSubCategoryClick (subId) {
      this.$store.commit('updateSubMenuSelect', subId)
      let query = utils.parseQueryString()
      query.subId = subId
      window.history.replaceState({}, null, config.views.product + utils.encodeQueryString(query))
      this.setSEO()
    },
    setSEO () {
      let q = utils.parseQueryString()
      let cateId = q.subId
      utils.setSeoInfo(cateId)
    }
  },
  computed: {
    category () {
      return this.$store.state.subMenu
    },
    activeNames () {
      return [this.$store.state.subMenu.name]
    }
  }
}
</script>

<style lang="scss" scoped>
  .aside-comp /deep/ {
    .el-collapse-item__header {
      font-size: $small;
      color: $mine-shaft;
    }
    .el-collapse-item__content {
      color: $dove-gray;
      font-size: $small;
      ul {
        li {
          padding-left: 18px;
          &:hover,
          &.active {
            color: $flamingo;
            background-color: $chardon;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
