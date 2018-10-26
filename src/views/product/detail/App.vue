<template>
  <fixed-header-container>
    <header-component slot="header"></header-component>
    <el-container itemscope itemtype="http://schema.org/Product">
      <el-aside width="auto">
        <preview :images="images" :active="productInfo.active" :showBuyNow="showBuyNow"></preview>
      </el-aside>
      <el-main style="padding-top: 0; padding-bottom: 0;">
        <breadcrumb></breadcrumb>
        <p class="product-name" itemprop="name">{{productInfo.productName}}</p>
        <div class="product-no">
          Item NO. <div style="display: inline;" itemprop="sku">{{productInfo.productNo}}</div>
          <span v-if="productInfo.isTaxInclude">{{ $t('product.tax_included') }}</span>
        </div>
        <div class="rate" v-if="productInfo.rateNum > 0">
          <el-rate v-model="productInfo.rateScore" disabled show-score text-color="#ff9900"
                   score-template="{value} / 5.0">
          </el-rate>
          <span class="rate-total"> | {{ $t('product.ratings',{num:productInfo.rateNum}) }}</span>
        </div>

        <div class="product-price-group">
          <div v-if="countryCode === 'in'" class="product-price in-product-price" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
            <span class="price-symbol" itemprop="priceCurrency" :content="productInfo.symbol">{{productInfo.symbol}}</span>
            <span class="price-num" itemprop="price">{{productInfo.price | round}}</span>
          </div>
          <div v-else class="product-price" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
            <span class="price-num" itemprop="price">{{productInfo.price | round}}</span>
            <span class="price-symbol" itemprop="priceCurrency" :content="productInfo.symbol">{{productInfo.symbol}}</span>
          </div>

          <circle-tag :digist="`${productInfo.discount}%`" :title="$t('product.off')"
                      v-if="productInfo.discount"></circle-tag>
          <circle-tag :digist="productInfo.orders" :title="$t('product.orders')" color="#4A90E2"
                      v-if="productInfo.orders"></circle-tag>
        </div>

        <!-- <div class="platform-detail" v-if="platformDetails.length > 0">
          <table>
            <thead>
              <tr>
                <td>Price</td>
                <td>Shipping</td>
                <td class="total-price">Total</td>
                <td>Retailer</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="detail in productInfo.platformDetails" :key="detail.platformName">
                <td>
                  <span>{{detail.price | round}}</span>
                </td>
                <td>
                  <span>{{detail.shipping | round}}</span>
                </td>
                <td>
                  <span class="total-price">{{detail.total | round}}</span>
                </td>
                <td>
                  <a :href="detail.platformURL" v-if="detail.platformURL" target="_blank">{{detail.platformName}} ></a>
                  <span v-else>{{detail.platformName}}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div> -->

        <sku-choose :category-ids="categoryIds" :sku-info="skuInfo"></sku-choose>

        <card-comp :title="$t('product.delivery')" :styles="cardStyle" class="delivery">
          <div v-if="shippingFee">
            <p class="free-shipping">{{ $t('product.free_shipping',{symbol,free_num:freeShippingAmount.toFixed(2)}) }}</p>
            <p>{{ $t('product.arrive_at',{date:arriveDate}) }}</p>
            <p>{{ $t('product.shipping_fee',{
              symbol,
              free_num:freeShippingAmount.toFixed(2),
              shipping_fee:shippingFee.toFixed(2),
              })}}</p>
          </div>
          <div v-else class="free-shipping-box">
            <div>{{$t('product.freeShipping')}}</div>
            <span>{{ $t('product.arrive_at',{date:arriveDate}) }}</span>
          </div>
        </card-comp>

        <card-comp :title="$t('product.description')" :styles="cardStyle" v-if="descriptions.length > 0">
          <description :descriptions="descriptions"></description>
        </card-comp>

        <card-comp :title="$t('product.rating_and_reviews')" :styles="cardStyle" v-if="reviewCount > 0">
          <comment :comments="comments" :rateScore="productInfo.rateScore" :rateNum="productInfo.rateNum" :showSeeMore="reviewCount > 3"></comment>
        </card-comp>

        <club-info></club-info>
      </el-main>
    </el-container>

    <card-comp :title="$t('product.people_also_view')" :styles="cardStyle">
      <product-list :isProductDetail="true"></product-list>
    </card-comp>
  </fixed-header-container>
