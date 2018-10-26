import utils from 'assets/js/utils'
export default {
  init () {
    const ga = window.ga = window.ga || function () {
      (ga.q = ga.q || []).push(arguments)
    }
    ga.l = +new Date()
    ga('create', 'UA-71464937-1', 'auto')
    ga('create', 'UA-71464937-3', 'auto', 'MidEast')
    ga('create', 'UA-71464937-5', 'auto', 'SEO')
    ga('require', 'linker')
    ga('MidEast.require', 'linker')
    ga('SEO.require', 'linker')
    ga('linker:autoLink', ['clubfactory.com', 'fromfactory.club'])
    ga(function (tracker) {
      let originalSendHitTask = tracker.get('sendHitTask')
      tracker.set('sendHitTask', function (model) {
        let payLoad = model.get('hitPayload')
        originalSendHitTask(model)
        let gifRequest = new XMLHttpRequest()
        let gifPath = 'https://ga.fromfactory.club/__ua.gif'
        gifRequest.open('GET', gifPath + '?' + payLoad, true)
        gifRequest.send()
      })
    })
    ga('require', 'ec')
    ga('MidEast.require', 'ec')
    ga('SEO.require', 'ec')
    // init ga
    ;
    (function () {
      if (typeof ga !== 'undefined') {
        let uid = utils.getCookie('uid')
        if (uid) {
          ga('set', 'dimension2', uid)
          ga('SEO.set', 'dimension2', uid)
          if (utils.isMidEast()) {
            ga('MidEast.set', 'dimension2', uid)
          }
        }
        let utmSource = utils.getCookie('utm_source')
        if (utmSource) {
          ga('set', 'dimension3', utmSource)
          ga('SEO.set', 'dimension3', utmSource)
          if (utils.isMidEast()) {
            ga('MidEast.set', 'dimension3', utmSource)
          }
        }
        ga('SEO.set', 'dimension4', 'pc')
        ga('set', 'dimension4', 'pc')
        if (utils.isMidEast()) {
          ga('MidEast.set', 'dimension4', 'pc')
        }

        let gender = utils.getCookie('gender')
        let sex = gender === 'M' ? 'men' : gender === 'F' ? 'women' : 'not set'
        ga('set', 'dimension5', sex)
        ga('SEO.set', 'dimension5', sex)
        if (utils.isMidEast()) {
          ga('MidEast.set', 'dimension5', sex)
        }
      }
    })()

    ga('send', 'pageview')
    ga('SEO.send', 'pageview')
    if (utils.isMidEast()) {
      ga('MidEast.send', 'pageview')
    }
  },

  login (loginType, loginMsg) {
    window.ga('send', {
      hitType: 'event',
      eventCategory: 'Login',
      eventAction: 'Login with ' + loginType,
      eventLabel: 'Login with & ' + loginMsg,
      nonInteraction: true
    })
    window.ga('SEO.send', {
      hitType: 'event',
      eventCategory: 'Login',
      eventAction: 'Login with ' + loginType,
      eventLabel: 'Login with & ' + loginMsg,
      nonInteraction: true
    })
    if (utils.isMidEast()) {
      window.ga('MidEast.send', {
        hitType: 'event',
        eventCategory: 'Login',
        eventAction: 'Login with ' + loginType,
        eventLabel: 'Login with & ' + loginMsg,
        nonInteraction: true
      })
    }
  },

  sign (signType, signUpMsg) {
    window.ga('send', {
      hitType: 'event',
      eventCategory: 'SignUp',
      eventAction: 'SignUp with ' + signType,
      eventLabel: 'SignUp with& ' + signUpMsg,
      nonInteraction: true
    })
    window.ga('SEO.send', {
      hitType: 'event',
      eventCategory: 'SignUp',
      eventAction: 'SignUp with ' + signType,
      eventLabel: 'SignUp with& ' + signUpMsg,
      nonInteraction: true
    })
    if (utils.isMidEast()) {
      window.ga('MidEast.send', {
        hitType: 'event',
        eventCategory: 'SignUp',
        eventAction: 'SignUp with ' + signType,
        eventLabel: 'SignUp with& ' + signUpMsg,
        nonInteraction: true
      })
    }
  },

  /**
   * 加入购物车ga上报
   * @param {Object} productInfo
   */
  addCart ({
    id,
    name,
    category,
    variant,
    price,
    quantity
  }) {
    window.ga('ec:addProduct', {
      'id': id,
      'name': name,
      'category': category,
      'brand': id + ' & ' + price,
      'variant': variant,
      'price': price,
      'quantity': quantity
    })
    window.ga('ec:setAction', 'add')
    window.ga('send', {
      hitType: 'event',
      eventCategory: 'Product',
      eventAction: 'Add product',
      eventLabel: 'Add to cart ' + id,
      nonInteraction: true
    })
    window.ga('SEO.ec:addProduct', {
      'id': id,
      'name': name,
      'category': category,
      'brand': id + ' & ' + price,
      'variant': variant,
      'price': price,
      'quantity': quantity
    })
    window.ga('SEO.ec:setAction', 'add')
    window.ga('SEO.send', {
      hitType: 'event',
      eventCategory: 'Product',
      eventAction: 'Add product',
      eventLabel: 'Add to cart ' + id,
      nonInteraction: true
    })
    if (utils.isMidEast()) {
      window.ga('MidEast.ec:addProduct', {
        'id': id,
        'name': name,
        'category': category,
        'brand': id + ' & ' + price,
        'variant': variant,
        'price': price,
        'quantity': quantity
      })
      window.ga('MidEast.ec:setAction', 'add')
      window.ga('MidEast.send', {
        hitType: 'event',
        eventCategory: 'Product',
        eventAction: 'Add product',
        eventLabel: 'Add to cart ' + id,
        nonInteraction: true
      })
    }
  },

  /**
   * 设置buynow 的时候点击事件
   * @param {*} subTotalUS
   */
  buyNow (subTotalUS) {
    window.ga('send', {
      hitType: 'event',
      eventCategory: 'Checkout',
      eventAction: 'Click Buy Now',
      eventLabel: 'Click Buy Now & ' + subTotalUS,
      nonInteraction: true
    })
    window.ga('SEO.send', {
      hitType: 'event',
      eventCategory: 'Checkout',
      eventAction: 'Click Buy Now',
      eventLabel: 'Click Buy Now & ' + subTotalUS,
      nonInteraction: true
    })
    if (utils.isMidEast()) {
      window.ga('MidEast.send', {
        hitType: 'event',
        eventCategory: 'Checkout',
        eventAction: 'Click Buy Now',
        eventLabel: 'Click Buy Now & ' + subTotalUS,
        nonInteraction: true
      })
    }
  },

  oneBuyNow (subTotalUS) {
    window.ga('send', {
      hitType: 'event',
      eventCategory: 'Checkout',
      eventAction: '1 Click Order',
      eventLabel: '1 Click Order',
      nonInteraction: true
    })
    window.ga('SEO.send', {
      hitType: 'event',
      eventCategory: 'Checkout',
      eventAction: '1 Click Order',
      eventLabel: '1 Click Order',
      nonInteraction: true
    })
    if (utils.isMidEast()) {
      window.ga('MidEast.send', {
        hitType: 'event',
        eventCategory: 'Checkout',
        eventAction: '1 Click Order',
        eventLabel: '1 Click Order',
        nonInteraction: true
      })
    }
  },

  createOrder (orderId, amountTotal) {
    window.ga('send', {
      hitType: 'event',
      eventCategory: 'Checkout',
      eventAction: 'Quotations',
      eventLabel: orderId + ' & ' + amountTotal,
      nonInteraction: true
    })
    window.ga('SEO.send', {
      hitType: 'event',
      eventCategory: 'Checkout',
      eventAction: 'Quotations',
      eventLabel: orderId + ' & ' + amountTotal,
      nonInteraction: true
    })
    if (utils.isMidEast()) {
      window.ga('MidEast.send', {
        hitType: 'event',
        eventCategory: 'Checkout',
        eventAction: 'Quotations',
        eventLabel: orderId + ' & ' + amountTotal,
        nonInteraction: true
      })
    }
  },

  /**
   * 支付的时候点击事件
   * @param {*} method
   */
  payNow (method) {
    window.ga('send', {
      hitType: 'event',
      eventCategory: 'Checkout',
      eventAction: method + ' Pay Now',
      eventLabel: 'Click Pay Now & ' + method,
      nonInteraction: true
    })
    window.ga('SEO.send', {
      hitType: 'event',
      eventCategory: 'Checkout',
      eventAction: method + ' Pay Now',
      eventLabel: 'Click Pay Now & ' + method,
      nonInteraction: true
    })
    if (utils.isMidEast()) {
      window.ga('MidEast.send', {
        hitType: 'event',
        eventCategory: 'Checkout',
        eventAction: method + ' Pay Now',
        eventLabel: 'Click Pay Now & ' + method,
        nonInteraction: true
      })
    }
  },

  payComplete (payment, orderName, gaData) {
    window.ga('ec:setAction', 'purchase', {
      'id': orderName,
      'revenue': gaData.totalUs,
      'shipping': gaData.shipUS,
      'option': payment,
      'coupon': ''
    })

    window.ga('send', {
      hitType: 'event',
      eventCategory: 'Checkout',
      eventAction: payment + 'Paid Success',
      eventLabel: payment + ' & ' + orderName + ' & ' + gaData.totalUs,
      nonInteraction: true
    })

    window.ga('SEO.ec:setAction', 'purchase', {
      'id': orderName,
      'revenue': gaData.totalUs,
      'shipping': gaData.shipUS,
      'option': payment,
      'coupon': ''
    })

    window.ga('SEO.send', {
      hitType: 'event',
      eventCategory: 'Checkout',
      eventAction: payment + 'Paid Success',
      eventLabel: payment + ' & ' + orderName + ' & ' + gaData.totalUs,
      nonInteraction: true
    })
    if (utils.isMidEast()) {
      window.ga('MidEast.ec:setAction', 'purchase', {
        'id': orderName,
        'revenue': gaData.totalUs,
        'shipping': gaData.shipUS,
        'option': payment,
        'coupon': ''
      })

      window.ga('MidEast.send', {
        hitType: 'event',
        eventCategory: 'Checkout',
        eventAction: payment + 'Paid Success',
        eventLabel: payment + ' & ' + orderName + ' & ' + gaData.totalUs,
        nonInteraction: true
      })
    }
  },

  payFailed (payment, orderName, gaData) {
    window.ga('send', {
      hitType: 'event',
      eventCategory: 'Checkout',
      eventAction: payment + ' Pay Failure',
      eventLabel: orderName + ' & ' + gaData.totalUs,
      nonInteraction: true
    })
    window.ga('SEO.send', {
      hitType: 'event',
      eventCategory: 'Checkout',
      eventAction: payment + ' Pay Failure',
      eventLabel: orderName + ' & ' + gaData.totalUs,
      nonInteraction: true
    })
    if (utils.isMidEast()) {
      window.ga('MidEast.send', {
        hitType: 'event',
        eventCategory: 'Checkout',
        eventAction: payment + ' Pay Failure',
        eventLabel: orderName + ' & ' + gaData.totalUs,
        nonInteraction: true
      })
    }
  },

  clickFindMyOrder () {
    window.ga('send', {
      hitType: 'event',
      eventCategory: 'User Center',
      eventAction: 'Apply for order Cancellation',
      eventLabel: 'Apply for order Cancellation',
      nonInteraction: true
    })
    window.ga('SEO.send', {
      hitType: 'event',
      eventCategory: 'User Center',
      eventAction: 'Apply for order Cancellation',
      eventLabel: 'Apply for order Cancellation',
      nonInteraction: true
    })
  },

  /**
   * 设置自定义维度(dimension11)的商品货号上传
   * @param products: 商品货号数组
   */
  setEcommProdid: function (products) {
    window.ga('set', 'dimension11', products.join(','))
    window.ga('SEO.set', 'dimension11', products.join(','))
    if (utils.isMidEast()) {
      window.ga('MidEast.set', 'dimension11', products.join(','))
    }
  }
}
