<template>
  <fixed-header-container>
    <header-component slot="header" :is-category-show="false"></header-component>
    <div class="cart-content">
      <div class="paid_failed" v-if="orderFailed">
        <div class="shake">{{ $t('order.payment_fail') }}<span @click="tipClick">({{ $t('order.already_paid') }})</span>
        </div>
      </div>
      <el-container>
        <el-main style="padding: 0 55px; margin-right: 80px;">
          <div class="cart-items" >
            <div class="available">
              <div class="step">
                <el-steps :active="active" finish-status="process" align-center space="100%">
                  <el-step :title="$t('delivery.delivery_address')"></el-step>
                  <el-step :title="$t('order.payment')"></el-step>
                  <el-step :title="$t('order.payment_success')"></el-step>
                </el-steps>
              </div>
              <div v-if="false" style="margin-top: 30px;"> <!-- !isLogin -->
                <button class="btn-continue sign-login" @click="signUp">
                  <div class="sign-ligin-text">{{ $t('topbar.account.login') }}/{{ $t('topbar.account.sign_up') }}</div>
                  <!-- <div class="sign-login-coupon">to use coupon</div> -->
                </button>
                <div class="or">
                  <div class="or_text">or {{ $t('cart.check_out_guest') }}</div>
                </div>
              </div>
              <card-comp :title="$t('order.choose_payment')">
                <div style="background: #FFF8D8; color: #F5A623; font-size: 14px;text-align: center; padding: 15px 10px;" v-if="balance > total && useBalance">
                  Your payment can cover paid total. Unselect Balance to pay with other payment method.
                </div>
                <payment
                  :quickpayIds="quickpayIds"
                  :rate="rate"
                  :payments="payments"
                  :defaultPayment="defaultPayment"
                  :orderId="orderId"
                  :balanceCover="balance > total && useBalance"
                  :codReason="codReason"
                  :codFee="codFee"
                  :codArrival="codArrival"
                  :codLimit="codLimit"
                  :symbol="symbol"
                  ref="payment"
                  @onChange="changeMethod"
                  @addQpay="(quickpayInfo) => {quickpayIds.push(quickpayInfo)}"
                ></payment>
              </card-comp>
              <card-comp :title="$t('delivery.delivery_address')" :styles="{fontSize: '24px',paddingBottom: '10px'}">
                <div class="address-name">{{address.name}}</div>
                <div class="address">
                  <div>
                    {{address.street}}, <br>
                    {{address.city}}, {{address.state}}, <br>
                    {{address.country}}, <br>
                    {{address.zipcode}}
                  </div>
                  <div>
                    {{ $t('input.phone.title') }} : {{address.phone}}<br>
                    {{ $t('input.email.title') }} : {{address.email}}
                  </div>
                </div>
              </card-comp>
              <card-comp :title="$t('order.order_summary')" :styles="{fontSize: '24px',paddingBottom: '10px'}">
                <cart-item v-for="item in products" :key="item.skuId" :cartData="item" :currentSymbol="symbol"></cart-item>
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
              <div class="balance" v-if="this.balance">
                <div @click="showBalanceSelect">
                  <span class="label">Balance</span>
                  <span class="value">
                    <span v-if="useBalance">-{{symbol}} {{balance > total ? total : balance}}</span>
                    <span class="arrow" ref="arrow" style="transform: rotate(180deg)">
                      <i class="iconfont icon-xiangshang"></i>
                    </span>
                  </span>
                </div>
                <div class="use-balance" ref="balance" @click="useBalanceFn" style="max-height: 500px;">
                  <span>Use your balance (<span>{{symbol}} {{balance | round}}</span>)</span>
                  <i class="iconfont icon-xuanze" :class="{'icon-xuanzhong': useBalance}"></i>
                </div>
              </div>
              <div class="buy-now">
                <button class="btn-continue" @click="onPayNowClick">{{ $t('order.pay_now') }}</button>
              </div>
            </card-comp>
          </div>
        </el-aside>
      </el-container>
      <verify-phone :orderId="orderId" :codFee="codFee" :codArrival="codArrival" :defaultPhone="address.shipping_phone" :symbol="symbol"></verify-phone>
    </div>
  </fixed-header-container>
