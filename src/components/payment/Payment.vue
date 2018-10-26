<template>
  <div class="payment" :class="{gray: balanceCover}">
    <!-- ocean_q_payment  v-if="payments.indexOf('ocean_q') > -1" -->
    <div class="payment_title" v-if="payments.indexOf('ocean_q') > -1">Credit Payment</div>
    <div v-if="payments.indexOf('ocean_q') > -1">
      <div class="card_list" v-for="item in quickpayIds" :key="item.quickpay_id" @click="onOceanQchecked(item.quickpay_id)">
        <div>
          <img :src="images.visa" />
          <span>{{item.card_number}}</span>
        </div>
        <i class="iconfont icon-xuanze" :class="{'icon-xuanzhong': quickpayId === item.quickpay_id && payMethod === 'ocean_q'}"></i>
      </div>
      <div class="payment_line quickPay clearfix" id="ocean_q" @click="onChange('ocean_q')" >
        <div class="center" @click="addQuickPay">
            <i class="iconfont icon-add1"></i>
            <span>Add New Card | Accept</span>
            <img :src="images.oceanMx" />
        </div>
        <!-- <i class="iconfont icon-xuanze" :class="{'icon-xuanzhong': payMethod === 'ocean_q'}"></i> -->
      </div>
      <div v-if="showNewCardMask" class="new_card_mask">
        <transition
          name="fade"
        >
          <div v-if="showNewCardModal" class="new_card_modal">
            <i class="iconfont icon-guanbi_cp" @click="showModal(false)"></i>
            <iframe id="quickpay_frame" style="height: 400px; width: 400px;" name="quickpay_frame" src="http://dev.clubfactory.com:8081/views/payment/pay/success.html" frameborder="0"></iframe>
          </div>
        </transition>
      </div>
    </div>
    <div class="payment_title" v-if="payments.indexOf('ocean_q') > -1 && payments.length > 1">Other Payment</div>
    <!-- payu -->
    <div class="payment_line payu clearfix" id="payu" @click="onChange('payu')" v-if="payments.indexOf('payu') > -1">
      <div>
          <img :src="images.payu" />
          <p>Wallet / Credit&Debit Card / Net Banking</p>
      </div>
      <i class="iconfont icon-xuanze" :class="{'icon-xuanzhong': payMethod === 'payu'}"></i>
    </div>
    <!-- ocean_payment -->
    <div class="payment_line credit_card clearfix" id="ocean" @click="onChange('ocean')" v-if="payments.indexOf('ocean') > -1">
      <div class="center">
          <img :src="images.visa" />
          <img :src="images.masterCard" />
          <img :src="images.maestro" />
      </div>
      <i class="iconfont icon-xuanze" :class="{'icon-xuanzhong': payMethod === 'ocean'}"></i>
    </div>
    <!-- paytm_payment -->
    <div class="payment_line paypal clearfix" id="paytm" @click="onChange('paytm')" v-if="payments.indexOf('paytm') > -1">
      <div>
        <img :src="images.paytm" />
        <p>Wallet / Credit&Debit Card / Net Banking</p>
      </div>
      <i class="iconfont icon-xuanze" :class="{'icon-xuanzhong': payMethod === 'paytm'}"></i>
    </div>
    <!-- cashfree_payment -->
    <div class="cashfree payment_line clearfix" id="cashfree" @click="onChange('cashfree')" v-if="payments.indexOf('cashfree') > -1">
      <div>
        <img :src="images.cashfree" />
        <p>Freecharge / MobiKwik / Ola / Jio / Oxigen / Airtel</p>
      </div>
      <i class="iconfont icon-xuanze" :class="{'icon-xuanzhong': payMethod === 'cashfree'}"></i>
    </div>
    <!-- xendit_payment -->
    <div class="xendit payment_line clearfix" id="xendit" @click="onChange('xendit')" v-if="payments.indexOf('xendit') > -1">
      <div>
        <img :src="images.xendit" style="height: 28px; max-width: 95%; margin-bottom: 4px;" />
        <p>Bank Transfer / Credit Card</p>
      </div>
      <i class="iconfont icon-xuanze" :class="{'icon-xuanzhong': payMethod === 'xendit'}"></i>
    </div>
    <!-- paypal_payment -->
    <div class="payment_line clearfix paypal" id="paypal" @click="onChange('paypal')" v-if="payments.indexOf('paypal') > -1">
      <div>
        <img :src="images.paypal"/>
      </div>
      <i class="iconfont icon-xuanze" :class="{'icon-xuanzhong': payMethod === 'paypal'}"></i>
    </div>
    <!-- oceanMx_payment  v-if="payments.indexOf('ocean_mx') > -1" -->
    <div>
      <div class="payment_line clearfix paypal" id="ocean_mx" v-if="payments.indexOf('ocean_mx') > -1" @click="onChange('ocean_mx')">
        <div>
          <img :src="images.oceanMx" style="height: 34px;"/>
          <p>Credit Card</p>
        </div>
        <i class="iconfont icon-xuanze" :class="{'icon-xuanzhong': payMethod === 'ocean_mx'}"></i>
      </div>
      <div class="animation" :style="{height: payMethod === 'ocean_mx' ? '430px' : 0}">
        <form ref="opcseMxForm" id="opcseMxForm" >
          <template v-if="payMethod === 'ocean_mx'" v-for="(items, key) in oceanMxData">
            <normal-input v-if="!items.esInput" :key="items.title" :inputData="items" v-model="items.value"></normal-input>
            <select-comp v-else-if="key === 'paymentInstallment'" :key="items.title" :selectData="items" v-model="items.value"></select-comp>
            <div v-else :key="items.title">
              <div class="expiration" v-if="key === 'month'">
                <div style="display: flex; align-items: flex-end;">
                  <select-comp :selectData="items" v-model="items.value" ></select-comp>
                  <div style="margin-top: 45px; margin-left: 10px; font-size: 30px; font-weight: 100;">/</div>
                  <select-comp :selectData="oceanMxData.year" v-model="oceanMxData.year.value" :style="{marginTop: oceanMxData.year.warningShow ? '' : '43px'}"></select-comp>
                </div>
                <normal-input :inputData="oceanMxData.cvv" v-model="oceanMxData.cvv.value"></normal-input>
              </div>
            </div>
          </template>
          <input tag="payment[card_type]" type="hidden" id="card_type" value=""  name="payment[card_type]"  />
          <input tag="payment[card_luhn_pass]" type="hidden" id="card_luhn_pass" value=""  name="payment[card_luhn_pass]"  />
          <input tag="payment[card_date_pass]" type="hidden" id="card_date_pass" value=""  name="payment[card_date_pass]"  />
          <input tag="payment[card_secureCode_pass]" type="hidden" id="card_secureCode_pass" value=""  name="payment[card_secureCode_pass]"  />
        </form>
      </div>
    </div>
    <!-- boleto_payment -->
    <div v-if="payments.indexOf('boleto') > -1">
      <div class="payment_line clearfix" id="boleto" @click="onChange('boleto')">
        <div>
          <img :src="images.boleto" style="height: 30px;"/>
          <p>boleto</p>
        </div>
        <i class="iconfont icon-xuanze" :class="{'icon-xuanzhong': payMethod === 'boleto'}"></i>
      </div>
      <div class="animation" :style="{height: payMethod === 'boleto' ? '280px' : 0}">
        <normal-input v-for="items in boletoData" :key="items.title" :inputData="items" v-model="items.value"></normal-input>
      </div>
    </div>
    <!-- oceanBr_payment -->
    <div>
      <div class="payment_line clearfix paypal" id="ocean_br" v-if="payments.indexOf('ocean_br') > -1" @click="onChange('ocean_br')">
        <div>
          <img :src="images.oceanBr" style="height: 34px;"/>
          <p>Credit Card</p>
        </div>
        <i class="iconfont icon-xuanze" :class="{'icon-xuanzhong': payMethod === 'ocean_br'}"></i>
      </div>
      <div class="animation" :style="{height: payMethod === 'ocean_br' ? '500px' : 0}">
        <form ref="opcseBrForm" id="opcseBrForm" >
          <template v-for="(items, key) in oceanBrData">
            <normal-input v-if="!items.esInput" :key="key" :inputData="items" v-model="items.value"></normal-input>
            <select-comp v-else-if="key === 'paymentInstallment'" :key="items.title" :selectData="items" v-model="items.value"></select-comp>
            <div v-else :key="items.title">
              <div class="expiration" v-if="key === 'month'">
                <div style="display: flex; align-items: flex-end;">
                  <select-comp :selectData="items" v-model="items.value" ></select-comp>
                  <div style="margin-top: 45px; margin-left: 10px; font-size: 30px; font-weight: 100;">/</div>
                  <select-comp :selectData="oceanBrData.year" v-model="oceanBrData.year.value" :style="{marginTop: oceanBrData.year.warningShow ? '' : '43px'}"></select-comp>
                </div>
                <normal-input :inputData="oceanBrData.cvv" v-model="oceanBrData.cvv.value"></normal-input>
              </div>
            </div>
          </template>
          <input tag="payment[card_type]" type="hidden" id="card_type" value=""  name="payment[card_type]"  />
          <input tag="payment[card_luhn_pass]" type="hidden" id="card_luhn_pass" value=""  name="payment[card_luhn_pass]"  />
          <input tag="payment[card_date_pass]" type="hidden" id="card_date_pass" value=""  name="payment[card_date_pass]"  />
          <input tag="payment[card_secureCode_pass]" type="hidden" id="card_secureCode_pass" value=""  name="payment[card_secureCode_pass]"  />
        </form>
      </div>
    </div>
    <!-- cod -->
    <div class="cod payment_line clearfix" id="cod" @click="onChange('cod')" v-if="payments.indexOf('cod') > -1" style="justify-content: space-between;">
      <div style="width:70%;">
        <i class="iconfont icon-cash"/>
        <p>Cash on Delivery</p>
      </div>
      <span style="display: flex;align-items: center; color: #999999;">
        <span style="font-size: 14px; display: inline;" v-if="codReason.length > 0">(Not Available, <a @click="() => {this.$bus.$emit('call-cod-restriction')}">Why?</a>)</span>
        <i class="iconfont icon-xuanze" :class="{'icon-xuanzhong': payMethod === 'cod'}" v-if="codReason.length === 0"></i>
      </span>
    </div>
    <div class="cod-notice" v-if="payments.indexOf('cod') > -1">
      <p>Note:</p>
      <p>1.Estimated Delivery Date: {{codArrival}}.</p>
      <p>2.If the COD order is rejected upon delivery, the user may be blacklisted and lose COD options arcoss many e-commerces platgroms.</p>
      <p>3.You will be charged {{symbol}} {{codFee}} for COD. This will be included in your total order fee.</p>
      <p>4.You are expected to make payment before opening COD packages.</p>
      <p>5.COD may not be available for certain orders.&nbsp;&nbsp;&nbsp;(
        <a
          @click="() => {this.$bus.$emit('call-cod-restriction', true)}"
        >Details</a>
      )</p>
    </div>
    <cod-restriction :codReason="codReason" :codLimit="codLimit" :symbol="symbol"></cod-restriction>
  </div>