</template>

<script>
import 'assets/css/common'
import utils from 'assets/js/utils'
import config from 'assets/js/conf'
import googleAnalytics from 'assets/js/google_analytics'
import facebookPixel from 'assets/js/facebook_pixel'
import HeaderComponent from 'components/HeaderComponent'
import Breadcrumb from 'components/Breadcrumb'
import Preview from 'components/Preview'
import ProductList from 'components/ProductList'
import CircleTag from 'components/CircleTag'
import SkuChoose from 'components/SkuChoose'
import FixedHeaderContainer from 'components/FixedHeaderContainer'
import CardComp from 'components/CardComp'
import Description from 'components/Description'
import ClubInfo from 'components/ClubInfo'
import Comment from 'components/product/Comment'

export default {
  components: {
    HeaderComponent,
    Breadcrumb,
    Preview,
    ProductList,
    CircleTag,
    SkuChoose,
    FixedHeaderContainer,
    CardComp,
    Description,
    ClubInfo,
    Comment
  },
  async created () {
    let {
      productId,
      operateType,
      operateData
    } = utils.parseQueryString()
    let productInfo = await this.$api.getProductDetail(productId)
    utils.setSeoInfo(productInfo.categoryIds, productInfo.productName)
    this.productInfo = productInfo
    this.categoryIds = productInfo.categoryIds
    this.images = productInfo.productImages
    this.skuInfo = productInfo.skuInfo
    this.platformDetails = productInfo.platformDetails
    this.descriptions = productInfo.descriptions
    let shippingInfo = productInfo.shippingInfo
    this.shippingCosts = shippingInfo.shipping_costs
    this.deliveryInfo = shippingInfo.delivery_info
    this.prepareInfo = shippingInfo.prepare_info
    this.showBuyNow = productInfo.showBuyNow
    const {
      reviewList,
      reviewCount
    } = await this.$api.getCommentList({
      product: productId,
      limit: 5,
      offset: 0
    })
    this.comments = reviewList
    this.reviewCount = reviewCount
    let skuId = this.skuInfo.map(item => {
      return item.id
    })
    console.log('skuId', skuId)
    googleAnalytics.setEcommProdid([productInfo.productNo])
    facebookPixel.viewContent({
      contentName: productInfo.productName,
      contentIds: [productInfo.productNo],
      contentType: 'product',
      value: productInfo.price
    })
    console.log('operateType', operateType)
    if (operateType === 'addCart' && operateData) {
      operateData = JSON.parse(decodeURIComponent(operateData))
      console.log('operateData', operateData)
      this.quantity = operateData.quantity
      this.addCart(operateData.skuId, productInfo)
    }
    this.$bus.$on('quantity-change', (quantity, skuId) => {
      this.quantity = quantity
    })
    this.$bus.$on('sku-selected', skuId => {
      this.addCart(skuId, productInfo)
    })
    this.$bus.$on('buy-sku-selected', skuId => {
      this.onBuyNow(skuId)
    })
  },
  data () {
    return {
      cardStyle: {
        fontSize: '18px',
        paddingBottom: '10px',
        marginTop: '30px'
      },
      symbol: utils.getSymbol(),
      countryCode: utils.getUserCountry(),
      // discount: this.productInfo.discount ? this.$t('product.discount', {percent: this.productInfo.discount}) : '',
      quantity: 1,
      productInfo: {
        productName: ''
      },
      categoryIds: [],
      images: [],
      skuInfo: [],
      platformDetails: [],
      descriptions: [],
      shippingCosts: [],
      shippingFee: 0,
      freeShippingAmount: 0,
      deliveryInfo: {},
      prepareInfo: {},
      comments: [],
      reviewCount: 0,
      showBuyNow: false
    }
  },
  methods: {
    async addCart (skuId, productInfo) {
      await this.$api.addCart(skuId, this.quantity)
      this.$bus.$emit('add-cart-success')
      // 加入购物车商品默认选中
      utils.addCheckProductCookie(skuId)
      // ga上报
      googleAnalytics.addCart({
        id: productInfo.productNo,
        name: productInfo.productName,
        // TODO 现在这里取不到类别名称
        category: productInfo.categoryIds.join('-'),
        quantity: this.quantity,
        price: productInfo.price,
        variant: (() => {
          try {
            return this.skuInfo.filter(item => {
              return item.id === skuId
            })[0].attribute_info.map(item => {
              return item.attr_value_name
            }).join(' ')
          } catch (e) {
            return ''
          }
        })()
      })
      // pixel上报
      facebookPixel.addToCart({
        value: productInfo.price,
        contentName: productInfo.productName,
        contentIds: [productInfo.productNo],
        contents: [{ 'id': skuId, 'quantity': this.quantity, 'item_price': productInfo.price }]
      })
      this.$message({
        message: 'add cart success',
        type: 'success'
      })
    },
    onBuyNow (skuId) {
      googleAnalytics.oneBuyNow()
      window.location.href = `${config.views.paymentAddress}?skuIds=${skuId}&quantity=${this.quantity}`
    }
  },
  watch: {
    shippingCosts (newValue) {
      let costs = newValue || []
      costs.map(item => {
        if (item.shipping_cost_local > 0) {
          this.shippingFee = item.shipping_cost_local
        } else {
          this.freeShippingAmount = item.order_amount_local
        }
      })
    }
  },
  computed: {
    arriveDate () {
      let arriveDays = 0
      if (this.deliveryInfo && this.prepareInfo) {
        let deliveryDays = this.deliveryInfo.max_days
        let prepareDays = this.prepareInfo.max_days
        arriveDays = deliveryDays + prepareDays
      }
      return utils.addDate(arriveDays)
      // return moment().add(arriveDays, 'd').format('MMMM DD')
    }
    // ratingText () {
    //   if (this.productInfo.rateScore > 0) {
    //     return `(${this.productInfo.rateScore} / 5.0 | ${this.productInfo.rateNum} ratings)`
    //   } else {
    //     return ''
    //   }
    // }
  }

}
</script>

