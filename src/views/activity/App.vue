<template>
  <fixed-header-container>
    <header-component class="header" slot="header"></header-component>
    <el-container>
      <div class="container" v-infinite-scroll="load" :infinite-scroll-disabled="isDisabled" infinite-scroll-distance="500">
        <div v-for="image in tabs" :key="image.index">
          <img class="banner" :src="`//${image.image_title}`" :ref="`banner${image.index}`" alt="" v-if="products[image.index] && products[image.index].length">
          <div class="product-list">
            <product-item v-for="product in products[image.index]" :key="product.id" :data="product"></product-item>
          </div>
        </div>
        <div v-loading="isLoading" style="width: 100%; height: 60px;"></div>
      </div>
    </el-container>
  </fixed-header-container>
</template>

<script>
import 'assets/css/common'
import HeaderComponent from 'components/HeaderComponent'
import FixedHeaderContainer from 'components/FixedHeaderContainer'
import ProductItem from 'components/ProductItem'
import BackToTop from 'components/BackToTop'
import utils from 'assets/js/utils'
import infiniteScroll from 'vue-infinite-scroll'
export default {
  components: {
    FixedHeaderContainer,
    ProductItem,
    BackToTop,
    HeaderComponent
  },
  data () {
    return {
      products: [],
      isLoading: false,
      isDisabled: false,
      tabs: [],
      index: 0,
      offset: 0,
      theme: ''
    }
  },
  async created () {
    let p = utils.parseQueryString()
    console.log('p', p)
    this.theme = p.theme
    // this.load()
  },
  methods: {
    async load () {
      if (this.isLoading || this.isDisabled) {
        return
      }
      this.isLoading = true
      const {
        tabs,
        products,
        count
      } = await this.$api.getThemeInfo({
        theme: this.theme,
        limit: 20,
        offset: this.offset,
        index: this.index
      })
      let productList = this.products
      productList[this.index] = productList[this.index] ? productList[this.index].concat(products) : products
      this.offset = productList[this.index].length
      if (productList[this.index].length === count) {
        this.index++
        this.offset = 0
      }
      this.tabs = tabs
      this.products = productList
      this.isLoading = false
      this.isDisabled = (this.index === this.tabs.length) && this.tabs.length !== 0
    }
  },
  directives: {
    infiniteScroll
  },
  mounted () {
    // window.onscroll = () => {
    //   if (utils.getScrollTop() % 500 === 0) {
    //     this.load()
    //   }
    //   // console.log('ref', this.$refs['banner0'][0].offsetTop)
    //   // console.log('height', this.$refs.banner0[0].clientHeight)
    //   // console.log('utils.getScrollTop()', utils.getScrollTop())
    // }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  .container {
    width: 100%;
    .banner {
      height: 100%;
      width: 100%;
    }
    .product-list {
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>
