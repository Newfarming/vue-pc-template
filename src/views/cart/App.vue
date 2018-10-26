<template>
  <fixed-header-container>
    <header-component slot="header" :is-category-show="false"></header-component>
    <div class="cart-content">
      <el-container>
        <el-main style="padding: 0;">
          <div class="cart-items" v-if="availabelItems.length>0 || unavailableItems.length > 0">
            <div class="available" v-if="availabelItems.length > 0">
              <card-comp :title="cartTitle">
                <div class="discount" v-if="countDownTime > 0">
                  <span class="flex">You’ve enjoyed <span class="off"> &nbsp; {{symbol}} {{discountPrice.off_amount}} off</span></span>
                  <span class="flex space">
                    <span class="discount_text">{{time.discountText}}</span>
                    <div class="count-down">
                      End in {{time.day}} Days <span>{{time.hour}}</span> : <span>{{time.minute}}</span> : <span>{{time.seconds}}</span>
                    </div>
                  </span>
                </div>
                <div class="cart-item-header">
                  <span class="check-icon" @click="checkAllItems">
                    <i class="iconfont icon-xuanze" :class="{'icon-xuanzhong': isAllChecked}"></i>
                    <span>{{ $t('cart.select_all') }} ({{availabelItems.length}})</span>
                  </span>
                  <span class="free-shipping-tips" v-if="restFreeShipping > 0">
                    {{ $t('cart.for_free_shipping',{symbol,free_num:restFreeShipping.toFixed(2)}) }}
                  </span>
                </div>
                <cart-item :operate="true" v-for="item in availabelItems" :key="item.skuId" :cartData="item"
                           @item-check-click="itemChecked" @item-delete="itemDelete"></cart-item>
              </card-comp>
            </div>

            <div class="unavailable" v-if="unavailableItems.length > 0">
              <card-comp title="Out of Stock">
                <out-stock-cart-item
                  v-for="item in unavailableItems"
                  :key="item.skuId" :cartData="item"
                  @item-delete="unavailableItemDelete">
                </out-stock-cart-item>
              </card-comp>
            </div>

          </div>
          <card-comp :title="cartTitle" v-else>
            <div class="empty-content">
              <i class="iconfont icon-gouwuche"></i>
              <div>{{ $t('cart.empty') }}</div>
            </div>
          </card-comp>

        </el-main>
        <el-aside width="400px">
          <div class="price-detail">
            <card-comp :title="$t('order.price_detail')">
              <price-detail :price-detail="priceDetail" :symbol="symbol" :isTaxInclude="isTaxInclude"></price-detail>
              <div class="buy-now">
                <div class="discount" v-if="countDownTime > 0">
                  {{symbol}} {{time.discountText}}
                </div>
                <button class="btn-buy-now" @click="onBuyNowClick" :disabled="checkedCount <= 0">{{ $t('cart.buy_now') }}</button>
              </div>
            </card-comp>
          </div>
        </el-aside>
      </el-container>

    </div>
  </fixed-header-container>
</template>

<script>
import 'assets/css/common'

import utils from 'assets/js/utils'
import config from 'assets/js/conf'
import googleAnalytics from 'assets/js/google_analytics'

import HeaderComponent from 'components/HeaderComponent'
import CartItem from 'components/CartItem'
import OutStockCartItem from 'components/OutStockCartItem'
import CardComp from 'components/CardComp'
import PriceDetail from 'components/PriceDetail'
import FixedHeaderContainer from 'components/FixedHeaderContainer'

