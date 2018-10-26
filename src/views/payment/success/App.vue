<template>
  <fixed-header-container>
    <header-component slot="header" :is-category-show="false"></header-component>
      <el-container>
        <el-main >
          <div class="step">
            <el-steps :active="active" finish-status="process" align-center space="100%">
              <el-step title="Delivery Address"></el-step>
              <el-step title="Payment"></el-step>
              <el-step title="Success"></el-step>
            </el-steps>
          </div>
          <i class="iconfont icon-xuanzhong"></i>
          <div class="text">{{type === 'cod' ? 'COD Order Confirmed' : 'Payment Successful'}}</div>
          <section style="margin-top: 30px; text-align: center;" v-if="type === 'cod'">
            <p>We will call you within 24 hours of purchase for additional information to verify your order.</p>
            <p>After 3 attempts, you order will be canceled. Please be available on phone.</p>
            <p class="flamingo">You can redeem a COUPON after your COD order is delivered.</p>
          </section>
          <button @click="goHome" class="btn btn_home">Go Back HomePage</button>
          <button @click="goOrderDetail" class="btn btn_order_detail">View Order Details</button>
          <div class="br"></div>
          <div class="order">
            <span class="my_order">My Order</span> <span class="order_id">{{orderId}}</span> <br>
            <span class="order_total">TOTAL</span> <span class="order_price">{{`${symbol}${total}`}}</span>
          </div>
          <div class="br"></div>
          <div class="address">
            <div class="address_title">Shippping To</div>
            <div class="address_detail">
              <div>
                {{address.name}} <br> <br>
                {{address.street}} <br>
                {{`${address.city}${address.state}${address.zipcode}`}} <br>
                {{address.country}} <br>
              </div>
              <div class="address_contact">
                Phone Number: {{address.phone}} <br>
                Email: {{address.email}}
              </div>
            </div>
          </div>
          <div class="ship">
            <div class="ship_item" v-for="(item, index) in deliveryInfo" :key="index">
              <div class="ship_name">{{index}}</div>
              <div class="ship_value">{{item}}</div>
            </div>
          </div>
          <div class="delivery_time_title">
            Estimated Delivery Time
            <div class="delivery_time">
              {{arriveDate}}
            </div>
          </div>
        </el-main>
      </el-container>
  </fixed-header-container>
</template>

<script>
import 'assets/css/common'

import utils from 'assets/js/utils'
import conf from 'assets/js/conf'
import googleAnalytics from 'assets/js/google_analytics'
import facebookPixel from 'assets/js/facebook_pixel'

import HeaderComponent from 'components/HeaderComponent'
import FixedHeaderContainer from 'components/FixedHeaderContainer'