</template>

<script>
import utils from 'assets/js/utils'
import conf from 'assets/js/conf'

import payu from 'assets/image/payment/payu.jpg'
import visa from 'assets/image/payment/visa_logo.jpg'
import masterCard from 'assets/image/payment/mastercard_logo.jpg'
import maestro from 'assets/image/payment/maestro_logo.jpg'
import debitCard from 'assets/image/payment/debit_card.jpg'
import paytm from 'assets/image/payment/paytm_new.jpg'
import cashfree from 'assets/image/payment/cashfree.jpg'
import xendit from 'assets/image/payment/xendit.jpg'
import paypal from 'assets/image/payment/paypal-mark.jpg'
import oceanMx from 'assets/image/payment/ocean_mx.jpg'
import oceanBr from 'assets/image/payment/ocean_br.jpg'
import boleto from 'assets/image/payment/boleto.jpg'

import NormalInput from 'components/NormalInput'
import SelectComp from 'components/SelectComp'
import CodRestriction from 'components/payment/CodRestriction'

export default {
  components: {
    NormalInput,
    SelectComp,
    CodRestriction
  },
  props: {
    payments: {
      type: Array
    },
    quickpayIds: {
      type: Array
    },
    defaultPayment: {
      type: String
    },
    orderId: {
      type: String
    },
    rate: {
      type: Array
    },
    balanceCover: {
      type: Boolean
    },
    codReason: {
      type: Array
    },
    codFee: {
      type: Number
    },
    codArrival: {
      type: String
    },
    codLimit: {
      type: Array
    },
    symbol: {
      type: String
    }
  },
  created () {
    let month = []
    let year = []
    for (let i = 1; i <= 12; i++) {
      month.push({
        label: i < 10 ? `0${i}` : i,
        value: i < 10 ? `0${i}` : i
      })
    }
    let nowY = new Date().getFullYear()
    for (let j = nowY; j <= nowY + 20; j++) {
      year.push({
        label: j,
        value: j
      })
    }
    this.oceanBrData.month.option = month
    this.oceanBrData.year.option = year
    this.oceanMxData.month.option = month
    this.oceanMxData.year.option = year
    this.$bus.$on('payment-data-error', (data) => {
      console.log('err', data)
      if (data.method === 'ocean_br') {
        this.oceanBrData = data.data
      } else if (data.method === 'ocean_mx') {
        this.oceanMxData = data.data
      }
    })
    console.log('oceanMxData', this.oceanMxData)
  },
  mounted () {
  },
  data () {
    return {
      quickpayId: '',
      payMethod: 'payu',
      images: {
        payu,
        visa,
        masterCard,
        maestro,
        debitCard,
        paytm,
        cashfree,
        xendit,
        paypal,
        oceanMx,
        oceanBr,
        boleto
      },
      boletoData: [{
        title: 'Name',
        value: ''
      }, {
        title: 'Email',
        value: ''
      }, {
        title: 'CPF',
        value: ''
      }],
      oceanBrData: {
        cardNumber: {
          title: 'Card Number (no dashes no spaces)',
          value: '',
          name: 'card_number',
          maxLength: 19,
          warningShow: false,
          warning: ''
        },
        month: {
          title: 'Expiration Date',
          value: '',
          esInput: true,
          width: '140px',
          placeholder: 'Month',
          name: 'card_month',
          maxLength: 2
        },
        year: {
          title: ' ',
          value: '',
          esInput: true,
          width: '140px',
          placeholder: 'Year',
          name: 'card_year',
          maxLength: 4,
          warningShow: false,
          warning: ''
        },
        cvv: {
          title: 'CVV',
          value: '',
          esInput: true,
          width: '140px',
          suffix: true,
          name: 'card_secureCode',
          maxLength: 4,
          warningShow: false,
          warning: ''
        },
        cpf: {
          title: 'CPF',
          value: '',
          warningShow: false,
          warning: ''
        },
        paymentInstallment: {
          title: 'Payment Installment',
          value: '',
          esInput: true,
          width: '50%',
          option: [],
          name: 'ocean_pay_installments'
        },
        name: {
          title: 'Name on Card',
          subTitle: '(Optional)',
          value: '',
          width: '50%'
        },
        cnpj: {
          title: 'CNPJ',
          subTitle: '(Optional)',
          value: '',
          width: '50%',
          warningShow: false,
          warning: ''
        }
      },
      oceanMxData: {
        cardNumber: {
          title: 'Card Number (no dashes no spaces)',
          value: '',
          name: 'card_number',
          maxLength: 19,
          warningShow: false,
          warning: ''
        },
        month: {
          title: 'Expiration Date',
          value: '',
          esInput: true,
          width: '140px',
          placeholder: 'Month',
          name: 'card_month',
          maxLength: 2
        },
        year: {
          title: ' ',
          value: '',
          esInput: true,
          width: '140px',
          placeholder: 'Year',
          name: 'card_year',
          maxLength: 4,
          warningShow: false,
          warning: ''
        },
        cvv: {
          title: 'CVV',
          value: '',
          esInput: true,
          width: '140px',
          suffix: true,
          name: 'card_secureCode',
          maxLength: 4,
          warningShow: false,
          warning: ''
        },
        paymentInstallment: {
          title: 'Payment Installment',
          value: '',
          esInput: true,
          width: '50%',
          option: [],
          name: 'ocean_pay_installments'
        },
        name: {
          title: 'Name on Card',
          subTitle: '(Optional)',
          value: '',
          width: '50%'
        }
      },
      showNewCardMask: false,
      showNewCardModal: false
    }
  },
  methods: {
    onChange (method) {
      if (this.balanceCover) {
        return
      }
      if (method === 'cod' && this.codReason.length > 0) {
        return
      }
      this.payMethod = method
      this.$emit('onChange', method)
    },
    onOceanQchecked (id) {
      this.onChange('ocean_q')
      this.quickpayId = id
    },
    addQuickPay () {
      if (this.quickpayIds.length >= 10) {
        this.$message({
          message: `Only 10 credit cards can be added at most. If you want to add, please delete the original credit card in User Center first`,
          type: 'warning'
        })
        return
      }
      this.showModal(true)
      this.$api.quickpayCreate(this.orderId, {
        result_url: `${window.location.origin}${conf.views.addQuickcardSuccess}`
      })
      let that = this
      this.$nextTick(() => {
        document.getElementById('quickpay_frame').onload = function () {
          try {
            let param = utils.parseQueryString(this.contentWindow.window.location.search)
            that.$emit('addQpay', JSON.parse(param.quickpayInfo))
            that.showModal(false)
          } catch (error) {
            console.log('error', error)
          }
        }
      })
    },
    showModal (showOrHide) {
      if (showOrHide) {
        this.showNewCardMask = true
        this.showNewCardModal = true
      } else {
        this.showNewCardModal = false
        setTimeout(() => {
          this.showNewCardMask = false
        }, 300)
      }
    }
  },
  watch: {
    defaultPayment (newVal) {
      this.payMethod = newVal
    },
    payMethod (newVal) {
      this.$nextTick(() => {
        if (newVal === 'ocean_mx' || newVal === 'ocean_br') {
          let inputs = newVal === 'ocean_mx' ? this.$refs.opcseMxForm.getElementsByTagName('input') : this.$refs.opcseBrForm.getElementsByTagName('input')
          for (let i = 0; i <= inputs.length; i++) {
            if (inputs[i]) {
              if (!inputs[i].hasAttribute('tag')) {
                inputs[i].setAttribute('tag', inputs[i].name)
              }
              switch (inputs[i].name) {
                case 'card_number': case 'card_month': case 'card_year': case 'card_secureCode': case 'ocean_pay_installments':
                  inputs[i].setAttribute('opcse-name', inputs[i].name)
                  break
              }
            }
          }
        }
      })
    },
    rate (newVal) {
      this.oceanBrData.paymentInstallment.option = newVal
      this.oceanMxData.paymentInstallment.option = newVal
    },
    quickpayIds (newVal) {
      if (newVal.length && this.payMethod === 'ocean_q') {
        this.quickpayId = newVal[0].quickpay_id
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .hide {
    display: none;
  }
  .payment {
    position: relative;
    &.gray {
      filter: grayscale(1);
    }
    .payment_title {
      color: #666;
      background: #fbfbfb;
      font-size: 18px;
      padding: 10px 15px;
      border-top: solid 1px #e5e5e5;
    }
    .card_list {
      padding: 10px 15px;
      display: flex;
      align-items: center;
      border-top: 1px solid #f2f2f2;
      div {
        width: 100%;
        display: flex;
        align-items: center;
        span {
          margin-left: 20px;
        }
      }
      i {
        color: #ccc;
        font-size: 30px;
        &.icon-xuanzhong {
          color: $flamingo;
        }
      }
      &:last-child {
        border: none;
      }
    }
    .new_card_mask {
      background: rgba(102, 102, 102, 0.5);
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      z-index: 9999;
      .new_card_modal {
        position: fixed;
        text-align: center;
        left: 50%;
        margin-left: -275px;
        margin-top: 270px;
        max-width: 700px;
        font-size: 20px;
        background: #fff;
        -webkit-box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.5);
        box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.5);
        i {
          position: absolute;
          right: 10px;
          top: 10px;
          font-size: 20px;
        }
      }
    }
    .payment_line {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0 13px;
      height: 60px;
      border-top: 1px solid #f2f2f2;
      color: #333;
      background-color: #fff;
      position: relative;
      .center {
        display: flex;
        align-items: center;
        span {
          color: #666;
          font-size: 18px;
          margin: 0 10px;
        }
        i {
          color: #666;
          font-size: 35px;
        }
      }
      .iconfont {
        color: #ccc;
        clear: both;
        &.icon-cash {
          color: #FBD60D;
          font-size: 35px;
        }
      }
      div:first-child {
        width: 100%;
      }
      p {
        margin: 0;
        font-size: 14px;
        color: #707070
      }
      i {
        font-size: 30px;
        &.icon-xuanzhong {
          color: $flamingo;
        }
      }
    }

    .cod-notice {
      margin: 0 13px;
      padding: 10px;
      font-size: 12px;
      color: #999;
      background: #F9F9F9;
      line-height: 18px;
    }

    a {
      font-size: 14px;
      color: $havelock-blue;
      cursor: pointer;
    }

    .normal-input {
      margin-left: 10px;
      margin-top: 10px;
    }

    .expiration {
      display: flex;
      justify-content: space-between;
    }

    .select {
      margin-left: 10px;
      margin-top: 10px;
    }

    .paypal {
      img {
        height: 30px;
        position: relative;
        bottom: 3px;
      }
    }

    .payu {
      img {
        height: 34px;
        position: relative;
        bottom: 3px;
      }
    }

    .cashfree {
      img {
        height: 30px;
        position: relative;
        bottom: 3px;
      }
    }

    .credit_card {
      img {
        width: 45px;
        position: relative;
        bottom: 2px;
      }
    }

    .quickPay {
      img {
        width: 200px;
        position: relative;
        bottom: 2px;
      }
    }

    .ocean_my {
      img {
        width: auto;
        height: 38px;
      }
    }

    .boleto {
      img {
        width: auto;
        height: 38px;
      }
    }
  }
  .animation {
    transition: all .3s;
    height: 0;
    overflow: hidden;
  }
  .fade-enter-active {
    transition: all .5s;
  }
  .fade-leave-active {
    transition: all .3s ease-out;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(-20px);
  }
</style>
