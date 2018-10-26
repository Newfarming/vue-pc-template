<template>
  <div>
    <drop-down :title="account.title" :command="account.command" :is-show-arrow="account.isLogin"
               :drop-down-items="account.dropDownItems" class="account" @dropdown-item-click="dropdownItemClick"
               v-if="account.isLogin"></drop-down>
    <a href="javascript:" v-else class="account-title" @click="visiable=true">{{account.title}}</a>
    <el-dialog :visible.sync="canClose" :modal='false' :center='true' width='450px' :show-close='false'>
      <i class="el-icon-close" @click="visiable=false"></i>
      <div class="title" slot="title">
        <span v-if="login_type == 'access'">
          Login to enjoy your shopping
        </span>
        <div class="title-container" v-else>
          <div class="title-item" :class="{active: (login_type == 'sign')}" @click="changeType('sign')">Sign up</div>
          <div class="title-item" :class="{active: (login_type == 'login') || (login_type == 'forget')}"
               @click="changeType('login')">Log in
          </div>
        </div>
      </div>
      <div v-if="login_type == 'access'">
        <BtnComp type='facebook' v-on:clicked="FBLogin"></BtnComp>
        <div class="or">
          <div class="or_text">or</div>
        </div>
        <BtnComp data='login' text='Log in with Email' v-on:clicked="changeType"></BtnComp>
        <BtnComp data='sign' type='blank' text='Sign up with Email' v-on:clicked="changeType"></BtnComp>
      </div>
      <div v-else-if="login_type == 'login'">
        <BtnComp type='facebook' v-on:clicked="FBLogin"></BtnComp>
        <div class="or">
          <div class="or_text">or</div>
        </div>
        <normal-input v-model="e_or_m" :inputData="EorMData"></normal-input>
        <normal-input v-model="pw" :inputData="pwData"></normal-input>
        <div class="extra">
          <div class="forget" @click="changeType('forget')">Forget Password?</div>
        </div>
        <BtnComp :text="$t('topbar.account.login')" v-on:clicked="logIn"></BtnComp>
      </div>
      <div v-else-if="login_type == 'sign'">
        <BtnComp type='facebook' v-on:clicked="FBLogin"></BtnComp>
        <div class="or">
          <div class="or_text">or</div>
        </div>
        <normal-input v-model="e_or_m" :inputData="EorMData"></normal-input>
        <normal-input v-model="pw" :inputData="pwData"></normal-input>
        <div class="extra">
          <check-comp :checked="checked" @change="val => { checked = val }"
                      label="Subscribe to our newsletter to get lastest deal"></check-comp>
        </div>
        <BtnComp text='Sign up' v-on:clicked="signUp"></BtnComp>
        <p class="terms">By clicking Sign Up, you agree to <a target="_blank" :href="`${documentView}?type=termsconditions`">our Terms></a></p>
      </div>
      <div v-else-if="login_type == 'forget'">
        <div v-if="forget_type == 'forget'">
          <div class="forget-tip">Please enter your registration Email.</div>
          <normal-input v-model="e_or_m" :inputData="EorMData"></normal-input>
          <BtnComp :disabled="e_or_m.length===0" text='Confirm' v-on:clicked="forget"></BtnComp>
        </div>
        <div v-else-if="forget_type == 'sended'">
          <div class="forget-send">
            We sent an email to <br>
            {{ hideEmail(e_or_m) }} Click the link in the email to reset your password. <br> <br>
            Did not receive mail? <span @click="forget">Resend</span>
          </div>
        </div>
        <div v-else-if="forget_type == 'reset'">
          <div class="forget-tip">Please create a <span style="color: #151515">NEW LOGIN PASSWORD.</span></div>
          <normal-input v-model="pw" :inputData="pwData"></normal-input>
          <BtnComp :disabled="pw.length===0" text='Confirm' v-on:clicked="forget"></BtnComp>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import utils from 'assets/js/utils'
import config from 'assets/js/conf'
import reg from 'assets/js/reg'

import DropDown from 'components/DropDown'
import BtnComp from 'components/BtnComp'
import NormalInput from 'components/NormalInput'
import CheckComp from 'components/CheckComp'
import googleAnalytics from 'assets/js/google_analytics'

