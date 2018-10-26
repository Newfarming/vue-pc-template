<template>
  <fixed-header-container>
    <header-component class="header" slot="header"></header-component>
    <el-container>
      <div class="container">
        <img class="banner" :src="image" alt="">
        <div class="tabs">
          <ul>
            <li v-for="tab in tabs" :key="tab.index" :class="{active: index === tab.index}" @click="changeIndex(tab.index)">{{tab.title}}</li>
          </ul>
        </div>
        <!-- <div v-for="image in tabs" :key="image.index"> -->
          <!-- <img class="banner" :src="`//${image.image_title}`" :ref="`banner${image.index}`" alt=""> -->
          <div class="product-list" v-infinite-scroll="load" :infinite-scroll-disabled="isDisabled" infinite-scroll-distance="500">
            <product-item v-for="product in productsInfo[index] && productsInfo[index].products" :key="product.id" :data="product"></product-item>
            <div v-loading="isLoading" style="width: 100%; height: 60px;"></div>
          </div>
        <!-- </div> -->
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
// import utils from 'assets/js/utils'
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
      productsInfo: [],
      isLoading: false,
      isDisabled: false,
      tabs: [],
      index: 0,
      offset: 0,
      image: ''
    }
  },
  async created () {
    // this.load()
  },
  methods: {
    async load () {
      if (this.isLoading || (this.productsInfo[this.index] && this.productsInfo[this.index].isDisabled)) {
        return
      }
      this.isLoading = true
      const {
        tabs,
        products,
        count,
        image
      } = await this.$api.getPicksInfo({
        limit: 20,
        offset: this.offset,
        index: this.index
      })
      this.image = image
      this.tabs = tabs
      let productInfo = this.productsInfo
      productInfo[this.index] = {
        products: ((productInfo[this.index] && productInfo[this.index].products) || []).concat(products)
      }
      productInfo[this.index].isDisabled = productInfo[this.index].products.length === count
      console.log('productInfo', productInfo)
      this.productsInfo = productInfo
      this.offset = productInfo[this.index].products.length
      this.isLoading = false
      // this.isDisabled = productInfo[this.index].length === count
    },
    changeIndex (index) {
      this.index = index
      if (!(this.productsInfo[index] && this.productsInfo[index].products.length)) {
        this.load()
      }
    }
  },
  directives: {
    infiniteScroll
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  .container {
    width: 100%;
    .tabs {
      box-shadow: 0 2px 4px 0 rgba(0,0,0,.05);
      ul {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        padding: 0;
        color: $mine-shaft;
        font-size: $small;
        li {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          flex: 1;
          font-size: 18px;
          &.active {
            color: $flamingo;
            border-bottom: 2px solid $flamingo;
          }
        }
      }
    }
    .banner {
      width: 100%;
    }
    .product-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 30px;
    }
  }
}
</style>
