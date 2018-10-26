<template>
  <div>
    <el-dialog :visible.sync="visible" :modal='false' :center='true' width='650px' :show-close='false'>
      <i class="el-icon-close" @click="clear"></i>
      <div class="title" slot="title">
        Find My Order
      </div>
      <div class="input__wrap">
        <span class="input-title">Order Number</span>
        <div class="input">
          <input class="orderNumber" type="text" placeholder="SOXXXXX" v-model.trim="orderId">
        </div>
        <span class="input-tip">Find your order number in the confirmation email</span>
      </div>
      <div class="input__wrap distance">
        <span class="input-title">Phone Number</span>
        <div class="input prefix">
          <div class="input-prefix" @click="prefixClick">
            <div>
              <span>{{country.code.toUpperCase()}}</span>
              <i class="iconfont icon-xiala"></i>
            </div>
            <span>+{{country.phonePrefix}}</span>
          </div>
          <el-select v-model.trim="value" placeholder="请选择" name="clubSelect">
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
          <input type="number" placeholder="The one in your address" v-model.trim="phone">
        </div>
        <p style="margin:20px 0;color:black;font-size:16px">Verify Code</p>
        <div class="input suffix">
          <input type="number" placeholder="Verification code" v-model.trim="cod">
          <button class="btn" :disabled="wait > 0 || isTesting" @click="sendSms">{{wait > 0 ? wait :isTesting?'Sending': send_text}}</button>
        </div>
      </div>
      <div class="downloadApp">
        Please <a href="https://www.clubfactory.com/download_app/" target="_Blank">download our app</a> for easy return. (Account > Find My order > Apply for Return)
      </div>
      <button class="btn find" @click="searchOrder">Find My Order</button>
      <div class="warning">
        <p class="title">Beware of Scams:</p>
        <p>Don't disclose your OTP to other people. Club Factory will not ask for your OTP in any way.</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ClubInput from 'components/common/ClubInput'
import {countries} from 'assets/js/country'
import utils from 'assets/js/utils'
import conf from 'assets/js/conf'
import googleAnalytics from 'assets/js/google_analytics'

export default {
  components: {
    ClubInput
  },
  data () {
    return {
      visible: false,
      options: [],
      value: utils.getUserCountry(),
      orderId: '',
      phone: '',
      cod: '',
      wait: 0,
      isTesting: false,
      send_text: 'Send'
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
    var parse = utils.parseQueryString()
    if (parse.showType === 'searchGuestOrder') {
      this.visible = true
    }
    this.$bus.$on('call-search-guest-order', () => {
      this.visible = true
    })
  },
  methods: {
    prefixClick () {
      document.getElementsByName('clubSelect')[0].click()
    },
    async sendSms () {
      let result = this.verExpectCOD()
      if (!result) {
        return
      }
      let currentPhone = this.phone
      this.isTesting = true
      this.send_text = 'Resend'
      let response = await this.$api.sendVC({
        order_name: this.orderId.toUpperCase(),
        phone: this.phone,
        country_code: this.value
      })
      this.isTesting = false
      if (response.success === true) {
        this.$message({
          message: `We have sent a verification code to ${currentPhone} . This code will expire in 10 minutes`,
          type: 'success'
        })
        this.wait = response.wait
        this.interval = window.setInterval(() => {
          this.wait = this.wait - 1
          if (this.wait === 0) {
            window.clearInterval(this.interval)
          }
        }, 1000)
      } else {
        this.$message({
          message: response.message,
          type: 'error'
        })
      }
    },
    async searchOrder () {
      let result = this.verification()
      if (!result) {
        return
      }
      googleAnalytics.clickFindMyOrder()
      const {
        success,
        token,
        message
      } = await this.$api.verifyCOD({
        verification: this.cod,
        phone: this.phone,
        country_code: this.value,
        order_name: this.orderId.toUpperCase()
      })
      if (success) {
        window.location.href = `${conf.views.orderDetail}?orderId=${this.orderId}&token=${token}`
      } else {
        this.$message({
          message: message,
          type: 'error'
        })
      }
    },
    verification () {
      let result = this.verExpectCOD()
      if (result && this.cod.length !== 6) {
        this.$message({
          message: `Please enter a vaild verificaiton code`,
          type: 'error'
        })
        return false
      }
      return result && true
    },
    verExpectCOD () {
      let orderTest = /^SO[0-9]+$/i
      if (!orderTest.test(this.orderId)) {
        this.$message({
          message: `Please enter a vaild order number`,
          type: 'error'
        })
        return false
      }
      if (this.phone.length === 0) {
        this.$message({
          message: `Please enter a vaild phone number`,
          type: 'error'
        })
        return false
      }
      return true
    },
    clear () {
      this.visible = false
      this.options = []
      this.orderId = ''
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
    visible (nVisible) {
      if (!nVisible) {
        let query = utils.parseQueryString()
        if (query.showType) {
          delete query.showType
          window.location.replace(window.location.origin + window.location.pathname + utils.encodeQueryString(query))
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
body /deep/{
  .el-scrollbar {
    width: 450px;
  }
}
.el-dialog__wrapper /deep/ {
  .el-dialog__body {
    padding: 30px 150px;
  }
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
.find {
  display: block;
  margin: 0 auto;
  margin-top: 40px;
  border-radius: 5px;
  height: 40px;
  width: 100%;
}
.warning {
  color: red;
  margin-top: 20px;
  font-size: 12px;
  .title {
    font-weight: 600;
    font-size: 12px;
    margin-bottom: 10px;
  }
}
.input__wrap {
  &.distance {
    margin-top: 40px;
  }
  .input-title {
    color: #000;
    font-size: 16px;
  }
  .input {
    border: 1px solid #E6E6E6;
    padding-left: 15px;
    box-sizing: border-box;
    margin: 5px 0;
    &.suffix {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
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
}
.downloadApp{
  color: #999999;
  font-size: 13px;
  margin-top: 20px;
  > a{
    color: #4A90E2;
    border-bottom: 1px solid #4A90E2;
  }
}
.orderNumber{
  text-transform: uppercase;
}
</style>
