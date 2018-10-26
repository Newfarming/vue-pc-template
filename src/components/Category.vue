<template>
  <div>
    <div class="category" ref="category" :class="{fixed: isFixed}">
      <ul>
        <li v-for="category in categories" :key="category.id" @click="catgeoryActive(category.id)" :class="{active: category.active}">{{category.title}}</li>
      </ul>
    </div>
    <!--品类组件fixed状态时，填充其缺失的高度-->
    <div v-show="isFixed" style="height: 70px"></div>
  </div>
</template>

<script>
import config from 'assets/js/conf'
import utils from 'assets/js/utils'

export default {
  async created () {
    const queryObj = utils.parseQueryString()
    const categoryId = parseInt(queryObj.categoryId) || 0
    let categories = await this.$api.getCategory()
    this.categories = this.setCategoryActive(categories, categoryId)
  },
  mounted () {
    this.offsetTop = this.$refs.category.offsetTop
  },
  data () {
    return {
      offsetTop: 0,
      // isFixed: false,
      categories: []
    }
  },
  methods: {
    catgeoryActive (categoryId) {
      this.categories = this.setCategoryActive(this.categories, categoryId)
      // redirect to product.html
      window.location.href = config.views.product + `?categoryId=${categoryId}&subId=${categoryId}`
    },

    setCategoryActive (categories, categoryId) {
      return categories.map(item => {
        item.active = item.id === categoryId
        if (item.active) {
          this.$store.commit('categoryChange', {
            id: item.id,
            title: item.title
          })
        }
        return item
      })
    }
  },
  computed: {
    isFixed () {
      return this.$store.state.scrollTop > this.offsetTop
    }
  }
}
</script>

<style lang="scss" scoped>
  .category {
    &.fixed {
      position: fixed;
      top: 0;
      width: 100%;
      background: white;
      z-index: 9999;
      box-shadow: 0px 1px 1px $mecury;
    }
    ul {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 70px;
      padding: 0;
      color: $mine-shaft;
      font-size: $small;
      li {
        margin: 0 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        height: 100%;
        &.active {
          color: $flamingo;
          border-bottom: 2px solid $flamingo;
        }
      }
    }
  }
</style>
