<template>
  <fixed-header-container>
    <header-component slot="header"></header-component>
    <el-container itemscope itemtype="http://schema.org/Product">
      <el-aside width="auto">
        <!-- <preview :images="images" :active="productInfo.active" :isReviews="true"></preview> -->
        <div class="preview">
          <img :src="images[0]&&images[0].url" alt="">
        </div>
        <p class="product-name" itemprop="name">{{productInfo.productName}}</p>
        <div class="product-price-group">
          <div class="product-price" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
            <span class="price-num" itemprop="price">{{productInfo.price | round}}</span>
            <span class="price-symbol" itemprop="priceCurrency" :content="productInfo.symbol">{{productInfo.symbol}}</span>
          </div>

          <circle-tag :digist="`${productInfo.discount}%`" :title="$t('product.off')"
                      v-if="productInfo.discount"></circle-tag>
          <circle-tag :digist="productInfo.orders" :title="$t('product.orders')" color="#4A90E2"
                      v-if="productInfo.orders"></circle-tag>
        </div>
      </el-aside>
      <el-main style="padding-top: 0; padding-bottom: 0; margin-top: -20px; padding-left: 36px;">

        <!-- <sku-choose :category-ids="categoryIds" :sku-info="skuInfo"></sku-choose> -->
        <comment :comments="comments" :rateScore="productInfo.rateScore" :rateNum="productInfo.rateNum" :showSeeMore="false"></comment>
        <div class="pagination">
          <el-pagination
            @current-change="pageChange"
            background
            layout="prev, pager, next"
            :page-size="10"
            :total="reviewCount">
          </el-pagination>
        </div>
      </el-main>
    </el-container>
  </fixed-header-container>
</template>

<script>
import 'assets/css/common'
import utils from 'assets/js/utils'
// import config from 'assets/js/conf'
// import googleAnalytics from 'assets/js/google_analytics'
import HeaderComponent from 'components/HeaderComponent'
import Preview from 'components/Preview'
import CircleTag from 'components/CircleTag'
import SkuChoose from 'components/SkuChoose'
import FixedHeaderContainer from 'components/FixedHeaderContainer'
import Comment from 'components/product/Comment'

export default {
  components: {
    HeaderComponent,
    Preview,
    CircleTag,
    SkuChoose,
    FixedHeaderContainer,
    Comment
  },
  async created () {
    let {productId} = utils.parseQueryString()
    this.productId = productId
    let productInfo = await this.$api.getProductDetail(productId)
    utils.setSeoInfo(productInfo.categoryIds, productInfo.productName)
    this.productInfo = productInfo
    this.categoryIds = productInfo.categoryIds
    this.images = productInfo.productImages
    this.skuInfo = productInfo.skuInfo
    this.loadMore()
    // this.$bus.$on('quantity-change', (quantity, skuId) => {
    //   this.quantity = quantity
    // })
    // this.$bus.$on('sku-selected', async skuId => {
    //   await this.$api.addCart(skuId, this.quantity)
    //   this.$bus.$emit('add-cart-success')
    //   // 加入购物车商品默认选中
    //   utils.addCheckProductCookie(skuId)
    //   // ga上报
    //   googleAnalytics.addCart({
    //     id: productInfo.productNo,
    //     name: productInfo.productName,
    //     // TODO 现在这里取不到类别名称
    //     category: productInfo.categoryIds.join('-'),
    //     quantity: this.quantity,
    //     price: productInfo.price,
    //     variant: (() => {
    //       try {
    //         return this.skuInfo.filter(item => {
    //           return item.id === skuId
    //         })[0].attribute_info.map(item => {
    //           return item.attr_value_name
    //         }).join(' ')
    //       } catch (e) {
    //         return ''
    //       }
    //     })()
    //   })
    //   this.$message({
    //     message: 'add cart success',
    //     type: 'success'
    //   })
    // })
    // this.$bus.$on('buy-sku-selected', skuId => {
    //   console.log('skuId', skuId)
    //   window.location.href = `${config.views.paymentAddress}?skuIds=${skuId}&quantity=${this.quantity}`
    // })
  },
  methods: {
    async loadMore () {
      if (this.loading) {
        return
      }
      this.loading = true
      const {
        reviewList,
        reviewCount
      } = await this.$api.getCommentList({
        product: this.productId,
        limit: 10,
        offset: (this.page - 1) * 10
      })
      this.reviewCount = reviewCount
      if (reviewList.length) {
        this.comments = reviewList || []
      }
      window.scrollTo(0, 0)
      this.loading = false
      // if (this.comments.length === reviewCount) {
      //   this.isDisabled = true
      // }
    },
    pageChange (page) {
      this.page = page
      this.loadMore()
    }
  },
  data () {
    return {
      productId: '',
      symbol: utils.getSymbol(),
      quantity: 1,
      productInfo: {
        productName: ''
      },
      categoryIds: [],
      images: [],
      skuInfo: [],
      comments: [],
      reviewCount: -1,
      loading: false,
      isDisabled: false,
      page: 1
    }
  }
}
</script>

<style lang="scss" scoped>
  .main {
    padding: 0;
    > .el-container {
      margin: 0 auto;
      margin-top: 10px;
      max-width: 800px;
      .el-main {
        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 15px;
          .el-pagination /deep/ {
            .el-pager {
              .active {
                background-color: $flamingo;
              }
              li {
                &:hover {
                  color: $flamingo;
                }
              }
            }
          }
        }
      }
      .el-aside {
        position: sticky;
        top: 70px;
        align-self: flex-start;
        max-width: 250px;
        .preview {
          height: 250px;
          width: 250px;
          img {
            height: 100%;
            width: 100%;
          }
        }
        .product-name {
          font-size: $large;
          margin-bottom: 16px;
          margin-top: 30px;
          text-align: center;
        }
        .product-price-group {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          .product-price {
            display: inline-flex;
            flex-direction: column;
            color: $flamingo;
            text-align: center;
            .price-num {
              font-size: $size36;
            }
            .price-symbol {
              font-size: $small;
            }
          }
        }
      }
    }
  }
</style>