export default {
  components: {
    HeaderComponent,
    CartItem,
    OutStockCartItem,
    CardComp,
    PriceDetail,
    FixedHeaderContainer
  },
  async created () {
    if (['sa', 'ae'].indexOf(utils.getUserCountry()) > -1) {
      this.isTaxInclude = true
    }
    // 注册商品数量变更的事件监听
    let isUpdateQuantity = false
    this.$bus.$on('quantity-change', (quantity, skuId) => {
      if (!isUpdateQuantity) {
        this.availabelItems.every(async item => {
          if (item.skuId === skuId) {
            // 通知服务端修改商品数量
            isUpdateQuantity = true
            try {
              await this.$api.updateCartProductQty(skuId, quantity)
              item.quantity = quantity
            } finally {
              isUpdateQuantity = false
            }
            return false
          }
          return true
        })
      }
    })
    // 获取购物车数据
    this.getCartData()
    this.$bus.$on('login-success', () => {
      this.getCartData()
    })
    const {
      AmountOff
    } = await this.$api.discount()
    console.log('AmountOff', AmountOff)
    let text = AmountOff.coupons.reduce((a, b) => {
      if (a.off_amount) {
        return `${a.off_amount} off ${a.min_order_amount}+ / ${b.off_amount} off ${b.min_order_amount} +`
      }
      return `${a} / ${b.off_amount} off ${b.min_order_amount} +`
    }, '')
    this.countDownTime = AmountOff.expire_time
    if (this.countDownTime) {
      this.discount = AmountOff.coupons
    }
    this.time.discountText = text
    this.countDown()
  },
  data () {
    return {
      isTaxInclude: false,
      isAllChecked: false,
      availabelItems: [],
      unavailableItems: [],
      shippingCosts: [],
      freeShippingCost: 0,
      symbol: utils.getSymbol(),
      time: {
        day: 0,
        hour: 0,
        minute: 0,
        seconds: 0,
        discountText: ''
      },
      discount: [],
      countDownTime: 0
    }
  },
  methods: {
    async getCartData () {
      let { availabelItems, unavailableItems, shippingCosts } = await this.$api.getCartData()
      this.unavailableItems = unavailableItems
      this.shippingCosts = shippingCosts
      let freeCost = this.shippingCosts.filter(item => {
        return item.shipping_cost_local <= 0
      })
      freeCost = freeCost.length > 0 ? freeCost[0] : this.shippingCosts.slice(-1)
      this.freeShippingCost = freeCost.order_amount_local

      // 检查cookie中选中的sku
      let chosenSkus = utils.getCheckProductCookie()
      // 过滤掉不可用商品
      let unavaliableSkus = this.unavailableItems.map(item => {
        return item.skuId
      })
      chosenSkus = chosenSkus.filter(item => {
        return !unavaliableSkus.includes(item)
      })
      // 重新设置选中商品的cookie
      utils.saveCheckProductCookie(chosenSkus)

      availabelItems.map(item => {
        item.isChecked = chosenSkus.includes(item.skuId)
      })
      this.availabelItems = availabelItems

      // 获取数据后判断是否全部选中
      this.isAllChecked = this.checkItems()

      // 增加自定义纬度
      let productNos = availabelItems.concat(unavailableItems).map(item => {
        return item.productNo
      })
      googleAnalytics.setEcommProdid(productNos)
    },
    itemChecked (skuId) {
      this.availabelItems.every(item => {
        if (item.skuId === skuId) {
          item.isChecked = !item.isChecked
          // 当用户选中一个的时候需要检测是否全部选中
          this.isAllChecked = this.checkItems()
          return false
        }
        return true
      })
      this.saveChosenProduct()
    },
    checkAllItems () {
      this.isAllChecked = !this.isAllChecked
      this.availabelItems.map(item => {
        item.isChecked = this.isAllChecked
      })
      this.saveChosenProduct()
    },

    saveChosenProduct () {
      let chosenSkus = this.availabelItems.filter(item => {
        return item.isChecked
      }).map(item => {
        return item.skuId
      })
      utils.saveCheckProductCookie(chosenSkus)
    },

    checkItems () {
      return this.availabelItems.every(item => {
        return item.isChecked
      })
    },

    async itemDelete (skuId) {
      await this.$api.delCartItem(skuId)
      this.$message({
        message: 'delete success',
        type: 'success'
      })
      this.$bus.$emit('delete-cart')
      utils.removeCheckProductCookie(skuId)
      this.availabelItems = this.availabelItems.filter(item => {
        return item.skuId !== skuId
      })
    },

    unavailableItemDelete (skuId) {
      this.unavailableItems = this.unavailableItems.filter(item => {
        return item.skuId !== skuId
      })
    },

    onBuyNowClick () {
      let skuIds = []
      this.availabelItems.forEach(item => {
        if (item.isChecked) {
          skuIds.push(item.skuId)
        }
      })
      if (utils.getUserCountry() === 'id' && this.checkedCount > 10) {
        this.$message({
          message: `You can buy 10 items at most in one order according to the new policy.`,
          type: 'error'
        })
        return
      }
      this.$store.commit('updateSkuIds', skuIds)
      googleAnalytics.buyNow(this.totalUS)
      window.location.href = `${config.views.paymentAddress}?skuIds=${encodeURIComponent(skuIds.join(','))}`
    },

    countDown () {
      let interval = window.setInterval(() => {
        this.time.day = Math.floor(this.countDownTime / 3600 / 24)
        this.time.hour = Math.floor((this.countDownTime - this.time.day * 3600 * 24) / 3600)
        this.time.minute = Math.floor((this.countDownTime - this.time.day * 3600 * 24 - this.time.hour * 3600) / 60)
        this.time.seconds = this.countDownTime - this.time.day * 3600 * 24 - this.time.hour * 3600 - this.time.minute * 60
        this.time.hour = this.time.hour < 10 ? `0${this.time.hour}` : this.time.hour
        this.time.minute = this.time.minute < 10 ? `0${this.time.minute}` : this.time.minute
        this.time.seconds = this.time.seconds < 10 ? `0${this.time.seconds}` : this.time.seconds
        this.countDownTime--
        if (this.countDownTime === 0) {
          window.clearInterval(interval)
        }
      }, 1000)
    }
  },

  computed: {
    cartTitle () {
      return this.checkedCount > 0 ? `${this.$t('cart.my_cart')} (${this.checkedCount})` : this.$t('cart.my_cart')
    },

    checkedCount () {
      console.log('this.availabelItems', this.availabelItems)
      return this.availabelItems.filter(item => {
        return item.isChecked
      }).map(item => {
        return item.quantity
      }).reduce((a, b) => {
        return a + b
      }, 0)
    },

    totalPrice () {
      return this.availabelItems.filter(item => {
        return item.isChecked
      }).map(item => {
        return item.quantity * item.salePrice
      }).reduce((a, b) => {
        return a + b
      }, 0)
    },

    totalUS () {
      return this.availabelItems.filter(item => {
        return item.isChecked
      }).map(item => {
        return item.quantity * item.salePriceUS
      }).reduce((a, b) => {
        return a + b
      }, 0)
    },

    shippingFee () {
      let shipping = 0
      this.shippingCosts.every(item => {
        if (this.totalPrice >= item.order_amount_local) {
          shipping = item.shipping_cost_local
          return true
        }
        return false
      })
      return shipping
    },

    restFreeShipping () {
      let res = this.freeShippingCost - this.totalPrice
      return res > 0 ? res : 0
    },

    priceDetail () {
      return [{
        label: 'Total',
        price: this.totalPrice
      }, {
        label: 'Shipping Fee',
        price: this.shippingFee > 0 ? this.shippingFee : 'Free'
      }, {
        label: 'Paid Total',
        price: this.totalPrice + this.shippingFee - this.discountPrice.off_amount,
        oriPrice: this.discountPrice.off_amount ? this.totalPrice + this.shippingFee : 0
      }]
    },
    discountPrice () {
      let value = this.discount.slice().sort((a, b) => {
        return b.min_order_amount - a.min_order_amount
      }).find(item => {
        return this.totalPrice > item.min_order_amount
      }) || {min_order_amount: 0, off_amount: 0}
      console.log('discountPrice', value)
      return value
    }
  },

  beforeDestroy () {
    this.$bus.$off('quantity-change')
  }
}
</script>

