<template>
  <div class="product-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="isDisabled" infinite-scroll-distance="500">
    <product-item v-for="product in products" :key="product.id" :data="product" :showMark="showMark"></product-item>
  </div>
</template>

<script>
import utils from 'assets/js/utils'
import googleAnalytics from 'assets/js/google_analytics'

import ProductItem from 'components/ProductItem'
import infiniteScroll from 'vue-infinite-scroll'
export default {
  components: {
    ProductItem
  },
  props: [
    'isProductDetail'
  ],
  data () {
    return {
      products: [],
      isLoading: false,
      isDisabled: false,
      showMark: false
    }
  },
  methods: {
    async loadMore () {
      if (!this.isLoading && !this.isDisabled) {
        let query = {
          offset: this.products.length,
          limit: 20
        }
        let q = utils.parseQueryString()
        try {
          // 解析类别
          let subMenus = this.subMenu.subs.filter(item => {
            return item.isSelected
          })
          let subMenu = subMenus.length > 0 ? subMenus[0] : this.subMenu.subs[this.subMenu.subs.length - 1]
          query.categoryId = subMenu.id
        } catch (e) {
          console.log(e)
          // 出错了就解析URL中的参数
          query.categoryId = q.subId || q.categoryId
        }

        // 解析sortBy
        if (q.sort_by || this.activeSortItem) {
          query.sortBy = q.sort_by || this.activeSortItem
        }

        if (q.ad) {
          query.ad = q.ad
        }

        if (q.filter) {
          query.filterBy = q.filter
        }

        this.isLoading = true
        this.isDisabled = true
        console.log('query', query)
        let productData = this.isProductDetail ? await this.$api.getRecommendProducts({
          product_id: q.productId,
          offset: this.products.length,
          limit: 20
        }) : await this.$api.getProductInfo(query)

        if (productData && productData.length > 0) {
          this.products = this.products.concat(productData)
        }

        // const {
        //   AmountOff
        // } = await this.$api.discount()
        // if (AmountOff.expire_time) {
        //   this.showMark = true
        // }

        // 增加自定义纬度
        let productNos = this.products.map(item => {
          return item.productNo
        })
        googleAnalytics.setEcommProdid(productNos)

        this.isLoading = false
        this.isDisabled = productData.length < query.limit
      }
    }
  },
  computed: {
    subMenu () {
      return this.$store.state.subMenu
    },
    activeSortItem () {
      return this.$store.state.activeSortItem
    },
    filter () {
      return this.$store.state.filter
    }
  },
  watch: {
    async subMenu (newVal) {
      this.products = []
      this.isDisabled = false
      await this.loadMore()
    },
    async activeSortItem () {
      this.products = []
      this.isDisabled = false
      await this.loadMore()
    },
    async filter () {
      this.products = []
      this.isDisabled = false
      await this.loadMore()
    }
  },
  directives: {
    infiniteScroll
  }
}
</script>

<style lang="scss" scoped>
  .product-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