export default {
  components: {
    DropDown,
    BtnComp,
    NormalInput,
    CheckComp
  },
  created () {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '154486991584752',
        cookie: true,
        xfbml: true,
        version: 'v2.8'
      })
      // window.FB.AppEvents.logPageView()
    };

    (function (d, s, id) {
      var js = d.getElementsByTagName(s)[0]
      var fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        return
      }
      js = d.createElement(s); js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    }(document, 'script', 'facebook-jssdk'))
    this.init()
  },
  data () {
    return {
      documentView: config.views.document,
      visiable: false,
      checked: true,
      login_type: 'access',
      forget_type: 'forget',
      e_or_m: '',
      EorMData: {
        warningShow: false,
        warning: '',
        placeholder: 'Email',
        name: 'email'
      },
      pw: '',
      pwData: {
        warningShow: false,
        warning: '',
        placeholder: 'Password',
        type: 'password',
        name: 'password'
      },
      account: {
        isLogin: false,
        title: '',
        account: '',
        dropDownItems: [
          {
            id: 0,
            title: 'Track Orders',
            command: 'track-orders'
          }, {
            id: 1,
            title: 'Coupon',
            command: 'coupon'
          }, {
            id: 2,
            title: 'Payment Method',
            command: 'payment-method'
          }, {
            id: 3,
            title: 'Sign Out',
            command: 'sign-out'
          }
        ]
      }
    }
  },
  computed: {
    canClose: {
      get: function () {
        return window.location.pathname === config.views.reset ? true : this.visiable
      },
      set: function (value) {
        value = window.location.pathname === config.views.reset ? true : this.visiable
      }
    }
  },
  methods: {
    init () {
      var tokenInfo = utils.getDecodeToken()
      console.log('tokenInfo', tokenInfo)
      this.account.isLogin = !!tokenInfo
      this.account.title = this.account.isLogin ? `Hi, ${tokenInfo.account}` : 'Log in / Sign up'
      this.account.account = this.account.isLogin ? tokenInfo.account : ''
      var parse = utils.parseQueryString()
      if (parse.token && parse.name) {
        this.visiable = true
        this.login_type = 'forget'
        this.forget_type = 'reset'
        this.forget_token = parse.token
        this.pwData.placeholder = 'New Password'
      } else if (parse.showType === 'login') {
        this.visiable = true
      }
      this.$bus.$on('call-login', () => {
        this.visiable = true
      })
    },
    FBLogin () {
      window.FB.login(async (response) => {
        if (response.status === 'connected') {
          const data = await this.$api.fbLogin(response)
          this.loginSuccess(data, 'fb')
        } else {
          this.$message.error('Something went wrong! Please try again.')
        }
      }, {
        scope: 'email, public_profile',
        return_scopes: true
      })
    },
    changeType (type) {
      this.login_type = type
      this.e_or_m = ''
      this.pw = ''
      this.resetErr()
    },
    async signUp () {
      if (this.verifyParam()) {
        return
      }
      const data = await this.$api.signUp(this.e_or_m, this.pw, this.checked)
      this.loginSuccess(data, 'sign')
    },
    async logIn () {
      this.resetErr()
      if (this.verifyParam()) {
        return
      }
      const data = await this.$api.login(this.e_or_m, this.pw)
      console.log('data', data)
      this.loginSuccess(data)
    },
    async forget () {
      if (this.forget_type === 'forget' || this.forget_type === 'sended') {
        console.log('ver', this.verifyEmail())
        if (this.verifyEmail()) {
          return
        }
        const result = await this.$api.forget(this.e_or_m)
        if (result && this.forget_type === 'forget') {
          this.forget_type = 'sended'
        } else if (result) {
          this.$message({
            message: `Resend Success!!!`,
            type: 'success'
          })
        }
      } else {
        if (this.verifyPw()) {
          return
        }
        const result = await this.$api.forget(null, this.pw, this.forget_token)
        if (result.user_profile) {
          var parse = utils.parseQueryString()
          console.log('redirect', parse.redirect)
          window.location.replace(parse.redirect)
        }
      }
    },
    dropdownItemClick (command) {
      switch (command) {
        case 'track-orders':
          window.location.href = config.views.user + utils.encodeQueryString({type: 'order'})
          break
        case 'coupon':
          window.location.href = config.views.user + utils.encodeQueryString({type: 'coupon'})
          break
        case 'payment-method':
          window.location.href = config.views.user + utils.encodeQueryString({type: 'paymentMethod'})
          break
        case 'sign-out':
          this.$api.logout()
          break
      }
    },
    verifyParam () {
      this.resetErr()
      var hasErr = false
      if (this.verifyEmail()) {
        hasErr = true
      }
      if (this.verifyPw()) {
        hasErr = true
      }
      return hasErr
    },
    verifyEmail () {
      const emailPtn = reg.getEmailReg()
      console.log('e_or_m', this.e_or_m)
      if (!emailPtn.test(this.e_or_m)) {
        this.EorMData.warning = 'Invalid email address, please try again.'
        this.EorMData.warningShow = true
        return true
      }
      return false
    },
    verifyPw () {
      if (this.pw.length < 6) {
        this.pwData.warning = 'This password is too short. Try another.'
        this.pwData.warningShow = true
        return true
      }
      return false
    },
    resetErr () {
      this.EorMData = {
        warningShow: false,
        warning: '',
        placeholder: 'Email',
        name: 'email'
      }
      this.pwData = {
        warningShow: false,
        warning: '',
        placeholder: 'Password',
        type: 'password',
        name: 'password'
      }
    },
    hideEmail (email) {
      var newEmail = email
      if (email.indexOf('@') > 0) {
        var str = email.split('@')
        var _s = ''
        for (var i = 0; i < str[0].length - 2; i++) {
          _s += '*'
        }
        newEmail = str[0].substr(0, 1) + _s + str[0].substr(str[0].length - 1, 1) + '@' + str[1]
      }
      return newEmail
    },
    loginSuccess (data, type) {
      if (data && data.user_profile) {
        this.visiable = false
        this.init()
        this.$bus.$emit('login-success')
        if (type === 'fb') {
          googleAnalytics.login('facebook', 'Success')
        } else if (type === 'sign') {
          googleAnalytics.sign('username', 'Success')
        } else {
          googleAnalytics.login('username', 'Success')
        }
        this.$message({
          message: `Welcome, dear ${this.account.account}`,
          type: 'success'
        })
      } else {
        this.$message({
          message: `${data.message}`,
          type: 'error'
        })
      }
    }
  },
  watch: {
    visiable (nVisible) {
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
  .account-title {
    min-width: 120px;
    margin-left: 30px;
  }

  .account /deep/ {
    min-width: 220px;
    text-align: right;
    .el-dropdown {
      color: $mine-shaft;
      font-size: $large;
    }
  }
  .el-dialog__wrapper /deep/ {
    z-index: 1999 !important;
    background: rgba(102, 102, 102, 0.5);
    .el-dialog--center {
      .el-dialog__header {
        padding: 20px 15px 10px;
      }
    }
    .title {
      color: $flamingo;
      font-size: $large;
      font-weight: 400;
      margin: -20px -15px 0 -15px;
      height: 56px;
      line-height: 56px;
      .title-container{
        display: flex;
        .title-item {
          text-align: center;
          width: 50%;
          background: $wild-sand;
          color: $mine-shaft;
          flex: 1;
        }
        .active {
          background: $white;
          color: $flamingo;
          font-size: $xx-large;
        }
      }
    }
    .el-icon-close {
      position: absolute;
      font-size: $size36;
      top: 0;
      right: -40px;
      color: $white;
    }
  }
  .or {
    margin-top: 30px;
    width: 100%;
    background-color: $mecury;
    height: 1px;
    position: relative;
    .or_text {
      position: absolute;
      left: 50%;
      transform: translate3d(-25px, -13px, 0 );
      width: 50px;
      background: $white;
      color: $dusty-gray;
      font-size: 16px;
      font-weight: 100;
      text-align: center;
    }
  }
  .forget-tip {
    color: $dusty-gray;
    font-size: $medium;
  }
  .forget-send {
    color: $dusty-gray;
    font-size: $medium;
    span {
      color: $havelock-blue;
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .extra {
    padding: 10px 0 20px 0;
    div {
      float: left;
    }
    .forget {
      float: right;
      color: $havelock-blue;
      font-size: $x-small;
      padding: 10px 0;
      cursor: pointer;
    }
  }
  .terms {
    margin-top: 20px;
    text-align: center;
    color: #999999;
    a {
      color: #4A90E2;
      text-decoration: underline;
      cursor: pointer;
    }
  }
</style>
