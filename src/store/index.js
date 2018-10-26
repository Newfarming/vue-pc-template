import Vue from 'vue'
import Vuex from 'vuex'
import api from 'assets/js/api'
import utils from 'assets/js/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    asideInfo: {},
    subMenu: {},
    category: {},
    activeSortItem: '',
    filter: '',
    scrollTop: 0,
    search: '',
    skuIds: []
  },
  getters: {
    categoryInfo (state) {
      return state.asideInfo.category_info
    },
    sortInfo (state) {
      return state.asideInfo.sort_info || {}
    },
    filterInfo (state) {
      return state.asideInfo.filter_info || {
        color: [],
        size: [],
        price: []
      }
    }
  },
  mutations: {
    filterChange (state, payload) {
      state.filter = payload
    },
    subMenuChange (state, payload) {
      state.subMenu = payload
    },
    categoryChange (state, payload) {
      state.category = payload
    },
    activeSortItem (state, item) {
      state.activeSortItem = item
    },
    updateAsideInfo (state, info) {
      state.asideInfo = info
    },
    updateSubMenuSelect (state, id) {
      state.subMenu = {
        title: state.subMenu.title,
        name: state.subMenu.name,
        subs: state.subMenu.subs.map(item => {
          item.isSelected = item.id === id
          return item
        })
      }
    },
    updateScrollTop (state, scrollTop) {
      state.scrollTop = scrollTop
    },
    updateSearch (state, search) {
      state.search = search
    },
    updateSkuIds (state, skuIds) {
      state.skuIds = skuIds
    }
  },
  actions: {
    async initAsideInfo ({
      commit,
      getters
    }, categoryId) {
      categoryId = parseInt(categoryId)
      // 初始化的值可以从querystring中获取到
      let query = utils.parseQueryString()

      let asideInfo = await api.getProductCategoryInfo(categoryId)
      let filter = {
        color: [],
        size: [],
        price: []
      }
      asideInfo.filter_info.forEach(_ => {
        switch (_.title) {
          case 'Color':
            filter.color = _.values
            break
          case 'Size':
            filter.size = _.values
            break
          case 'Price':
            filter.price = _.values
            break
        }
      })
      asideInfo.filter_info = filter
      commit('updateAsideInfo', asideInfo)

      commit('activeSortItem', query.sort_by || getters.sortInfo.display_value)
      let categoryInfo = getters.categoryInfo
      categoryId = parseInt(query.subId) || categoryId
      let subs = categoryInfo.sub_category.map(item => {
        return {
          id: item.category_id,
          title: item.name,
          isSelected: item.category_id === categoryId
        }
      })
      commit('subMenuChange', {
        title: categoryInfo.name,
        name: categoryInfo.category_id,
        subs: subs
      })
    }
  }
})
