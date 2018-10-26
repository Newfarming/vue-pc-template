let config = {
  name: 'hello world.',

  axios: {
    baseURL: '',
    timeout: 60000,
    validateStatus: function (status) {
      return status <= 404 // default
    }
  },
  url: {
    cart: '/v1/cart/item/get',
    cartDelete: '/v1/cart/item/delete',
    cartAdd: '/v1/cart/item/add',
    cartProductQtyUpdate: '/v1/cart/item/update',
    cartNum: '/v1/cart/item/count',
    index: '/v1/index',
    category: '/v1/category',
    categorySub (categoryId) {
      return `/v1/category/${categoryId}`
    },
    product: '/v1/product',
    productDetail (productId) {
      return `/v1/product/${productId}`
    },
    discount: '/v1/themes',
    location: '/v1/location/by-ip',
    search: '/v1/product/search',
    login: '/v1/auth/login',
    logout: '/v1/auth/logout',
    signUp: '/v1/auth/signup',
    forget: '/v1/auth/password',
    fbLogin: '/v1/auth/login/facebook',
    shippingInfo: '/v1/shipping/info',
    pincode: '/v1/pincode',
    orderPreview: '/v1/order/preview',
    shippingAddress: '/v1/user/shipping_address',
    orderCreate: '/v1/order/',
    orderList: '/v1/orders/',
    orderDetail: '/v1/order/',
    paymentMethod (orderId) {
      return `/v2/payment/${orderId}/method`
    },
    paymentStart (orderId) {
      return `/v2/payment/${orderId}/start`
    },
    paymentQuickpayCreate (orderId) {
      return `/v2/payment/ocean/quickpay/${orderId}`
    },
    quickpayIds () {
      return `/v2/payment/ocean/quickpay/`
    },
    paymentBalance (orderId) {
      return `/v2/payment/${orderId}/start/balance/`
    },
    coupon: '/v1/coupon/',
    couponList: '/v1/coupons/',
    couponCheck: '/v1/coupon/check/',
    refundList (orderId) {
      return `/v1/order/refunds/${orderId}`
    },
    refundDetail (orderId, refundId) {
      return `/v1/order/refund/${orderId}/${refundId}`
    },
    track (orderId) {
      return `/v1/order/tracking/${orderId}`
    },
    comment: '/v1/review',
    sms: '/v1/user/order/sms',
    verifyCOD: '/v1/user/order/token',
    recommend: '/v3/product/search/related',
    themeEditorsPicks: '/v3/product/search/editors_picks',
    theme: '/v3/product/search/theme',
    codSms: '/v2/payment/sms/cod',
    cod (orderId) {
      return `/v2/payment/${orderId}/start/cod`
    }
  },

  views: {
    baseURL: 'views',
    get home () {
      return `/${this.baseURL}/home.html`
    },
    get cart () {
      return `/${this.baseURL}/cart.html`
    },
    get product () {
      return `/${this.baseURL}/product.html`
    },
    get productDetail () {
      return `/${this.baseURL}/product/detail.html`
    },
    get productReviews () {
      return `/${this.baseURL}/product/reviews.html`
    },
    get search () {
      return `/${this.baseURL}/search.html`
    },
    get payment () {
      return `/${this.baseURL}/payment.html`
    },
    get paymentAddress () {
      return `/${this.baseURL}/payment/address.html`
    },
    get paymentPay () {
      return `/${this.baseURL}/payment/pay.html`
    },
    get paymentSuccess () {
      return `/${this.baseURL}/payment/success.html`
    },
    get addQuickcardSuccess () {
      return `/${this.baseURL}/payment/pay/success.html`
    },
    get paymentFailed () {
      return `/${this.baseURL}/payment/failed.html`
    },
    get reset () {
      return `/${this.baseURL}/reset.html`
    },
    get document () {
      return `/${this.baseURL}/document.html`
    },
    get order () {
      return `/${this.baseURL}/order.html`
    },
    get orderDetail () {
      return `/${this.baseURL}/order/detail.html`
    },
    get user () {
      return `/${this.baseURL}/user.html`
    },
    get theme () {
      return `/${this.baseURL}/activity.html`
    },
    get picks () {
      return `/${this.baseURL}/activity/picks.html`
    }
  }
}

export default config