export default {
  components: {
    HeaderComponent,
    FixedHeaderContainer
  },
  async created () {
    let query = utils.parseQueryString()
    this.orderId = query.orderId || ''
    this.type = query.type || 'normal'
    const {
      summary,
      address,
      total,
      deliveryInfo,
      arriveDate,
      patmentMethod,
      gaData,
      symbol,
      products
    } = await this.$api.getOrderDetail(this.orderId)
    this.priceDetail = summary
    this.address = address
    this.total = total.toFixed(2)
    this.symbol = symbol
    this.deliveryInfo = {
      'Shipping Method': deliveryInfo.delivery_name,
      'Preparation Time': `${deliveryInfo.prepare_time} days`,
      'Delivery Time (Buiness Days)': `${deliveryInfo.shipping_time} days`
    }
    this.arriveDate = arriveDate
    products.map(item => {
      googleAnalytics.addCart({
        id: item.productNo,
        name: item.name,
        // TODO 现在这里取不到类别名称
        quantity: item.quantity,
        price: item.gaPirce,
        variant: item.sku
      })
    })
    googleAnalytics.payComplete(patmentMethod, this.orderId, gaData)
    let productNos = products.map(item => {
      return item.productNo
    })
    facebookPixel.purchase({
      value: gaData.totalUs,
      contentIds: productNos,
      contentType: 'product'
    })
    // this.adsStatic()
  },
  data () {
    return {
      skuIds: '',
      code: utils.getUserCountry(),
      symbol: utils.getSymbol(),
      active: 2,
      total: '',
      address: {
        city: '',
        country: '',
        email: '',
        name: '',
        phone: '',
        state: '',
        street: '',
        zipcode: ''
      },
      deliveryInfo: {
        'Shipping Method': '',
        'Preparation Time': '',
        'Delivery Time (Buiness Days)': ''
      },
      arriveDate: '',
      type: 'normal'
    }
  },
  computed: {
  },
  methods: {
    goHome () {
      window.location.href = conf.views.home
    },

    goOrderDetail () {
      window.location.href = `${conf.views.orderDetail}?orderId=${this.orderId}`
    }
    // adsStatic () {
    //   var name = cname + '='
    //   var ca = document.cookie.split(';')
    //   var utmSource = ''
    //   for (var i = 0; i < ca.length; i++) {
    //     var c = ca[i]
    //     while (c.charAt(0) === ' ') {
    //       c = c.substring(1)
    //     }
    //     if (c.indexOf(name) === 0) {
    //       utmSource = c.substring(name.length, c.length)
    //       if (utmSource === 'vcommission') {
    //         document.write('<iframe src="https://tracking.vcommission.com/SLEVV?adv_sub=OrderID&amount=SaleAMOUNT&adv_sub2=ModeofPayment" scrolling="no" frameborder="0" width="1" height="1"></iframe>')
    //       }
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
.container /deep/ {
  align-items: center;
  .main {
    width: 100%;
  }
  .el-main {
    padding: 30px 100px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .iconfont {
      font-size: 50px;
      color: #FB623F;
      margin-top: 40px;
    }
    .text {
      font-size: 36px;
      color: $mine-shaft;
      margin-top: 40px;
      text-align: center;
    }
    p {
      font-size: 14px;
      color: #999;
      line-height: 22px;
      &.flamingo {
        color: $flamingo;
      }
    }
    .btn_home {
      margin-top: 40px;
      color: $flamingo;
      background: $white;
    }
    .btn_order_detail {
      color: $mine-shaft;
      background: $white;
      border: solid 1px $mine-shaft;
    }
    .br {
      width: 600px;
      border-top: solid 1px #e5e5e5;
      margin: 20px 0;
    }
    .order {
      font-size: $large;
      line-height: 28px;
      .my_order {
        color: $mine-shaft;
      }
      .order_id {
        color: #7B7F88;
      }
      .order_total {
        color: #7B7F88;
      }
      .order_price {
        color: #FB623F;
      }
    }
    .address {
      font-size: $medium;
      .address_title {
        color: $mine-shaft;
      }
      .address_detail {
        width: 600px;
        color: $dusty-gray;
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        .address_contact {
          margin-top: 40px;
        }
      }
    }
    .ship {
      border-top: solid 1px $mecury;
      margin-top: 30px;
      .ship_item {
        font-size: $medium;
        display: flex;
        width: 600px;
        height: 40px;
        line-height: 40px;
        border-bottom: solid 1px $mecury;
        .ship_name {
          flex: 1;
          color: $mine-shaft;
          border-right: solid 1px $mecury;
        }
        .ship_value {
          flex: 1;
          color: $dusty-gray;
          text-align: right;
        }
      }
    }
    .delivery_time_title {
      font-size: 20px;
      color: $mine-shaft;
      margin-top: 25px;
      .delivery_time {
        color: #FC6340;
        margin-top: 10px;
        text-align: center;
      }
    }
    .step {
      width: 600px;
      .el-step {
        .el-step__head {
          &.is-wait {
            border: none;
          }
          &.is-process {
            .el-step__icon {
              background: $fuscous-gray;
            }
          }
          .el-step__line {
            top: 20px;
            height: 1px;
            background: $alto;
          }
          .el-step__icon {
            color: $white;
            background: $mecury;
            &.is-text {
              border: none;
              height: 40px;
              width: 40px;
              font-size: $xx-large;
              .el-step__icon-inner {
                font-weight: 200;
              }
            }
          }
        }
        .el-step__main {
          .el-step__title {
            font-size: $x-large;
            font-weight: 400;
            &.is-wait {
              color: $mecury;
            }
            &.is-process {
              color: $fuscous-gray;
            }
          }
        }
      }
    }
  }
}
</style>