</template>

<script>
import 'assets/css/common'

import utils from 'assets/js/utils'
import conf from 'assets/js/conf'

import googleAnalytics from 'assets/js/google_analytics'

import HeaderComponent from 'components/HeaderComponent'
import CartItem from 'components/CartItem'
import CardComp from 'components/CardComp'
import FixedHeaderContainer from 'components/FixedHeaderContainer'
import PriceDetail from 'components/PriceDetail'
import NormalInput from 'components/NormalInput'
import SelectComp from 'components/SelectComp'
import Payment from 'components/payment/Payment'
import VerifyPhone from 'components/payment/VerifyPhone'

export default {
  components: {
    HeaderComponent,
    CartItem,
    CardComp,
    FixedHeaderContainer,
    PriceDetail,
    NormalInput,
    SelectComp,
    Payment,
    VerifyPhone
  },
  async created () {
    // const address = `${window.location.origin}${conf.views.paymentAddress}`
    // const pay = `${window.location.origin}${conf.views.paymentPay}`
    // const order = `${window.location.origin}${conf.views.order}`
    // const orderDetail = `${window.location.origin}${conf.views.orderDetail}`
    // if (!(document.referrer.indexOf(pay) > -1) && !(document.referrer.indexOf(address) > -1) && !(document.referrer.indexOf(order) > -1) && !(document.referrer.indexOf(orderDetail) > -1) && !(document.referrer.indexOf('payu') > -1)) {
    //   window.location.replace(`${conf.views.home}`)
    // }

    let s = document.createElement('script')
    s.type = 'text/javascript'
    s.async = true
    s.src = 'https://d14rk0dlif47fw.cloudfront.net/static/opcse.js'
    let a = document.createElement('script')
    a.type = 'text/javascript'
    a.async = true
    a.src = 'https://d14rk0dlif47fw.cloudfront.net/static/cpf_cnpj.min.js'
    let x = document.getElementsByTagName('script')[0]
    x.parentNode.insertBefore(s, x)
    x.parentNode.insertBefore(a, x)

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
    // var tokenInfo = utils.getDecodeToken()
    // if (!tokenInfo) {
    //   window.location.href = conf.views.home
    // }
  },
  data () {
    return {
      isTaxInclude: false,
      discount: '',
      isLogin: !!utils.getDecodeToken(),
      code: utils.getUserCountry(),
      symbol: utils.getSymbol(),
      active: 1,
      products: [],
      priceDetail: [{
        label: this.$t('order.price_total'),
        price: 0
      }, {
        label: this.$t('order.shipping_fee'),
        price: this.$t('order.free')
      }, {
        label: this.$t('order.paid_total'),
        price: 0
      }],
      address: {
        'phone': '',
        'zipcode': '',
        'email': '',
        'name': '',
        'country': '',
        'state': '',
        'city': '',
        'street': ''
      },
      payments: [],
      paymentMethod: 'ocean',
      defaultPayment: 'ocean',
      rate: [],
      quickpayIds: [],
      orderFailed: false,
      discountText: '',
      useBalance: false,
      balance: 0,
      total: 0,
      codReason: [],
      codFee: 0,
      codArrival: '',
      codLimit: [0, 0]
    }
  },
  methods: {
    useBalanceFn () {
      if (this.paymentMethod === 'cod') {
        return
      }
      this.useBalance = !this.useBalance
    },
    changeMethod (method) {
      let codFee = 0
      this.priceDetail.forEach(item => {
        if (item.label === 'COD Charge') {
          item.hide = method !== 'cod'
          codFee = item.price
        }
      })
      if (method === 'cod') {
        this.priceDetail[this.priceDetail.length - 1].price += codFee
        this.useBalanceOrigin = this.useBalance
        this.useBalance = false
      } else {
        if (this.useBalanceOrigin !== undefined) {
          this.useBalance = this.useBalanceOrigin
        }
        this.priceDetail[this.priceDetail.length - 1].price = this.priceDetail[this.priceDetail.length - 1].originPrice
      }
      this.paymentMethod = method
    },
    async init () {
      const total = await this.orderDetail()
      this.total = total
      const {
        method
      } = await this.$api.paymentMethod(this.orderId)
      let payments = []
      method.forEach((item, index) => {
        if (item.default) {
          if (item.name === 'balance') {
            if (item.balance_local > total) {
              this.useBalance = true
              this.balance = item.balance_local
            }
          }
          this.defaultPayment = this.balance < this.total && item.name === 'balance' ? method[index + 1].name : item.name
          this.paymentMethod = this.defaultPayment
        }
        if (item.name === 'cod') {
          this.codFee = item.cod_details.cod_fee
          this.codArrival = item.cod_details.arrive_date
          this.codLimit[0] = item.cod_details.amount_total_min
          this.codLimit[1] = item.cod_details.amount_total_max
          this.priceDetail.splice(this.priceDetail.length - 1, 0, {
            label: 'COD Charge',
            price: item.cod_details.cod_fee,
            hide: true
          })
          if (!item.cod_details.available) {
            let reasons = ['not_allow_pincode', 'not_allow_total', 'battery_included', 'product_nos_50', 'cod_times_exhausted', 'in_black_list']
            let reason = Object.keys(item.cod_details.reasons)
            reason.forEach(r => {
              if (reasons.indexOf(r) > -1) {
                this.codReason.push(reasons.indexOf(r) > 2 ? reasons.indexOf(r) - 1 : reasons.indexOf(r))
              }
            })
            // 去重
            if (this.codReason.length > 0) {
              this.codReason = this.codReason.sort().filter((item, index) => {
                return !index || item !== this.codReason[index - 1]
              })
            }
          }
        }
        payments.push(item.name)
        if (item.name === 'ocean_br' || item.name === 'ocean_mx') {
          this.key = item.pubkey
          let rates = []
          let rate = item.interest_rates
          for (let times in rate) {
            let symbol = item.name === 'ocean_br' ? 'R$' : 'Mex$'
            rates.push({
              label: `${times} x ${symbol} ${(total * (rate[times] / 100 + 1) / times).toFixed(2)} ( ${symbol}${total.toFixed(2)})`,
              value: times
            })
          }
          this.rate = rates
        }
        if (item.name === 'ocean_q') {
          this.quickpayIds = item.quickpay_ids || []
        }
      })
      this.payments = payments
    },
    async orderDetail () {
      let query = utils.parseQueryString()
      this.orderId = query.orderId || ''
      this.orderFailed = query.state === 'paying'
      const {
        products,
        summary,
        address,
        total,
        state,
        patmentMethod,
        gaData,
        symbol,
        isTaxInclude
      } = await this.$api.getOrderDetail(this.orderId)
      if (state === 'Processing') {
        window.location.replace(`${conf.views.orderDetail}?orderId=${this.orderId}`)
      }
      if (this.orderFailed) {
        googleAnalytics.payFailed(patmentMethod, this.orderId, gaData)
      }
      this.symbol = symbol
      this.products = products
      this.priceDetail = summary
      this.address = address
      this.isTaxInclude = isTaxInclude
      return total
    },
    async onPayNowClick () {
      if (this.paymentMethod === 'cod') {
        this.$bus.$emit('call-cod-order-confirm')
        return
      }
      if (this.paymentMethod === 'balance' && !this.useBalance) {
        this.$message({
          message: 'Please select a payment method!',
          type: 'error'
        })
        return
      }
      let param = {
        channel: this.paymentMethod,
        pay_failed_url: `${window.location.origin}${conf.views.paymentPay}`,
        pay_success_url: `${window.location.origin}${conf.views.paymentSuccess}`,
        payment_url: `${window.location.origin}${conf.views.paymentAddress}`
      }
      if (this.useBalance) {
        if (this.balance > this.total) {
          const {result} = await this.$api.paymentBalance(this.orderId)
          switch (result) {
            case 0: case 3: case 9:
              this.orderFailed = true
              break
            case 1:
              window.location.href = `${conf.views.paymentSuccess}?orderId=${this.orderId}`
              break
            case 2: case 4:
              window.location.href = `${conf.views.orderDetail}?orderId=${this.orderId}`
              break
          }
          return
        } else {
          param['use_balance'] = true
        }
      }

      let payment = this.$refs.payment
      if (this.paymentMethod === 'ocean_q') {
        if (payment.quickpayId) {
          param['quickpay_id'] = payment.quickpayId
        } else {
          this.$message({
            message: this.$t('alert.ocean_q_no_card.message'),
            type: 'error'
          })
          return
        }
      }

      // boleto
      if (this.paymentMethod === 'boleto') {
        let boletoData = payment.boletoData
        param['pay_name'] = boletoData[0].value
        param['pay_email'] = boletoData[1].value
        param['pay_cpf'] = boletoData[2].value
      }

      // ocean_mx 验证
      if (this.paymentMethod === 'ocean_mx') {
        let oceanMxData = payment.oceanMxData
        const verify = utils.matchCard(oceanMxData.cardNumber.value, 'opcseMxForm')
        if (this.verify(verify, oceanMxData, 'ocean_mx')) {
          return
        }
        let opcseForm = opcse.encryptForm('opcseMxForm', this.key)
        opcseForm.handleSubmit()
        let cardData = document.getElementById('card_data').value
        param['card_data'] = cardData
        if (oceanMxData.name.value) {
          param['card_name'] = oceanMxData.name.value
        }
        if (oceanMxData.paymentInstallment.value) {
          param['pay_installments'] = oceanMxData.paymentInstallment.value
        }
      }
      // ocean_br 验证
      if (this.paymentMethod === 'ocean_br') {
        let oceanBrData = payment.oceanBrData
        console.log('oceanBrData', oceanBrData)
        const verify = utils.matchCard(oceanBrData.cardNumber.value, 'opcseBrForm')
        if (!CPF.isValid(oceanBrData.cpf.value, true)) {
          verify['cpf'] = false
        } else {
          verify['cpf'] = true
        }
        if (oceanBrData.cnpj.value && !CNPJ.isValid(oceanBrData.cnpj.value, true)) {
          verify['cnpj'] = false
        } else {
          verify['cnpj'] = true
          if (oceanBrData.cnpj.value) {
            param['pay_cnpj'] = oceanBrData.cnpj.value
          }
        }
        if (this.verify(verify, oceanBrData, 'ocean_br')) {
          return
        }
        let opcseForm = opcse.encryptForm('opcseBrForm', this.key)
        opcseForm.handleSubmit()
        let cardData = document.getElementById('card_data').value
        param['card_data'] = cardData
        param['pay_cpf'] = oceanBrData.cpf.value
        if (oceanBrData.paymentInstallment.value) {
          param['pay_installments'] = oceanBrData.paymentInstallment.value
        }
        if (oceanBrData.name.value) {
          param['card_name'] = oceanBrData.name.value
        }
      }
      this.$api.paymentStart(this.orderId, param)
      googleAnalytics.payNow(this.paymentMethod)
      // 弹出窗口
      this.$clubConfirm(
        this.$t('alert.wait_complete.title'),
        this.$t('alert.wait_complete.message'),
        {
          cancelCallback: () => {
            window.location.replace(`${conf.views.orderDetail}?orderId=${this.orderId}`)
          },
          confirmCallback: () => {
            this.orderDetail()
          },
          confirmText: this.$t('alert.wait_complete.btn_confirm'),
          cancelText: this.$t('alert.wait_complete.btn_cancel')
        }
      )
    },
    signUp () {
      this.$bus.$emit('call-login')
    },
    tipClick () {
      this.$clubConfirm(
        this.$t('alert.already_paid.title'),
        this.$t('alert.already_paid.message'),
        {
          cancelText: this.$t('alert.already_paid.btn_cancel'),
          showConfirm: false
        }
      )
    },
    verify (verify, data, method) {
      // 验证数据 主要是ocean_br 和ocean_mx
      let hasErr = false
      for (let key in verify) {
        if (!verify[key]) {
          hasErr = true
        }
        switch (key) {
          case 'card':
            data.cardNumber.warningShow = hasErr
            data.cardNumber.warning = hasErr ? 'Invalid card number' : ''
            break
          case 'date':
            data.year.warningShow = hasErr
            data.year.warning = hasErr ? 'Invalid date' : ''
            break
          case 'cvv':
            data.cvv.warningShow = hasErr
            data.cvv.warning = hasErr ? 'Invalid code' : ''
            break
          case 'cpf':
            data.cpf.warningShow = hasErr
            data.cpf.warning = hasErr ? 'Invalid CPF' : ''
            break
          case 'cnpj':
            data.cnpj.warningShow = hasErr
            data.cnpj.warning = hasErr ? 'Invalid CNPJ' : ''
            break
        }
      }
      this.$bus.$emit('payment-data-error', {
        data,
        method
      })
      return hasErr
    },
    showBalanceSelect () {
      let balanceStyle = this.$refs.balance.style
      console.log('maxHeight', balanceStyle.maxHeight)
      if (balanceStyle.maxHeight === '500px') {
        balanceStyle.maxHeight = 0
        balanceStyle.padding = 0
        this.$refs.arrow.style.transform = 'rotate(0deg)'
      } else {
        balanceStyle.maxHeight = '500px'
        balanceStyle.padding = '10px 0'
        this.$refs.arrow.style.transform = 'rotate(180deg)'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.paid_failed {
  color: #A50000;
  background: #FBF4F4;
  font-size: 18px;
  text-align: center;
  padding: 10px;
  margin: 20px 0 20px 55px;
  .shake {
    animation: shake 1s ease-in-out;
    span {
      color: #4A90E2;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
@keyframes shake {
  from,
  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    -webkit-transform: translate3d(-10px, 0, 0);
    transform: translate3d(-10px, 0, 0);
  }

  20%,
  40%,
  60%,
  80% {
    -webkit-transform: translate3d(10px, 0, 0);
    transform: translate3d(10px, 0, 0);
  }
}
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
        .balance {
          background: #FBFBFB;
          margin: 10px 0;
          padding: 0 5px;
          div {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            cursor: pointer;
            .lable {
              font-size: 18px;
              color: #333;
            }
            .value {
              color: $flamingo;
              font-size: 18px;
              .arrow {
                transition: all 150ms;
                display: inline-block;
                i {
                  color: #666;
                  font-size: 14px;
                  vertical-align: 10%;
                }
              }
            }
          }
          .use-balance {
            font-size: 14px;
            color: #666;
            overflow: hidden;
            height: auto;
            transition: all 100ms;
            // max-height: 500px;
            cursor: default;
            span {
              span {
                color: $flamingo;
              }
            }
            i {
              cursor: pointer;
              font-size: 18px;
              &.icon-xuanzhong {
                color: $flamingo;
              }
            }
          }
        }
        .card {
          width: 400px;
        }
        .warning {
          color: #F4931F;
          background: #FFF8D8;
          font-size: $small;
          padding: 10px 20px;
          margin: 10px 0;
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

.address-name {
  color: $mine-shaft;
  font-size: $large;
  margin: 20px 0;
  font-weight: 500;
}
.address {
  display: flex;
  color: $dove-gray;
  font-size: $medium;
  justify-content: space-between;
  line-height: 22px;
}
</style>
