<template>
  <div>
    <el-dialog :visible.sync="visible" :modal='false' :center='true' width='600px' :show-close='false'>
      <i class="el-icon-close" @click="visible=false"></i>
      <div class="title" slot="title">
        Order Comfirmation
      </div>
      <span class="input-title">Mobile Phone</span>
      <div class="input prefix">
        <div class="input-prefix" @click="prefixClick">
          <div>
            <span>{{country.code.toUpperCase()}}</span>
            <i class="iconfont icon-xiala"></i>
          </div>
          <span>+{{country.phonePrefix}}</span>
        </div>
        <el-select v-model.trim="value" placeholder="" name="clubCodSelect">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            <div style="width: 305px;">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right;">{{ item.phonePrefix }}</span>
            </div>
          </el-option>
        </el-select>
        <input type="text" placeholder="" v-model.trim="phone">
      </div>
      <span class="input-title" style="margin-top: 30px; display: block;">Verify Code</span>
      <div class="suffix">
        <div class="input">
          <input type="text" placeholder="" v-model.trim="cod">
        </div>
        <button class="btn" :disabled="wait > 0 || phone.length !== country.phoneLength" @click="sendSms">{{wait > 0 ? `Resend(${wait})` : 'Request'}}</button>
      </div>
      <p>You are selected as one of the first customers to use our COD service.</p>
      <p>Please note:</p>
      <p>1.Estimated Delivery <strong> Date: {{codArrival}} </strong></p>
      <p>2.If COD order is rejected upon delivery, the user may be blacklisted and lose COD options across many e-commerve platforms.</p>
      <p>3.You will be charged {{symbol}} {{codFee}} for COD. This will be included in your total order fee.</p>
      <p>4.You are expected to make payment before opening COD pckages.</p>
      <p>5.COD may not be available for certain orders.</p>
      <check-comp :checked="checked" @change="(check) => {checked = check}"></check-comp>
      <span>By comfirm this order, you agree to the Terms Of Use and Privacy Policy of Club.</span>
      <button class="btn confirm" @click="searchOrder" :disabled="!checked">Confirm</button>
    </el-dialog>
  </div>
</template>

<script>
import CheckComp from 'components/CheckComp'
import {countries} from 'assets/js/country'
import utils from 'assets/js/utils'
import conf from 'assets/js/conf'
export default {
  props: [
    'orderId', 'codFee', 'codArrival', 'defaultPhone', 'symbol'
  ],
  components: {
    CheckComp
  },
  data () {
    return {
      visible: false,
      options: [],
      value: utils.getUserCountry(),
      phone: '',
      cod: '',
      wait: 0,
      checked: true,
      loading: false
    }
  },
  created () {
    this.options = countries.map(item => {
      return {
        value: item.code,
        label: item.id,
        name: item.name,
        phonePrefix: item.phonePrefix
      }
    })
    this.$bus.$on('call-cod-order-confirm', () => {
      this.visible = true
    })
  },
  methods: {
    prefixClick () {
      document.getElementsByName('clubCodSelect')[0].click()
    },
    async sendSms () {
      let result = this.verExpectCOD()
      if (!result || this.loading) {
        return
      }
      this.loading = true
      const {wait} = await this.$api.codSms({
        order_name: this.orderId,
        phone: this.phone,
        country_code: this.value
      })
      this.$message({
        message: `Send Success!!!`,
        type: 'success'
      })
      this.wait = wait
      this.loading = false
      this.interval = window.setInterval(() => {
        this.wait = this.wait - 1
        if (this.wait === 0) {
          window.clearInterval(this.interval)
        }
      }, 1000)
    },
    async searchOrder () {
      let result = this.verification()
      if (!result) {
        return
      }
      const {success} = await this.$api.startCodPayment(this.orderId, {
        order_name: this.orderId,
        sms_code: this.cod,
        phone: this.phone,
        country_code: this.value,
        channel: 'cod',
        pay_failed_url: `${window.location.origin}${conf.views.paymentPay}`,
        pay_success_url: `${window.location.origin}${conf.views.paymentSuccess}`,
        payment_url: `${window.location.origin}${conf.views.paymentAddress}`
      })
      if (success) {
        window.location.replace(`${window.location.origin}${conf.views.paymentSuccess}?orderId=${this.orderId}&type=cod`)
      } else {
        this.visible = false
        this.$message.error({
          duration: 0,
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: `<p style="font-size: 20px; text-align: center;">Sorry!</p>
                    <p style="text-align: center; padding: 10px 30px; line-height: 20px;"> Your order is no longer eligible for Cash On Delivery,please change your payment method.</p>
                  `
        })
      }
    },
    verification () {
      let result = this.verExpectCOD()
      if (result && this.cod.length !== 6) {
        this.$message({
          message: `Please enter a correct verify code！`,
          type: 'error'
        })
        return false
      }
      return result && true
    },
    verExpectCOD () {
      if (this.phone.length !== this.country.phoneLength) {
        this.$message({
          message: `Please enter a correct phone number！`,
          type: 'error'
        })
        return false
      }
      return true
    },
    clear () {
      this.visible = false
      this.options = []
      this.phone = ''
      this.cod = ''
      this.wait = 0
      window.clearInterval(this.interval)
    }
  },
  computed: {
    country () {
      return countries.find(item => {
        return item.code === this.value
      })
    }
  },
  watch: {
    defaultPhone (val) {
      this.phone = val
    }
  }
}
</script>

