/* eslint camelcase: 0 */
import bus from 'assets/js/bus'
import axios from 'axios'
import qs from 'qs'
import conf from './conf'
import utils from './utils'
import i18n from '../i18n'
import Raven from 'raven-js'

import {
  Message
} from 'element-ui'

window.Promise = Promise

// global config
axios.defaults.timeout = conf.axios.timeout
axios.defaults.baseURL = conf.axios.baseURL
axios.defaults.validateStatus = conf.axios.validateStatus
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  if (config.url.indexOf('/marketing/facebook/productTag') > -1) {
    return config
  }
  // 每次请求都要检查guest_id,没有就生成一个补上
  if (!utils.getCookie('guest_id')) {
    const guestId = utils.guid()
    utils.setCookie('guest_id', guestId)
  }
  if (utils.getAuthToken()) {
    config.headers.Authorization = utils.getAuthToken()
  }
  config.headers.common['Client-Basic'] = JSON.stringify({
    country_code: utils.getUserCountry(),
    language_code: utils.getUserLanguage(),
    gender: utils.getUserSex(),
    guest_id: utils.getCookie('guest_id'),
    from_site: 'pc_site'
  })
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

export default {
  /**
   * 基础的ajax请求
   * @param {Object} settings 参数和axios相同
   */
  async ajax (settings) {
    let result = await axios(settings).then(resp => {
      if (resp.headers.authorization) {
        utils.setItem('Authorization', resp.headers.authorization)
      }
      console.log('resp', resp)
      if (resp.status === 400 && resp.data.code === 999) {
        localStorage.removeItem('Authorization')
        utils.delCookie('Authorization')
        bus.$emit('call-login')
      }
      return resp.data
    }).catch(error => {
      console.log('err', error)
      let response = error.response
      // let status = response.status
      let respData = response.data
      let errorMessage = respData ? respData.message : undefined
      if (!errorMessage) {
        errorMessage = error.message
      }
      Message.error({
        showClose: true,
        message: errorMessage
      })
      Raven.captureException(new Error(`url=${settings.url}, params=${JSON.stringify(settings.params)}, err=${error}, errorMessage=${errorMessage}`))
    })
    return result
  },

  /**
   * get请求
   * @param {string} url
   * @param {Object} params
   */
  async get (url, params = null) {
    const settings = {
      method: 'get',
      url: url,
      params: params
    }
    return this.ajax(settings)
  },

  /**
   * post请求
   * @param {string} url
   * @param {Object} data
   */
  async post (url, data = null) {
    const settings = {
      method: 'post',
      url: url,
      data: qs.stringify(data)
    }
    return this.ajax(settings)
  },

  /**
   * delete请求
   * @param {string} url
   * @param {Object} data
   */
  async delete (url, data = null) {
    const settings = {
      method: 'delete',
      url: url,
      data: data
    }
    return this.ajax(settings)
  },

  // facebook 广告需求
  async fbMarketing (productNoList) {
    const productNos = await this.get(`https://www.clubfactory.com/marketing/facebook/productTag/?productNoList=${productNoList.join(',')}`)
    return productNos
  },

  /**
   * 正常登陆
   * @param {string} account
   * @param {string} pw
   */
  async login (account, pw) {
    const data = await this.post(conf.url.login, {
      account: account,
      password: pw
    })
    return data
  },

  async logout () {
    await this.post(conf.url.logout)
    this.logoutLocal()
  },

  /**
   * facebook登陆完成，请求后端完成用户数据的收集
   * @param {obj} fb_param
   */
  async fbLogin (fb_param) {
    const access_token = fb_param.authResponse.accessToken
    const data = await this.post(conf.url.fbLogin, {
      access_token
    })
    return data
  },

  /**
   * 登出
   */
  logoutLocal () {
    utils.delCookie('Authorization')
    utils.delCookie('session_id')
    utils.delCookie('uid')
    utils.removeItem('Authorization')
    utils.removeItem('session_id')
    utils.removeItem('uid')
    let needBackToHome = [conf.views.payment, conf.views.cart]
    if (needBackToHome.indexOf(window.location.pathname) > -1) {
      window.location.replace(conf.views.home)
    } else {
      window.location.reload()
    }
  },

  /**
   * 注册
   * @param {string} account
   * @param {string} pw
   */
  async signUp (account, pw, is_sub_email) {
    const data = await this.post(conf.url.signUp, {
      account: account,
      password: pw,
      is_sub_email
    })
    return data
  },

  /**
   * 忘记密码，如果有token就是修改密码，反之，请求后端发送email
   * @param {string} email
   * @param {string} pw
   * @param {string} token
   */
  async forget (email, pw, token) {
    var url = conf.url.forget
    var param = {
      email,
      url: window.location.origin + conf.views.reset + '?redirect=' + encodeURIComponent(window.location.href)
    }
    if (pw) {
      url += `/${token}`
      param = {
        password: pw
      }
    }
    const data = await this.post(url, param)
    return data
  },

  async getCartNum () {
    const { entries_count } = await this.get(conf.url.cartNum)
    return entries_count
  },

  /**
   * 获取购物车数据
   * @param {Number} n: 记录条数，默认0表示全量获取,否则获取n条记录
   */
  async getCartData (n = 0) {
    let params = !n ? undefined : n
    const {
      paged_cart_items: {
        cart_item_list,
        cur_page_no,
        page_size,
        total_page,
        total_size
      },
      shipping_info: {
        shipping_costs
      }
    } = await this.get(conf.url.cart, params) || {
      cart_item_list: [],
      cur_page_no: 1,
      page_size: 500,
      total_page: 0,
      total_size: 0
    }

    const cartItems = cart_item_list.map(item => {
      return {
        skuId: item.product_id,
        productNo: item.product_no,
        productId: item.product_template_id,
        image: item.image_url,
        name: item.name,
        // 礼物的东西先不加
        // tips: 'Your gift will expire in 5 days',
        sku: utils.convertAttrs(item.skus).join(', '),
        salePrice: item.list_price,
        salePriceUS: item.list_price_us,
        delPrice: item.c_platform_price,
        quantity: item.quantity,
        categoryIds: item.category_id,
        isAvailable: item.available,
        isChecked: false
      }
    })

    const availabelItems = cartItems.filter(item => {
      return item.isAvailable
    })

    const unavailableItems = cartItems.filter(item => {
      return !item.isAvailable
    })

    return {
      availabelItems: availabelItems,
      unavailableItems: unavailableItems,
      curPageNo: cur_page_no,
      pageSize: page_size,
      totalPage: total_page,
      totalSize: total_size,
      shippingCosts: shipping_costs
    }
  },

  /**
   * 删除购物车选项
   * @param {Number} skuId
   */
  async delCartItem (skuId) {
    return this.post(conf.url.cartDelete, {
      product_id: skuId
    })
  },

  /**
   * 更新购物车中商品的商品数量
   * @param {int} skuId : 更新商品数量的sku id
   * @param {int} qty : 更新后的商品数量,默认更新一个
   */
  async updateCartProductQty (skuId, qty = 1) {
    return this.post(conf.url.cartProductQtyUpdate, {
      product_id: skuId,
      quantity: qty
    })
  },

  /**
   * 获取首页首屏展示需要的信息
   */
  async getIndexPageInfo () {
    let {
      product_info,
      banners
    } = await this.get(conf.url.index)
    const symbol = utils.getSymbol()
    return {
      products: product_info.map(item => {
        return {
          productId: item.id,
          imageUrl: item.image_url,
          price: item.list_price,
          platformPrice: item.c_platform_price,
          platformName: item.c_platform_name,
          discount: utils.calDiscount(item.list_price, item.c_platform_price),
          symbol: symbol
        }
      }),
      banners: banners.map(item => {
        return {
          imageUrl: item.img_src,
          type: item.search_type,
          key: item.search_key
        }
      })
    }
  },

  async getCategory () {
    // todo 写个单例，然后就可以一直获取到缓存的信息
    let {
      top_category_info
    } = await this.get(conf.url.category)
    return top_category_info.map(item => {
      return {
        id: item.category_id,
        title: item.name,
        active: false
      }
    })
  },

  async getCategorySub (categoryId) {
    let {
      category_info
    } = await this.get(conf.url.categorySub(categoryId))

    return {
      title: category_info.name,
      name: category_info.category_id,
      subs: category_info.sub_category.map(item => {
        return {
          id: item.category_id,
          title: item.name,
          isSelected: false
        }
      })
    }
  },

  async getProductCategoryInfo (categoryId) {
    return this.get(conf.url.categorySub(categoryId))
  },

  /**
   * 获取商品列表
   * @param {Object} param 筛选条件对象
   */
  async getProductInfo ({
    offset = 0,
    limit = 20,
    categoryId = undefined,
    filterBy = undefined,
    sortBy = undefined,
    ad = undefined
  } = {}) {
    let {
      product_info
    } = await this.get(conf.url.product, {
      limit: limit,
      offset: offset,
      category_id: categoryId,
      filter_by: filterBy,
      sort_by: sortBy,
      ad: ad
    })

    const symbol = utils.getSymbol()
    return product_info.map(item => {
      return {
        productNo: item.product_no,
        productId: item.id,
        imageUrl: item.image_url,
        price: item.list_price,
        platformPrice: item.c_platform_price,
        platformName: item.c_platform_name,
        discount: utils.calDiscount(item.list_price, item.c_platform_price),
        symbol: symbol
      }
    })
  },
  /**
   * 获取商品详情
   * @param {int} productId 商品ID
   */
  async getProductDetail (productId) {
    let {
      product_info: productInfo,
      comment_info: commentInfo = [],
      rating = 5,
      rating_num: rateNum = 0,
      sku_info: skuInfo = [],
      shipping_info: shippingInfo = {}
    } = await this.get(conf.url.productDetail(productId))
    const symbol = utils.getSymbol()
    return {
      productId: productInfo.id,
      productName: productInfo.name,
      productNo: productInfo.product_no,
      isTaxInclude: true,
      active: productInfo.active,
      orders: productInfo.orders,
      price: productInfo.list_price,
      platformPrice: productInfo.c_platform_price,
      showBuyNow: productInfo.show_buy_now_only,
      get platformDetails () {
        let platformDetails = productInfo.c_details
        let results = []
        if (platformDetails && platformDetails.length > 0) {
          results.push({
            platformName: 'Club Factory',
            price: this.price,
            shipping: 0.00,
            total: this.price,
            platformURL: ''
          })
          results = results.concat(platformDetails.map(item => {
            return {
              platformName: item.c_platform,
              price: item.c_price,
              shipping: item.c_shipping,
              total: item.c_price + item.c_shipping,
              platformURL: item.c_url
            }
          }))
        }
        return results
      },
      descriptions: productInfo.b_specifics || [],
      get discount () {
        let result = (this.platformPrice - this.price) / this.platformPrice * 100
        return result > 0 ? result.toFixed(0) : ''
      },
      skuIds: productInfo.product_ids,
      skuInfo: skuInfo,
      productImages: productInfo.product_images,
      categoryIds: productInfo.category_id,
      // 目前只去前11条
      commentInfo: commentInfo.map(item => {
        return {
          id: item.id,
          username: item.user_name,
          rating: item.rating,
          time: item.update_at || item.create_at,
          comment: item.comment
        }
      }).slice(0, 11),
      rateScore: parseFloat(rating.toFixed(1)),
      rateNum: rateNum,
      shippingInfo: shippingInfo,
      symbol: symbol
    }
  },

  async addCart (skuId, addQty = 1) {
    await this.post(conf.url.cartAdd, {
      product_id: skuId,
      add_qty: addQty
    })
  },

  async getIpCountryInfo () {
    return this.get(conf.url.location)
  },

  async searchProducts ({
    query,
    offset = 0,
    limit = 20
  }) {
    let {
      product_info: productInfo
    } = await this.get(conf.url.search, {
      query: query,
      limit: limit,
      offset: offset
    })

    const symbol = utils.getSymbol()
    return productInfo.map(item => {
      return {
        productId: item.id,
        imageUrl: item.image_url,
        price: item.list_price,
        platformPrice: item.c_platform_price,
        platformName: item.c_platform_name,
        discount: utils.calDiscount(item.list_price, item.c_platform_price),
        symbol: symbol
      }
    })
  },

  async getShippingInfo () { // 当前国家的shipping信息
    return this.get(conf.url.shippingInfo)
  },

  /**
   *
   * @param {string || number} pincode
   * 获取印度pincode 对应的省市
   */
  async getPincode (pincode) {
    return this.get(conf.url.pincode, {
      pincode
    })
  },

  /**
   *
   * @param {string} skuIds
   * 获取订单提交前数据
   */
  async getOrderPreview (skuIds, quantity) {
    let params = {
      cart_choosed_product: skuIds
    }
    if (quantity) {
      params = {
        buy_now_products: skuIds,
        buy_now_quantitys: quantity
      }
    }
    const {
      products,
      order_info,
      phone_info,
      zip_info,
      max_order_money,
      partner_info,
      currency_symbol
    } = await this.get(conf.url.orderPreview, params)
    const productItems = products.map(item => {
      return {
        skuId: item.sku_id,
        image: item.image_url,
        name: item.product_name,
        sku: item.attrs,
        salePrice: item.list_price_local,
        delPrice: item.c_platform_price_local,
        quantity: item.product_qty,
        productId: item.product_template_id
      }
    })
    let prices = [{
      label: i18n.t('order.price_total'),
      name: 'totla',
      price: order_info.subtotal
    }, {
      label: i18n.t('order.shipping_fee'),
      name: 'shippingFee',
      price: order_info.shipping_fee > 0 ? order_info.shipping_fee : 'Free'
    }, {
      label: i18n.t('order.paid_total'),
      name: 'paidTotal',
      price: order_info.amount_total
    }]
    if (order_info.coupon_info && order_info.coupon_info.discount) {
      prices[2].oriPrice = order_info.amount_total + order_info.coupon_info.discount.amount_off
    }
    if (order_info.tax) {
      prices.splice(2, 0, {
        label: 'Tax(5%)',
        price: order_info.tax
      })
    }
    let coupon = (order_info.available_coupons || []).map(item => {
      return {
        id: item.id,
        discount: item.discount.amount_off,
        start: item.start_date_local,
        end: item.expiry_date_local,
        terms: item.terms_lines,
        des: item.name
      }
    })
    return {
      products: productItems,
      priceList: prices,
      phoneReg: phone_info,
      zipReg: zip_info,
      maxOrderMoney: max_order_money,
      orderAmount: order_info.amount_total,
      deliveryAddress: partner_info,
      coupon: coupon,
      symbol: currency_symbol,
      isTaxInclude: order_info.is_include_tax
    }
  },

  /**
   *
   * @param {obj} param
   * 更新收货地址
   */
  async updateShippingAddress (param) {
    return this.post(conf.url.shippingAddress, param)
  },

  async createOrder (param) {
    const {
      amount_total,
      amount_total_us,
      order_name
    } = await this.post(conf.url.orderCreate, param)
    return {
      amountTotal: amount_total,
      totalUs: amount_total_us,
      orderId: order_name
    }
  },

  async orderList (param) {
    const { order_infos, orders_num, user_name } = await this.get(conf.url.orderList, param)
    const orderInfo = order_infos.map(item => {
      return {
        orderId: item.order_name,
        total: item.total_local,
        items: item.total_items,
        paymentDate: item.payment_date,
        product: item.order_lines,
        state: item.show_state,
        delivery: null,
        expiryDate: item.expiry_string,
        refundInfo: item.refund_info
      }
    })
    return {
      all: param.order_type === 1 ? orderInfo : [],
      unfinished: param.order_type === 2 ? orderInfo : [],
      paid: param.order_type === 3 ? orderInfo : [],
      counts: orders_num,
      account: user_name
    }
  },

  async getOrderDetail (orderId, token) {
    let {
      order_lines,
      show_state,
      pay_info,
      total_local,
      payment_date,
      shipping_info,
      pay_channel,
      expiry_string,
      arrive_date,
      delivery_info,
      total_us,
      discount,
      currency_symbol,
      cod_line,
      virtual_seller_info,
      is_include_tax
    } = await this.get(`${conf.url.orderDetail}${orderId}`, {
      token
    })
    const products = order_lines.map(item => {
      return {
        name: item.name,
        image: item.image_url,
        sku: item.color && item.size ? `${item.color},${item.size}` : (item.color ? item.color : (item.size ? item.size : '')),
        salePrice: item.price_real_local,
        quantity: item.quantity,
        amount: item.total_real_local,
        productId: item.product_template_id,
        productNo: item.product_no,
        skuId: item.sku_id,
        gaPirce: item.list_price_us
      }
    })
    let prices = [{
      label: i18n.t('order.price_total'),
      price: pay_info.subtotal_local
    }, {
      label: i18n.t('order.shipping_fee'),
      price: pay_info.delivery_price_local ? pay_info.delivery_price_local : 'Free'
    }, {
      label: i18n.t('order.paid_total'),
      price: total_local,
      originPrice: total_local
    }]
    if (pay_info.balance_local) {
      prices.splice(prices.length - 1, 0, {
        label: 'Balance',
        price: -pay_info.balance_local
      })
    }
    if (discount && discount.amount_off) {
      prices[2].oriPrice = total_local + discount.amount_off
      prices.splice(prices.length - 1, 0, {
        label: 'Coupon',
        price: -discount.amount_off
      })
    }
    if (pay_channel === 'cod') {
      prices.splice(prices.length - 1, 0, {
        label: 'COD Charge',
        price: cod_line.cod_price ? cod_line.cod_price : 'Free'
      })
    }
    if (pay_info.tax_real_price_local) {
      prices.splice(prices.length - 1, 0, {
        label: 'Tax(5%)',
        price: pay_info.tax_real_price_local
      })
    }
    return {
      arriveDate: arrive_date,
      expiryString: expiry_string,
      products: products,
      state: show_state,
      summary: prices,
      paidDate: payment_date,
      address: {
        'phone': `+${shipping_info.phone_area_code} ${shipping_info.shipping_phone}`,
        'zipcode': shipping_info.shipping_zip,
        'email': shipping_info.shipping_email,
        'name': shipping_info.shipping_name,
        'country': shipping_info.shipping_country,
        'state': shipping_info.shipping_state,
        'city': shipping_info.shipping_city,
        'street': shipping_info.shipping_street2,
        'shipping_phone': shipping_info.shipping_phone
      },
      patmentMethod: pay_channel,
      total: total_local,
      deliveryInfo: delivery_info,
      gaData: {
        totalUs: total_us,
        shipUS: pay_info.delivery_price_us
      },
      symbol: currency_symbol,
      virtualSellerInfo: virtual_seller_info || {},
      isTaxInclude: is_include_tax
      // 'Courier': 'Delivery'
    }
  },

  async deleteOrder (orderId) {
    const { order_name, result } = await this.delete(`${conf.url.orderDetail}${orderId}`)
    return {
      result: result,
      orderId: order_name
    }
  },

  async paymentMethod (orderId) {
    const {
      methods
    } = await this.get(conf.url.paymentMethod(orderId))
    let method = methods.map((item, index) => {
      let keys = Object.keys(item)
      let value = item[keys[0]]
      value.name = keys[0]
      value.default = index === 0
      return value
    })
    console.log('method', method)
    return {
      method
    }
  },

  async paymentStart (orderId, param) {
    const {
      url,
      data
    } = await this.post(conf.url.paymentStart(orderId), param)
    if (param.channel === 'cashfree') {
      utils.makePost(url, data, '_blank')
      return
    }
    utils.makePost(url, data)
  },

  async paymentBalance (orderId) {
    const {
      payment_result
    } = await this.post(conf.url.paymentBalance(orderId))
    return {
      result: payment_result
    }
  },

  async quickpayCreate (orderId, params) {
    const {
      data,
      url
    } = await this.post(conf.url.paymentQuickpayCreate(orderId), params)
    utils.makePost(url, data, 'quickpay_frame')
  },

  async discount () {
    const {
      AmountOff,
      ShippingFree,
      Promotion,
      Blank
    } = await this.get(conf.url.discount)
    return {
      AmountOff: AmountOff || {
        expire_time: 0,
        coupons: []
      },
      ShippingFree: ShippingFree || {
        expire_time: 0
      },
      Promotion: Promotion || {
        expire_time: 0
      },
      Blank: Blank || {
        expire_time: 0
      }
    }
  },

  async getCoupon (id) {
    const { coupon } = await this.post(conf.url.coupon, {
      coupon_template_code: id
    })
    return {
      id: coupon.id,
      start: coupon.start_date_local,
      end: coupon.expiry_date_local,
      terms: coupon.terms_lines,
      des: coupon.name,
      state: coupon.state
    } || {}
  },

  async couponCheck (param) {
    const { coupon_info } = await this.get(conf.url.couponCheck, param)
    if (coupon_info) {
      return {
        id: coupon_info.id,
        discount: coupon_info.discount.amount_off,
        start: coupon_info.start_date_local,
        end: coupon_info.expiry_date_local,
        terms: coupon_info.terms_lines,
        des: coupon_info.name
      }
    } else {
      return null
    }
  },

  async getCouponList () {
    const { coupons } = await this.get(conf.url.couponList)
    let inactive = coupons.inactive.map(item => {
      return {
        id: item.id,
        start: item.start_date_local,
        end: item.expiry_date_local,
        terms: item.terms_lines,
        des: item.name
      }
    })

    let expired = coupons.expired.map(_ => {
      return {
        id: _.id,
        start: _.start_date_local,
        end: _.expiry_date_local,
        terms: _.terms_lines,
        des: _.name
      }
    })

    let available = coupons.available.map(_ => {
      return {
        id: _.id,
        start: _.start_date_local,
        end: _.expiry_date_local,
        terms: _.terms_lines,
        des: _.name
      }
    })

    let used = coupons.used.map(_ => {
      return {
        id: _.id,
        start: _.start_date_local,
        end: _.expiry_date_local,
        terms: _.terms_lines,
        des: _.name
      }
    })
    return {
      available,
      inactive,
      expired,
      used
    }
  },

  async getQuickPayCards () {
    const {
      quickpay_list
    } = await this.get(conf.url.quickpayIds())
    return {
      quickpayList: quickpay_list
    }
  },

  async deleteQuickPayCards (quickpayIds) {
    const result = await this.delete(conf.url.quickpayIds(), {
      quickpay_id: quickpayIds
    })
    return !!result
  },

  async refundList (orderId, token) {
    const { refunds } = await this.get(conf.url.refundList(orderId), {
      token
    })
    let infos = refunds.map(item => {
      return {
        refundId: item.refund_id
      }
    })
    return infos
  },

  async refundDetail (orderId, refundId, token) {
    const {
      refund_total,
      refund_reason,
      refund_channel,
      refund_state,
      refund_status,
      refund_symbol,
      refund_lines,
      bank_info
    } = await this.get(conf.url.refundDetail(orderId, refundId), {
      token
    })
    let products = refund_lines.map(item => {
      return {
        name: item.product_name,
        image: item.image_url,
        sku: item.sku_attr,
        salePrice: item.price_local,
        quantity: item.refund_qty,
        amount: item.amount_local,
        productId: item.product_id,
        refundAmount: item.refund_amount_local
      }
    })
    return {
      refundAccount: bank_info.bank_account_info,
      refundAmount: refund_total.toFixed(2),
      refundReason: refund_reason,
      refundChannel: bank_info.payment_mode_name ? bank_info.payment_mode_name : refund_channel,
      refundState: refund_state,
      refundStatus: refund_status,
      symbol: refund_symbol,
      products: products
    }
  },

  async trackShip (orderId, token) {
    const { tracking_infos } = await this.get(conf.url.track(orderId), {
      token
    }) // 'SO800018'
    tracking_infos.map(item => {
      let msgs = item.tracking_msg
      if (msgs.length) {
        msgs.reverse()
        if (msgs[0].nodes && msgs[0].nodes.length) {
          msgs[0].nodes.reverse()
          msgs[0].nodes[0].last = true
          msgs[0].nodes.reverse()
        } else {
          msgs[0].last = true
        }
        msgs.every((item, index) => {
          if (item.active) {
            msgs[index].isShowSub = true
            if (msgs[index].nodes && msgs[index].nodes.length) {
              msgs[index].nodes.reverse()
              msgs[index].nodes[0].activeItem = true
              msgs[index].nodes.reverse()
            } else {
              msgs[index].activeItem = true
            }
            return false
          }
          return true
        })
        msgs.reverse()
      }
      item.tracking_msg = msgs
      return item
    })
    return {
      trackInfos: tracking_infos
    }
  },

  async getCommentList (params) {
    const {
      review_list,
      review_count
    } = await this.get(conf.url.comment, params)
    let reviewList = review_list.map(item => {
      return {
        id: item.id,
        username: item.user_name,
        rating: item.rating,
        time: item.update_at || item.create_at,
        comment: item.comment,
        images: item.images || [],
        sku: item.sku.attribute_info.map(attr => {
          return attr.attr_value_name
        }).join(',')
      }
    })
    return {
      reviewList: reviewList,
      reviewCount: review_count
    }
  },

  async getRecommendProducts (params) {
    const {
      product_list
    } = await this.get(conf.url.recommend, params)
    const symbol = utils.getSymbol()
    return product_list.map(item => {
      return {
        productNo: item.product_no,
        productId: item.id,
        imageUrl: item.image_url,
        price: item.list_price,
        platformPrice: item.c_platform_price,
        platformName: item.c_platform_name,
        discount: utils.calDiscount(item.list_price, item.c_platform_price),
        symbol: symbol
      }
    })
  },

  async getState (code) {
    let state = JSON.parse(utils.getItem(`state_${code}`))
    if (!state) {
      state = await this.get(`../../static/state/${code}.json`)
      utils.setItem(`state_${code}`, JSON.stringify(state))
    }
    return state
  },

  async verifyCOD (param) {
    const {
      success,
      token,
      message
    } = await this.get(conf.url.verifyCOD, param)
    return {
      success,
      token,
      message
    }
  },

  async sendSms (params) {
    const { wait } = await this.post(conf.url.sms, params)
    return {
      wait: wait || 0
    }
  },
  async sendVC (params) {
    return this.post(conf.url.sms, params)
  },

  async codSms (params) {
    const { wait } = await this.post(conf.url.codSms, params)
    return {
      wait: wait || 0
    }
  },

  async startCodPayment (orderId, params) {
    const { success } = await this.post(conf.url.cod(orderId), params)
    return {
      success
    }
  },

  async getThemeInfo (params) {
    const {
      tabs,
      product_list,
      count
    } = await this.get(conf.url.theme, params)
    const symbol = utils.getSymbol()
    return {
      tabs,
      products: product_list.map(item => {
        return {
          productId: item.id,
          imageUrl: item.image_url,
          price: item.list_price,
          platformPrice: item.c_platform_price,
          platformName: item.c_platform_name,
          discount: utils.calDiscount(item.list_price, item.c_platform_price),
          symbol: symbol
        }
      }),
      count
    }
  },

  async getPicksInfo (params) {
    const {
      tabs,
      product_list,
      count,
      banner_image
    } = await this.get(conf.url.themeEditorsPicks, params)
    const symbol = utils.getSymbol()
    return {
      tabs,
      products: product_list.map(item => {
        return {
          productId: item.id,
          imageUrl: item.image_url,
          price: item.list_price,
          platformPrice: item.c_platform_price,
          platformName: item.c_platform_name,
          discount: utils.calDiscount(item.list_price, item.c_platform_price),
          symbol: symbol
        }
      }),
      count,
      image: banner_image
    }
  }
}
