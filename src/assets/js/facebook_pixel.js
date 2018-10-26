import api from 'assets/js/api'
export default {
  init () {
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      }
      if (!f._fbq) f._fbq = n
      n.push = n
      n.loaded = !0
      n.version = '2.0'
      n.queue = []
      t = b.createElement(e)
      t.async = !0
      t.src = v
      s = b.getElementsByTagName(e)[0]
      s.parentNode.insertBefore(t, s)
    }(window,
      document, 'script', 'https://connect.facebook.net/en_US/fbevents.js'))
    // Insert Your Facebook Pixel ID below.
    window.fbq('init', '763200933862443')
    window.fbq('track', 'PageView')
  },

  /**
   * 加入购物车
   * @param {Object} param
   */
  async addToCart ({
    value,
    contentName,
    contentIds,
    contents
  }) {
    // 广告需求
    var ids = await api.fbMarketing(contentIds)
    window.fbq('track', 'AddToCart', {
      // value: value,
      // currency: 'USD',
      // content_name: contentName,
      content_type: 'product',
      content_ids: ids
      // contents: contents
    })
  },

  async viewContent ({
    contentName,
    contentIds,
    value
  }) {
    var ids = await api.fbMarketing(contentIds)
    window.fbq('track', 'ViewContent', {
      content_name: contentName,
      content_ids: ids,
      content_type: 'product',
      value: value,
      currency: 'USD'
    })
  },

  async purchase ({
    value,
    contentIds,
    contentType
  }) {
    var ids = await api.fbMarketing(contentIds)
    window.fbq('track', 'Purchase', {
      value: value,
      currency: 'USD',
      content_ids: ids,
      content_type: 'product'
    })
  }
}
