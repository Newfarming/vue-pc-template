<template>
  <fixed-header-container>
    <header-component slot="header" :is-category-show="false"></header-component>
    <div class="cart-content">
      <el-container>
        <el-main style="padding: 0 55px; margin-right: 80px;">
          <div class="cart-items">
            <div class="available">
              <div class="step">
                <el-steps :active="active" finish-status="process" align-center space="100%">
                  <el-step :title="$t('delivery.delivery_address')"></el-step>
                  <el-step :title="$t('order.payment')"></el-step>
                  <el-step :title="$t('order.payment_success')"></el-step>
                </el-steps>
              </div>
              <div v-if="!isLogin" style="margin-top: 30px;">
                <button class="btn-continue sign-login" @click="signUp">
                  <div class="sign-ligin-text">{{ $t('topbar.account.login') }}/{{ $t('topbar.account.sign_up') }}</div>
                  <div class="sign-login-coupon">to use coupon</div>
                </button>
                <div class="or">
                  <div class="or_text">or {{ $t('cart.check_out_guest') }}</div>
                </div>
              </div>
              <card-comp :title="$t('delivery.delivery_address')">
                <template v-for="address in addresses">
                  <normal-input
                    v-if="address.type == 'input' && !address.hide"
                    :key="address.title"
                    :inputData="address"
                    v-model="address.value"
                    @blur="val => { if (address.name == 'pincode') pincodeChange(val) }"
                  ></normal-input>
                  <select-comp v-else-if="!address.hide" :key="address.title" :selectData="address"
                               v-model="address.value"></select-comp>
                </template>
              </card-comp>
              <card-comp :title="$t('order.order_summary')">
                <cart-item v-for="item in products" :key="item.skuId" :cartData="item"></cart-item>
              </card-comp>
            </div>
          </div>

        </el-main>
        <el-aside width="400px">
          <div class="price-detail">
            <card-comp :title="$t('order.price_detail')">
              <price-detail :price-detail="priceDetail" :symbol="symbol" :isTaxInclude="isTaxInclude"></price-detail>
              <div class="discount" v-if="discountText.length">
                {{symbol}} {{discountText}}
              </div>
              <div class="coupon" v-if="isLogin && !discountText.length">
                <div class="coupon-title">
                  <div>Coupon</div>
                  <div class="right" @click="showCoupon">
                    <span class="available">{{couponText}}</span>
                    <i ref="triangle" class="iconfont icon-xiala"></i>
                  </div>
                </div>
                <div class="coupon-area" ref="coupon">
                  <coupon :showSelect="true" v-for="item in coupon" :key="item.id" :coupon="item" :couponId="couponId" @onChange="couponIdChange" :symbol="symbol">
                  </coupon>
                </div>
                <div class="promo-code">
                  Promo Code
                  <div>
                    <input type="text" v-model="promoCode">
                    <button class="btn redeem-btn" @click="onRedeem">Redeem</button>
                  </div>
                </div>
              </div>
              <div class="buy-now">
                <button class="btn-continue" @click="onBuyNowClick">{{ $t('order.buy_now') }}</button>
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
import conf from 'assets/js/conf'
import reg from 'assets/js/reg'
import googleAnalytics from 'assets/js/google_analytics'
import {countryCodeMap} from 'assets/js/country'

import HeaderComponent from 'components/HeaderComponent'
import CartItem from 'components/CartItem'
import CardComp from 'components/CardComp'
import FixedHeaderContainer from 'components/FixedHeaderContainer'
import PriceDetail from 'components/PriceDetail'
import NormalInput from 'components/NormalInput'
import SelectComp from 'components/SelectComp'
import Coupon from 'components/Coupon'