<style lang="scss" scoped>
  .container /deep/ {
    align-items: center;
    .main {
      width: 100%;
    }
    .cart-content {
      .el-main {
        margin-right: 40px;
      }
      .el-aside {
        position: sticky;
        top: 0;
        align-self: flex-start;
        .price-detail {
          .card {
            width: 400px;
          }
        }
      }

      .empty-content {
        min-height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: $dusty-gray;
        .iconfont {
          font-size: $size36;
          margin-right: 15px;
        }
      }

      .cart-items {
        .available {
          margin-bottom: 50px;
          .discount {
            background: linear-gradient(to bottom, #b505fe, #d841f8);
            width: 100%;
            color: $white;
            font-size: 18px;
            display: flex;
            flex-direction: column;
            padding: 15px;
            box-sizing: border-box;
            font-weight: 300;
            .flex {
              flex: 1;
              display: flex;
              align-items: center;
            }
            .space {
              justify-content: space-between;
              .discount_text {
                width: 450px;
                text-align: left;
              }
              .count-down {
                span {
                  background: #333;
                  text-align: center;
                  height: 25px;
                  display: inline-block;
                  width: 25px;
                  line-height: 25px;
                }
              }
            }
            .off {
              font-size: 20px;
              font-weight: 400;
            }
          }
          .cart-item-header {
            height: 48px;
            background: $alabaster;
            display: flex;
            align-items: center;
            font-size: $small;
            .check-icon {
              display: inline-flex;
              align-items: center;
              color: $dove-gray;
              cursor: pointer;

              i {
                font-size: $xx-large;
                margin: 0 15px;
                &.icon-xuanzhong {
                  color: $flamingo;
                }
              }
            }
            .free-shipping-tips {
              color: $flamingo;
              margin-left: 25px;
            }
          }
        }
      }
      .discount {
        width: 100%;
        background: #FFF8D8;
        color: #F4931F;
        text-align: center;
        line-height: 20px;
        font-size: 14px;
        margin: 15px 0;
        padding: 10px;
        box-sizing: border-box;
      }
      .btn-buy-now {
        height: 60px;
        width: 100%;
        background: $flamingo;
        color: $white;
        font-size: $xx-large;
        border: none;
        outline: none;
        cursor: pointer;

        &:active {
          opacity: 0.5;
        }
        &:disabled {
          opacity: 0.4;
        }
      }
    }
  }
</style>