<style lang="scss" scoped>
body /deep/{
  .el-scrollbar {
    width: 350px;
  }
}
.el-dialog__wrapper /deep/ {
  .el-dialog__body {
    padding: 30px 100px;
  }
}
p {
  color: #B5B5B5;
  font-size: 12px;
  line-height: 18px;
  font-family: PingFangSC-Regular;
}
.checkbox {
  display: inline-block;
}
.title {
  font-size: 24px;
}
.el-icon-close {
  position: absolute;
  font-size: $size36;
  top: 15px;
  right: 15px;
  color: #A5A5A5;
}
.confirm {
  display: block;
  margin: 0 auto;
  margin-top: 40px;
  border-radius: 5px;
  height: 50px;
}
.input-title {
  color: #333;
  font-size: 18px;
  font-family: PingFangSC-Regular;
}
.suffix {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  .btn {
    height: 42px;
    margin-top: 0;
    width: 35%;
    border-radius: 5px;
    background: #FDEDEB;
    color: $flamingo;
    &:disabled {
      background: #F2F2F2;
      color: #999999;
      border-color: #F2F2F2;
    }
  }
  .input {
    margin: 0;
    width: 50%;
  }
}
.input {
  border: 1px solid #E6E6E6;
  border-radius: 5px;
  padding-left: 15px;
  box-sizing: border-box;
  margin: 5px 0;
  &.prefix {
    display: flex;
    justify-content: space-between;
    position: relative;
    .el-select /deep/ {
      width: 0px;
      position: absolute;
      bottom: 10px;
      visibility: hidden;
      .el-input__inner {
        border: none;
        border-right: solid 1px $flamingo;
        border-radius: 0;
        padding: 0;
        color: $flamingo;
        height: 20px;
        width: 65px;
      }
      .el-select__caret {
        color: $flamingo;
      }
    }
  }
  .input-prefix {
    display: flex;
    align-items: center;
    width: 130px;
    color: $flamingo;
    cursor: pointer;
    div {
      border-right: solid 1px $flamingo;
      padding-right: 10px;
      margin-right: 10px;
      i {
        font-size: 12px;
        font-weight: 600;
      }
    }
  }
  input {
    background-color: #fff;
    background-image: none;
    border: none;
    color: #333;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: none;
    width: 100%;
  }
  button {
    height: 40px;
    width: 40%;
    margin: 0;
  }
}
.input-tip {
  color: #7C7C7C;
  font-size: 13px;
}
</style>