export default {
  components: {
    HeaderComponent,
    CartItem,
    CardComp,
    FixedHeaderContainer,
    PriceDetail,
    NormalInput,
    SelectComp,
    Coupon
  },
  async created () {
    const cart = `${window.location.origin}${conf.views.cart}`
    const address = `${window.location.origin}${conf.views.paymentAddress}`
    const productDetail = `${window.location.origin}${conf.views.productDetail}`
    if (
      !(document.referrer.indexOf(cart) > -1) &&
      !(document.referrer.indexOf(address) > -1) &&
      !(document.referrer.indexOf('paypal') > -1) &&
      !(document.referrer.indexOf(productDetail) > -1) &&
      !(document.referrer.indexOf('shopping') > -1)
    ) {
      window.location.replace(`${conf.views.home}`)
    }
    this.$bus.$on('login-success', () => {
      this.isLogin = true
      this.init()
    })
    this.init()
    const {
      AmountOff
    } = await this.$api.discount()
    let text = AmountOff.coupons.reduce((a, b) => {
      if (a.off_amount) {
        return `${a.off_amount} off ${a.min_order_amount}+ / ${b.off_amount} off ${b.min_order_amount} +`
      }
      return `${a} / ${b.off_amount} off ${b.min_order_amount} +`
    }, '')
    if (AmountOff.expire_time) {
      this.discountText = text
    }
  },
  data () {
    return {
      isTaxInclude: false,
      promoCode: '',
      coupon: [],
      couponId: 0,
      couponPrice: 0,
      discountText: '',
      skuIds: '',
      quantity: '',
      isLogin: !!utils.getDecodeToken(),
      code: utils.getUserCountry(),
      shippingCosts: [],
      freeShippingCost: 0,
      symbol: utils.getSymbol(),
      active: 0,
      products: [],
      priceDetail: [
        {
          label: this.$t('order.price_total'),
          price: 0
        },
        {
          label: this.$t('order.shipping_fee'),
          price: this.$t('order.free')
        },
        {
          label: this.$t('order.paid_total'),
          price: 0,
          oriPrice: 0
        }
      ],
      addresses: [
        {
          name: 'name',
          title: this.$t('input.name.title'),
          type: 'input',
          value: '',
          warning: this.$t('input.name.warning'),
          warningShow: false,
          reg: /^.+$/
        },
        {
          name: 'email',
          title: this.$t('input.email.title'),
          type: 'input',
          value: '',
          placeholder: this.$t('input.email.placeholder'),
          warning: this.$t('input.email.warning'),
          warningShow: false
        },
        {
          name: 'address',
          title: this.$t('input.address.title'),
          type: 'input',
          value: '',
          placeholder: this.$t('input.address.placeholder'),
          warning: this.$t('input.address.warning'),
          warningShow: false,
          reg: /^.{1,100}$/
        },
        {
          name: 'pincode',
          title: this.$t('input.pincode.title'),
          type: 'input',
          value: '',
          placeholder: this.$t('input.pincode.placeholder'),
          warning: this.$t('input.pincode.warning'),
          reg: /^\d{6}$/,
          warningShow: false,
          width: '50%',
          hide: true
        },
        {
          name: 'country',
          title: this.$t('input.country.title'),
          type: 'input',
          value: '',
          disabled: true,
          width: '50%'
        },
        {
          name: 'state',
          title: this.$t('input.state.title'),
          type: 'select',
          option: [],
          value: '',
          warning: this.$t('input.state.warning'),
          warningShow: false,
          reg: /^.+$/,
          disabled: false,
          width: '50%'
        },
        {
          name: 'city',
          title: this.$t('input.city.title'),
          type: 'input',
          value: '',
          warning: this.$t('input.city.warning'),
          warningShow: false,
          reg: /^.+$/,
          disabled: false,
          width: '50%'
        },
        {
          name: 'zip_code',
          title: this.$t('input.zip_code.title'),
          type: 'input',
          value: '',
          warning: this.$t('input.zip_code.warning'),
          warningShow: false,
          reg: /^.+$/,
          disabled: false,
          width: '50%'
        },
        {
          name: 'address_1',
          title: this.$t('input.address_1.title'),
          type: 'input',
          value: '',
          placeholder: this.$t('input.address_1.placeholder'),
          warning: this.$t('input.address_1.warning'),
          warningShow: false,
          reg: /^.+$/,
          hide: true
        },
        {
          name: 'address_2',
          title: this.$t('input.address_2.title'),
          type: 'input',
          value: '',
          placeholder: this.$t('input.address_2.placeholder'),
          warning: this.$t('input.address_2.warning'),
          warningShow: false,
          reg: /^.+$/,
          hide: true
        },
        {
          name: 'landmark',
          title: this.$t('input.landmark.title'),
          subTitle: '(Optional)',
          type: 'input',
          value: '',
          placeholder: this.$t('input.landmark.placeholder'),
          hide: true
        },
        {
          name: 'phone',
          title: this.$t('input.phone.title'),
          type: 'input',
          value: '',
          placeholder: this.$t('input.phone.placeholder'),
          prefix: '',
          warningShow: false
        }
      ]
    }
  },
  computed: {
    couponText () {
      return this.couponPrice
        ? `${this.symbol} ${this.couponPrice} OFF`
        : `${this.coupon.length} available`
    }
  },
  methods: {
    showCoupon () {
      if (this.$refs.coupon.style.maxHeight) {
        this.$refs.coupon.style.maxHeight = ''
        this.$refs.triangle.style.transform = ''
      } else {
        this.$refs.coupon.style.maxHeight = `${this.coupon.length * 200}px`
        this.$refs.triangle.style.transform = 'rotate(-180deg)'
      }
    },
    couponIdChange (coupon) {
      if (this.couponId === coupon.id) {
        return
      }
      this.couponId = coupon.id
      this.couponPrice = coupon.discount
      let hasLabel = false
      this.priceDetail.map(item => {
        if (item.name === 'coupon') {
          item.price = -coupon.discount
          hasLabel = true
        }
        if (item.name === 'paidTotal') {
          item.price = item.price - coupon.discount
        }
        return item
      })
      if (!hasLabel) {
        this.priceDetail.splice(this.priceDetail.length - 1, 0, {
          name: 'coupon',
          label: 'Coupon',
          price: -coupon.discount
        })
      }
    },
    async onRedeem () {
      if (this.promoCode.length) {
        const coupon = await this.$api.getCoupon(this.promoCode)
        if (coupon.id) {
          const check = await this.$api.couponCheck({
            coupon_id: coupon.id,
            order_subtotal: this.priceDetail[0].price
          })
          if (check) {
            this.coupon.unshift(check)
            this.$message({
              message: `You‘ve got a coupon successfully!`,
              type: 'success'
            })
          } else {
            this.$message({
              message: `You‘ve got a coupon, but it is not appliacble now. Check your coupon in your account. `,
              type: 'warning'
            })
          }
          this.promoCode = ''
        }
      } else {
        this.$message({
          message: `Please enter a code!`,
          type: 'warning'
        })
      }
    },
    async init () {
      let query = utils.parseQueryString()
      this.skuIds = query.skuIds || ''
      this.quantity = query.quantity || ''
      const {
        products,
        priceList,
        phoneReg,
        zipReg,
        maxOrderMoney,
        orderAmount,
        deliveryAddress,
        coupon,
        symbol,
        isTaxInclude
      } = await this.$api.getOrderPreview(this.skuIds, this.quantity)
      console.log('coupon', coupon)
      this.products = products
      this.priceDetail = priceList
      this.maxOrderMoney = Math.ceil(maxOrderMoney)
      this.orderAmount = orderAmount
      this.coupon = coupon
      this.symbol = symbol
      this.isTaxInclude = isTaxInclude
      if (deliveryAddress.email) {
        this.addresses[0].value = deliveryAddress.name
        this.addresses[1].value = deliveryAddress.email
        this.addresses[2].value = deliveryAddress.street2
        this.addresses[3].value = deliveryAddress.zip // pincode
        this.addresses[5].value = deliveryAddress.state_id
        this.addresses[6].value = this.addresses[6].name === 'city' ? deliveryAddress.city : ''
        this.addresses[4].value = this.addresses[4].name === 'city' ? deliveryAddress.city : ''
        this.addresses[7].value = deliveryAddress.zip // zipcode
        this.addresses[11].value = deliveryAddress.phone
        if (this.code === 'in') {
          this.addresses[5].value = deliveryAddress.state
          if (deliveryAddress.street.india) {
            this.addresses[8].value = deliveryAddress.street.india.flat
            this.addresses[9].value = deliveryAddress.street.india.colony
            this.addresses[10].value = deliveryAddress.street.india.landmark
          }
        }
      }

      this.addresses.map(async address => {
        switch (address.name) {
          case 'email':
            let user = utils.getDecodeToken()
            if (user && reg.getEmailReg().test(user.account)) {
              address.value = user.account
            }
            address.reg = reg.getEmailReg()
            break
          case 'country':
            address.value = countryCodeMap[this.code]
              ? countryCodeMap[this.code].name
              : ''
            break
          case 'state':
          case 'city':
            address.warningShow = false
            if (this.code === 'in') {
              address.disabled = true
              address.type = 'input'
              address.warningShow = true
            } else if (address.name === 'state') {
              address.option = await this.$api.getState(this.code)
            }
            break
          case 'zip_code':
            console.log('this.cpde', this.code)
            let regInfo = reg.getZipCodeReg(this.code)
            address.reg = eval(zipReg)
            address.warning = regInfo.error
            if (regInfo.length > 0) {
              address.placeholder = regInfo.style.repeat(regInfo.length)
            }
            const codes = ['in', 'ae', 'sa', 'qa']
            if (codes.indexOf(this.code) !== -1) {
              address.hide = true
            }
            break
          case 'address':
            if (this.code === 'in') {
              address.hide = true
            }
            break
          case 'pincode':
          case 'address_1':
          case 'address_2':
          case 'landmark':
            if (this.code === 'in') {
              address.hide = false
            }
            break
          case 'phone':
            if (phoneReg.code) {
              address.prefix = `+${phoneReg.code}`
              address.placeholder = '*'.repeat(phoneReg.length)
              address.reg = new RegExp(`^\\d{${phoneReg.length}}$`)
              address.warning = `${phoneReg.length} Digits Please!`
            }
        }
        return address
      })

      if (this.code === 'in' && this.addresses[4].name === 'country') {
        let temp = this.addresses[4]
        this.addresses[4] = this.addresses[6]
        this.addresses[6] = temp
      }
    },
    async onBuyNowClick () {
      let hasWarning = false
      this.addresses.map(item => {
        if (item.hide) {
          return item
        }
        if (
          (item.reg && !item.reg.test(item.value)) ||
          (item.title.indexOf('Address') > -1 && /^\d+$/.test(item.value))
        ) {
          item.warningShow = true
          hasWarning = true
        } else if (!item.disabled) {
          item.warningShow = false
        }
        return item
      })

      if (!hasWarning) {
        let param = {
          name: this.addresses[0].value,
          email: this.addresses[1].value,
          phone: this.addresses[11].value
        }
        if (this.code === 'in') {
          param['flat'] = this.addresses[8].value
          param['colony'] = this.addresses[9].value
          if (this.addresses[10].value) {
            param['landmark'] = this.addresses[10].value
          }
          param['zip'] = this.addresses[3].value
        } else {
          param['street2'] = this.addresses[2].value
          param['state_id'] = this.addresses[5].value
          param['city'] = this.addresses[6].value
          if (!this.addresses[7].hide) {
            param['zip'] = this.addresses[7].value
          }
        }
        console.log('param------->>>>>>>', param)
        await this.$api.updateShippingAddress(param)

        // 沙特和阿联酋新规定：订单金额必须<$260 印度低于50000Rs
        if (this.maxOrderMoney && this.orderAmount >= this.maxOrderMoney) {
          this.$message.error(`Please keep your order value under ${this.symbol}${this.maxOrderMoney}`)
        } else {
          if (this.quantity) {
            param['buy_now_products'] = this.skuIds
            param['buy_now_quantitys'] = this.quantity
          } else {
            param['cart_choosed_product'] = this.skuIds
          }
          if (this.couponId) {
            param['coupon_id'] = this.couponId
          }
          const { orderId, totalUs } = await this.$api.createOrder(param)
          googleAnalytics.createOrder(orderId, totalUs)
          window.location.replace(`${conf.views.paymentPay}?orderId=${orderId}`)
        }
      }
    },

    signUp () {
      this.$bus.$emit('call-login')
    },

    async pincodeChange (value) {
      if (!value) {
        this.$message.error(`Please input your pincode.`)
        return
      }
      const { city, state } = await this.$api.getPincode(value)
      if (city === '' && state === '') {
        this.$message.error(
          `We currently don't deliver here. Please check your pincode.`
        )
      }
      this.addresses[4].value = city
      this.addresses[5].value = state
    }
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
      .el-aside {
        position: sticky;
        top: 0;
        align-self: flex-start;
        .price-detail {
          .card {
            width: 400px;
          }
          .warning {
            color: #f4931f;
            background: #fff8d8;
            font-size: $small;
            padding: 10px 20px;
            margin: 10px 0;
          }
          .discount {
            width: 100%;
            background: #fff8d8;
            color: #f4931f;
            text-align: center;
            line-height: 20px;
            font-size: 14px;
            margin: 15px 0;
            padding: 10px;
            box-sizing: border-box;
          }
          .coupon {
            background: #fbfbfb;
            padding: 10px;
            .coupon-title {
              font-size: 18px;
              color: #333;
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              .right {
                user-select: none;
                cursor: pointer;
                .available {
                  color: $flamingo;
                }
                i {
                  font-weight: 600;
                  transition: all 300ms;
                  display: inline-block;
                }
              }
            }
            .coupon-area {
              transition: all 300ms;
              height: auto;
              max-height: 0px;
              overflow: hidden;
            }
            .promo-code {
              border-top: solid 1px #e5e5e5;
              border-bottom: solid 1px #e5e5e5;
              padding: 10px 0;
              color: #333;
              display: flex;
              justify-content: space-between;
              align-items: center;
              input {
                border: none;
                outline: none;
                border: solid 1px #e5e5e5;
                width: 160px;
                height: 32px;
                box-sizing: border-box;
                padding: 10px;
              }
              .redeem-btn {
                height: 32px;
                width: 80px;
                margin-left: -5px;
                margin-top: 0px;
                font-size: 14px;
              }
            }
          }
        }
      }

      .cart-items {
        .available {
          margin-bottom: 50px;
          .card {
            margin-top: 50px;
          }
          .step {
            margin: 30px 0 40px 0;
          }
        }
      }

      .btn-continue {
        height: 60px;
        width: 100%;
        background: $mine-shaft;
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
      .sign-login {
        background: $flamingo;
        height: 65px;
        margin-bottom: 40px;
        .sign-login-text {
          font-size: $xx-large;
        }
        .sign-login-coupon {
          font-size: $large;
        }
      }
    }
  }

  .or {
    margin-bottom: 40px;
    width: 100%;
    background-color: $mecury;
    height: 1px;
    position: relative;
    .or_text {
      position: absolute;
      left: 50%;
      transform: translate3d(-125px, -10px, 0);
      width: 250px;
      background: $white;
      color: $dusty-gray;
      font-size: 16px;
      font-weight: 100;
      text-align: center;
    }
  }
</style>
