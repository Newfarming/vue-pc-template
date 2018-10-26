import qs from 'qs'
import jwtDecode from 'jwt-decode'
import {languageMap} from './language'

let utils = {
  getCookie (name) {
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    let arr = document.cookie.match(reg)
    if (arr) {
      return unescape(arr[2])
    }
    return null
  },

  setCookie (name, value, expires = undefined, path = '/', domain = '.clubfactory.com') {
    if (!expires) {
      let now = new Date()
      // 设置date为当前时间加一年
      now.setTime(now.getTime() + 365 * 24 * 60 * 60 * 1000)
      expires = now.toGMTString()
    }
    document.cookie = `${name}=${value}; expires=${expires}; path=${path}; domain=${domain}`
  },

  delCookie (name) {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    var cval = this.getCookie(name)
    if (cval != null) {
      this.setCookie(name, cval, exp.toGMTString())
    }
  },

  /**
   * 生成32位UUID
   */
  guid () {
    function s4 () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }

    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4()
  },

  /**
   * 获取本地token
   */
  getAuthToken () {
    // 暂时从cookie中拿登录验证的token
    return this.getItem('Authorization') || this.getCookie('Authorization')
  },

  setItem (key, value, expires = undefined) {
    // 先存在localStorage里面，不能存就存在cookie里面
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      this.setCookie(key, value, expires)
    }
  },

  getItem (key) {
    // 取值也一样，默认从localStorage中找，找不到再去cookie中找
    try {
      return localStorage.getItem(key)
    } catch (e) {
      return this.getCookie(key)
    }
  },

  removeItem (key) {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      this.delCookie(key)
    }
  },

  saveUserSex (sex) {
    this.setItem('gender', sex)
    this.setCookie('gender', sex)
  },

  getUserSex () {
    return this.getItem('gender')
  },

  saveUserCountry (countryCode) {
    this.setItem('country_code', countryCode)
    this.setCookie('country_code', countryCode)
  },

  getUserCountry () {
    let param = this.parseQueryString()
    if (param.country) {
      return param.country
    }
    return this.getItem('country_code') || 'us'
  },

  saveSymbol (symbol) {
    this.setItem('symbol', symbol)
  },

  getSymbol () {
    return this.getItem('symbol') || 'USD'
  },

  getUserLanguage () {
    let param = this.parseQueryString()
    let language = param.language || this.getItem('language_code') || navigator.language || navigator.userLanguage
    // 以 es-MX 的形式作为语言码的标准形式, 见 https://lh.2xlibre.net/locales/
    return language ? language.replace('_', '-') : language
  },

  saveUserLanguage (languageCode) {
    if (!this.isSupportLanguage(languageCode)) {
      console.error(`unsupported languageCode：${languageCode}`)
      return
    }
    this.setItem('language_code', languageCode)
    this.setCookie('language_code', languageCode)
  },

  isSupportLanguage (languageCode) {
    return Object.keys(languageMap).includes(languageCode)
  },

  isMidEast () {
    var midEast = ['ae', 'om', 'kw', 'qa', 'bh', 'sa']
    var countryCode = this.getItem('country_code')
    if (midEast.indexOf(countryCode) > -1) {
      return true
    }
    return false
  },

  /// ///////////////////////////////////////////
  /**
   * 解析query string
   * @param {string} search
   */
  parseQueryString (search = '') {
    if (!search) {
      search = window.location.search
    }
    return qs.parse(search, {
      ignoreQueryPrefix: true
    })
  },

  encodeQueryString (query) {
    return qs.stringify(query, {
      addQueryPrefix: true
    })
  },

  /**
   * 获取解析后的token
   */
  getDecodeToken () {
    const token = this.getAuthToken()
    try {
      return jwtDecode(token)
    } catch (error) {
      console.log('decode token error: ', error)
      return null
    }
  },

  calDiscount (price, platformPrice) {
    try {
      price = parseInt(price) || 0
      platformPrice = parseInt(platformPrice) || 0
      const rest = platformPrice - price
      if (rest <= 0) {
        return ''
      }
      return (rest / platformPrice * 100).toFixed(0) + '% off'
    } catch (e) {
      return ''
    }
  },

  convertAttrs (attrs) {
    if (!attrs) {
      return []
    }
    return attrs.map(attr => {
      return attr.name
    })
  },

  getCheckProductCookie () {
    let chosenProduct = this.getCookie('cart_choosed_product')
    return chosenProduct ? chosenProduct.split('-').map(item => parseInt(item)) : []
  },

  saveCheckProductCookie (value) {
    this.setCookie('cart_choosed_product', value.join('-'))
  },
  addCheckProductCookie (sku) {
    let chosenProducts = this.getCheckProductCookie()
    chosenProducts.push(sku)
    this.saveCheckProductCookie(chosenProducts)
  },

  removeCheckProductCookie (sku) {
    console.log('removeCheckProductCookie:', sku)
    let chosenProducts = this.getCheckProductCookie()
    chosenProducts = chosenProducts.filter(item => {
      return item !== sku
    })
    this.saveCheckProductCookie(chosenProducts)
  },

  checkLogin () {
    var tokenInfo = this.getDecodeToken()
    if (!tokenInfo) {
      window.location.href = '/views/home.html'
    }
  },

  setSeoInfo (cateId, title, metas = []) {
    if (title) {
      document.title = title
    }
    let cates = require('assets/json/category.json')
    let cateName = cates[cateId]
    if (cateName) {
      let discloth = [200000139, 200000109, 200000097, 100006749, 200132001, 200000161, 200154003, 200188001, 55, 56, 76, 77, 78, 79, 80, 81, 82, 83, 84, 87, 88, 100006206, 200002937, 57, 73, 74, 85, 86, 380230, 200002361, 200002394, 200020009]
      if (!title) {
        document.title = `${cateName} - Buy ${cateName} Online at Fair Prices - clubfactory.com`
      }
      let meta = `Online Shopping for Stylish ${cateName}. Huge Selection of Fashion Clothes, Bags, Shoes and Jewelry at Lower Prices. ClubFactory.com`
      if (discloth.indexOf(cateId) > -1) {
        meta = `Online Shopping for Handy ${cateName}. Everything at Fair Prices. Huge Selection. ClubFactory.com`
      }
      // console.log('Description', metaDom['Description'])
      document.getElementsByTagName('meta')['Description'].content = meta
    }
    if (metas.length) {
      metas.forEach(item => {
        document.getElementsByTagName('meta')[item.name].content = item.content
      })
    }
  },

  addDate (day) {
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    let date = new Date()
    let newDate = new Date(date.setDate(date.getDate() + day))
    return `${months[newDate.getMonth()]} ${newDate.getDate()}`
  },

  luhnCheck (bankno) {
    var lastNum = bankno.substr(bankno.length - 1, 1) // 取出最后一位（与luhn进行比较）

    var first15Num = bankno.substr(0, bankno.length - 1) // 前15或18位
    var newArr = []
    for (var i = first15Num.length - 1; i > -1; i--) { // 前15或18位倒序存进数组
      newArr.push(first15Num.substr(i, 1))
    }
    var arrJiShu = [] // 奇数位*2的积 <9
    var arrJiShu2 = [] // 奇数位*2的积 >9

    var arrOuShu = [] // 偶数位数组
    for (var j = 0; j < newArr.length; j++) {
      if ((j + 1) % 2 === 1) { // 奇数位
        if (parseInt(newArr[j]) * 2 < 9) {
          arrJiShu.push(parseInt(newArr[j]) * 2)
        } else {
          arrJiShu2.push(parseInt(newArr[j]) * 2)
        }
      } else {
        arrOuShu.push(newArr[j]) // 偶数位
      }
    }

    var jishuChildUnitsDigit = [] // 奇数位*2 >9 的分割之后的数组个位数
    var jishuChildTensDigit = [] // 奇数位*2 >9 的分割之后的数组十位数
    for (var h = 0; h < arrJiShu2.length; h++) {
      jishuChildUnitsDigit.push(parseInt(arrJiShu2[h]) % 10)
      jishuChildTensDigit.push(parseInt(arrJiShu2[h]) / 10)
    }

    var sumJiShu = 0 // 奇数位*2 < 9 的数组之和
    var sumOuShu = 0 // 偶数位数组之和
    var sumJiShuChild1 = 0 // 奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2 = 0 // 奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal = 0
    for (var m = 0; m < arrJiShu.length; m++) {
      sumJiShu = sumJiShu + parseInt(arrJiShu[m])
    }

    for (var n = 0; n < arrOuShu.length; n++) {
      sumOuShu = sumOuShu + parseInt(arrOuShu[n])
    }

    for (var p = 0; p < jishuChildUnitsDigit.length; p++) {
      sumJiShuChild1 = sumJiShuChild1 + parseInt(jishuChildUnitsDigit[p])
      sumJiShuChild2 = sumJiShuChild2 + parseInt(jishuChildTensDigit[p])
    }
    // 计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2)

    // 计算luhn值
    var k = parseInt(sumTotal) % 10 === 0 ? 10 : parseInt(sumTotal) % 10
    var luhn = 10 - k

    if (parseInt(lastNum) === luhn) {
      return true
    } else {
      return false
    }
  },

  matchCard (cardNum, target) {
    var verify = {
      'card': false,
      'date': false,
      'cvv': false
    }
    var card = cardNum.replace(/\s/g, '')

    // 目标 input
    let inputs = document.getElementById(target).getElementsByTagName('input')
    let cardSecureCode, cardLuhnPass, cardTypeInput, cardSecureCodePass, cardDatePass, cardMonth, cardYear
    for (let i = 0; i <= inputs.length; i++) {
      if (inputs[i]) {
        switch (inputs[i].getAttribute('tag')) {
          case 'card_secureCode':
            cardSecureCode = inputs[i]
            break
          case 'payment[card_luhn_pass]':
            cardLuhnPass = inputs[i]
            break
          case 'payment[card_type]':
            cardTypeInput = inputs[i]
            break
          case 'payment[card_secureCode_pass]':
            cardSecureCodePass = inputs[i]
            break
          case 'payment[card_date_pass]':
            cardDatePass = inputs[i]
            break
          case 'card_month':
            cardMonth = inputs[i].value
            break
          case 'card_year':
            cardYear = inputs[i].value
            break
        }
      }
    }

    // 卡种正则表达式
    var rule = []

    rule['visa'] = new RegExp('^4\\d{15}$')
    rule['mastercard'] = new RegExp('^(5[1-5][\\d]{2}|222[1-9]|22[3-9][\\d]|2[3-6][\\d]{2}|27[0-1][\\d]|2720)\\d{12}$')
    rule['jcb'] = new RegExp('^35(28|29|([3-8][\\d]))\\d{12}$')
    rule['maestro'] = new RegExp('^(50|(5[6-9])|(6[\\d]))\\d{10,17}$')
    rule['ae'] = new RegExp('^3[47]\\d{13}$')
    rule['aura'] = new RegExp('^5\\d{18}$')
    rule['diners'] = new RegExp('^36\\d{12}|3(?:0[0-5]|[68][0-9])[0-9]{11}$')
    rule['discover'] = new RegExp('^6(?:011|5\\d{2})\\d{12}$')
    rule['hipercard'] = new RegExp('^(?:606282|637095|637568)\\d{10}|38\\d{14,17}$')
    rule['elo'] = new RegExp('^(?:50670[7-8]|506715|50671[7-9]|50672[0-1]|50672[4-9]|50673[0-3]|506739|50674[0-8]|50675[0-3]|50677[4-8]|50900[0-9]|50901[3-9]|50902[0-9]|50903[1-9]|50904[0-9]|50905[0-9]|50906[0-4]|50906[6-9]|50907[0-2]|50907[4-5]|636368|636297|504175|438935|40117[8-9]|45763[1-2]|457393|431274|50907[6-9]|50908[0-9]|627780)[0-9]*$')

    var cardType = ''

    for (let i in rule) {
      if (rule[i].test(card)) {
        cardType = i
      }
    }

    // 如果是AE卡，CVV长度改成4位
    if (cardType !== '') {
      if (cardType === 'ae') {
        cardSecureCode.maxLength = 4
        cardSecureCode.value = cardSecureCode.value.substr(0, 4)
      } else {
        cardSecureCode.maxLength = 3
        cardSecureCode.value = cardSecureCode.value.substr(0, 3)
      }
    }

    // 检查luhn算法
    console.log('card', card)
    console.log('checkout', this.luhnCheck(card))
    if (this.luhnCheck(card) && card !== '') {
      cardLuhnPass.value = '1'
      verify.card = true
    } else {
      cardLuhnPass.value = ''
    }

    // 卡种
    cardTypeInput.value = cardType

    // 检查安全码
    var secureCode = cardSecureCode.value

    // 正则表达式
    var cvv = new RegExp('^\\d{3}$')
    var cvv2 = new RegExp('^\\d{4}$')

    if (cardType === 'ae') {
      if (cvv2.test(secureCode)) {
        verify.cvv = true
        cardSecureCodePass.value = '1'
      } else {
        cardSecureCodePass.value = ''
      }
    } else {
      if (cvv.test(secureCode)) {
        verify.cvv = true
        cardSecureCodePass.value = '1'
      } else {
        cardSecureCodePass.value = ''
      }
    }

    const result = this.checkDate(cardMonth, cardYear, cardDatePass)
    verify.date = result
    console.log('verify', verify)
    return verify
  },

  checkDate (month, year, el) {
    // 正则表达式
    var monthRule = new RegExp('^\\d{2}$')
    var yearRule = new RegExp('^\\d{4}$')
    console.log('monthyear', [month, year, el])
    if (month !== '' && year !== '') {
      if (month.length === 1) {
        month = '0' + month
      }
      if (monthRule.test(month) && yearRule.test(year) && month >= 1 && month <= 12) {
        // 当前日期
        var NowDate = new Date()
        var nowyear = NowDate.getFullYear()
        var nowmonth = NowDate.getMonth() + 1

        nowmonth = nowmonth < 10 ? '0' + nowmonth : nowmonth
        var today = nowyear.toString() + nowmonth.toString()

        // 选择日期
        let selectday = year.toString() + month.toString()
        console.log('selectday', [selectday, today])
        // 选择日期是否大于当前日期
        if (selectday >= today) {
          el.value = '1'
          return true
        } else {
          el.value = ''
          return false
        }
      } else {
        el.value = ''
        return false
      }
    } else {
      el.value = ''
      return false
    }
  },

  makePost (url, data, target) {
    let oForm = document.createElement('form')
    oForm.method = 'post'
    oForm.action = url

    oForm.target = target || ''

    for (let key in data) {
      let oInput = document.createElement('input')
      oInput.type = 'text'
      oInput.name = key
      oInput.value = data[key]
      oForm.appendChild(oInput)
    }
    document.body.appendChild(oForm)
    oForm.submit()
    document.body.removeChild(oForm)
  },
  // 取窗口滚动条高度
  getScrollTop () {
    var scrollTop = 0
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop
    } else if (document.body) {
      scrollTop = document.body.scrollTop
    }
    return scrollTop
  }
}

export default utils