<style lang="scss" scoped>
  .main {
    padding: 0;
    .breadcrumb {
      padding-bottom: 10px;
    }
    > .el-container {
      margin-top: 10px;
      .el-aside {
        position: sticky;
        top: 70px;
        align-self: flex-start;
      }
    }

    .platform-detail {
      border: 1px solid $mecury;
      padding: 10px;
      margin-bottom: 10px;
      table {
        width: 100%;
        padding: 10px;
        border-collapse: collapse;
        font-size: $small;
        color: $dove-gray;
        .total-price {
          color: $flamingo;
        }
        td {
          padding: 10px;
          a {
            color: $havelock-blue;
          }
        }
        thead {
          td {
            border-bottom: 1px solid $mecury;
          }
        }
      }
    }
    .delivery {
      .free-shipping-box{
        div {
          color: $flamingo;
          border: solid 1px $flamingo;
          display: inline-block;
          margin-top: 10px;
          font-size: 12px;
          padding: 5px;
          border-radius: 3px;
          margin-right: 10px;
        }
        span {
          vertical-align: -15%;
        }
      }
      p {
        font-size: $small;
        line-height: 20px;
        &.free-shipping {
          margin-top: 10px;
        }
        & + p {
          color: $dusty-gray;
        }
      }
    }
  }

  .products {
    display: flex;
    justify-content: center;
    flex-direction: column;
    .people-also-see {
      border-bottom: 1px solid $mine-shaft;
      margin-bottom: 25px;
      padding-bottom: 10px;
    }
  }

  .product-name {
    font-size: $xx-large;
    margin-bottom: 16px;
  }

  .product-no {
    font-size: $small;
    color: $dusty-gray;
    margin-bottom: 16px;
    span {
      background: $dove-gray;
      padding: 0 5px;
      border-radius: 2px;
      color: $white;
      margin-left: 10px;
    }
  }

  .product-price-group {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .product-price {
      display: inline-flex;
      flex-direction: column;
      color: $flamingo;
      text-align: center;
      &.in-product-price {
        flex-direction: row;
        align-items: center;
        .price-symbol {
          margin-right: 10px;
          font-size: 20px;
        }
      }
      .price-num {
        font-size: $size36;
      }
      .price-symbol {
        font-size: $small;
      }
    }
  }

  .rate /deep/ {
    display: flex;
    margin-bottom: 20px;
    .el-rate__icon {
      font-size: $medium;
    }
    .rate-total {
      margin-left: 5px;
      color: $dove-gray;
    }
  }
</style>
