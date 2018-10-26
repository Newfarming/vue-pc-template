<template>
  <fixed-header-container>
    <div slot="header" class="header-container">
      <top-bar></top-bar>
      <search :class="{fixed: isFixed}"></search>
      <div v-show="isFixed" style="height: 86px"></div>
    </div>
    <el-container>
      <div class="product-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="500">
        <product-item v-for="product in products" :key="product.id" :data="product"></product-item>
        <back-to-top></back-to-top>
      </div>
      <div v-if="products.length <= 0" class="empty-content">
        No Result...
      </div>
    </el-container>
  </fixed-header-container>
</template>

<script>
import 'assets/css/common'
import ProductList from 'components/ProductList'
import FixedHeaderContainer from 'components/FixedHeaderContainer'
import TopBar from 'components/TopBar'
import Search from 'components/Search'
import ProductItem from 'components/ProductItem'
import BackToTop from 'components/BackToTop'
import infiniteScroll from 'vue-infinite-scroll'
export default {
  components: {
    ProductList,
    FixedHeaderContainer,
    TopBar,
    Search,
    ProductItem,
    BackToTop
  },
  data () {
    return {
      products: [],
      isLoading: false,
      isDisabled: false
    }
  },
  methods: {
    async loadMore (isAppend = true) {
      if (!this.isLoading && !this.isDisabled) {
        this.isLoading = true
        let query = {
          query: this.search,
          limit: 20
        }
        if (isAppend) {
          query.offset = this.products.length
        }

        const data = await this.$api.searchProducts(query)
        if (isAppend) {
          this.products = this.products.concat(data)
        } else {
          this.products = data || []
        }
        this.isLoading = false
        this.isDisabled = data.length < query.limit
      }
    }
  },
  computed: {
    isFixed () {
      return this.$store.state.scrollTop > 37
    },
    search () {
      return this.$store.state.search
    }
  },
  watch: {
    search (newVal) {
      this.isLoading = false
      this.isDisabled = false
      this.loadMore(false)
    }
  },
  directives: {
    infiniteScroll
  }
}
</script>

<style lang="scss" scoped>
  .header-container /deep/ {
    .search-bar {
      &.fixed {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        box-shadow: 0px 1px 1px $mecury;
        background: $white;
      }
    }
  }

  .product-list {
    margin-top: 20px;
  }

  .empty-content {
    margin-top: 20px;
    width: 100%;
    height: 200px;
    line-height: 200px;
    text-align: center;
    color: $dove-gray;
  }
</style>
