import Vue from 'vue'

import {
  Loading,
  Message,
  MessageBox,
  Input,
  Menu,
  Submenu,
  MenuItem,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Dialog,
  Popover,
  Tooltip,
  Select,
  Option
} from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import 'assets/css/element_variables.scss'
import api from 'assets/js/api'
import bus from 'assets/js/bus'
import googleAnalytics from 'assets/js/google_analytics'
import facebookPixel from 'assets/js/facebook_pixel'
import store from '@/store'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import utils from './utils'
import { countryCodeMap } from './country'
import i18n from '../i18n'
import numeral from 'numeral'

async function getCountryCode () {
  let countryCode = utils.getUserCountry()
  if (!countryCode) {
    let ipInfo = await this.$api.getIpCountryInfo()
    countryCode = ipInfo.countryCode.toLowerCase()
  }
  let param = utils.parseQueryString()
  if (param.country && !utils.getItem('country_code')) {
    countryCode = param.country
  }
  // 如果国家不存在就设置为美国
  let countryInfo = countryCodeMap[countryCode]
  if (!countryInfo) {
    countryCode = 'us'
  }
  return countryCode
}

export default {
  /**
   *
   * @param {*} App
   * @param {*} useUI
   * @param {*} protoUI
   */
  async initVue (App, useUI = null, protoUI = null) {
    const auth = '68b30d6344b749e5a7229092df79a0f0'
    const { RELEASE_VERSION, NODE_ENV } = process.env
    const debug = NODE_ENV === 'development'
    Raven.config(`https://${auth}@raven.clubfactory.com/3`, {
      release: RELEASE_VERSION,
      environment: NODE_ENV,
      debug
    }).addPlugin(RavenVue, Vue).install()
    var tokenInfo = utils.getDecodeToken()
    let params = {
      guestId: utils.getCookie('guest_id')
    }
    if (tokenInfo) {
      params = Object.assign(params, tokenInfo)
    }

    Raven.setUserContext(params)

    window.addEventListener('error', event => {
      const { id, outerHTML } = event.target
      const errs = []
      id && errs.push(`id='${id}' had loaded failed`)
      outerHTML && errs.push(`element='${outerHTML}'`)
      Raven.captureException(new Error(errs.length ? errs.join(',') : `error target info: ${JSON.stringify(event.target)}`))
    }, true)

    this.initElementUI(useUI, protoUI)
    // country
    const countryCode = await getCountryCode()
    console.log('countryCode:', countryCode)
    utils.saveUserCountry(countryCode)
    const countryInfo = countryCodeMap[countryCode]
    const symbol = countryInfo.symbol
    utils.saveSymbol(symbol)

    Vue.prototype.$bus = bus
    Vue.prototype.$api = api
    // 加上常用的过滤器，简单点直接写这里了
    /**
     * 保留小数点,默认两位
     */
    Vue.filter('round', (value, fixed = 2) => {
      try {
        return numeral(value).format('0.00')
      } catch (e) {
        return value
      }
    })

    // 初始化一下ga
    googleAnalytics.init()
    // 初始化facebokk pixel
    facebookPixel.init()
    /* eslint-disable no-new */
    return new Vue({
      el: '#app',
      i18n,
      store,
      components: {
        App
      },
      template: '<App/>'
    })
  },

  /**
   *
   * @param {*} useUI
   * @param {*} protoUI
   */
  initElementUI (useUI = null, protoUI = null) {
    // 单组件引入太麻烦了，先全部引入，以后性能有问题再说...
    // if (useUI === null && protoUI === null) {
    //   Vue.use(ElementUI)
    //   return false
    // }
    if (useUI) {
      useUI.forEach(element => {
        Vue.use(element)
      })
    }

    Vue.use(Loading.directive)
    Vue.use(Input)
    Vue.use(Menu)
    Vue.use(Submenu)
    Vue.use(MenuItem)
    Vue.use(Button)
    Vue.use(Dropdown)
    Vue.use(DropdownMenu)
    Vue.use(Dialog)
    Vue.use(Popover)
    Vue.use(Tooltip)
    Vue.use(DropdownItem)
    Vue.use(Select)
    Vue.use(Option)

    Vue.prototype.$loading = Loading.service
    // Vue.prototype.$msgbox = MessageBox
    Vue.prototype.$alert = MessageBox.alert
    Vue.prototype.$confirm = MessageBox.confirm
    // Vue.prototype.$prompt = MessageBox.prompt
    // Vue.prototype.$notify = Notification
    Vue.prototype.$message = Message

    if (protoUI) {
      Object.keys(protoUI).forEach(function (key) {
        Vue.prototype[key] = protoUI[key]
      })
    }
  }
}
