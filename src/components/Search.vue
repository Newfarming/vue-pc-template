<template>
  <div class="search-bar">
    <div class="logo">
      <a href="/views/home.html">
        <img v-if="arabCountry.indexOf(code) > -1" src="../assets/image/logoArab.png" alt="Club Factory" style="width: 180px;">
        <img v-else :src="logo" alt="Club Factory">
      </a>
    </div>
    <div class="right">
      <div class="right-top">
        <div class="search" v-if="showSearch">
          <input autocomplete="off" type="text" v-model="queryString" :placeholder="$t('topbar.search_placeholder')" @keyup.enter="change(queryString)">
          <el-button slot="append" icon="el-icon-search" @click="change(queryString)"></el-button>
        </div>
        <div class="login-cart">
          <login-comp></login-comp>
          <cart-popover></cart-popover>
        </div>
      </div>
      <div class="trending-search">
        <ul>
          <li>Trending Searches:</li>
          <li>Shoes</li>
          <li>Shirts</li>
          <li>Clothing</li>
          <li>Earrings</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import utils from 'assets/js/utils'
import config from 'assets/js/conf'
import logo from 'assets/image/logo.png'

import DropDown from 'components/DropDown'
import CartPopover from 'components/CartPopover'
import LoginComp from 'components/LoginComp'

export default {
  props: {
    'showSearch': { // 是否显示搜索栏
      type: Boolean,
      default: true
    }
  },
  components: {
    DropDown,
    CartPopover,
    LoginComp
  },
  created () {
    let query = utils.parseQueryString()
    this.queryString = query.query || ''
    this.$store.commit('updateSearch', this.queryString)
    const countryCode = utils.getUserCountry()
    this.code = countryCode
    console.log('countryCode', countryCode)
  },
  data () {
    return {
      logo: logo,
      queryString: '',
      arabCountry: ['ae', 'sa', 'bh', 'qa', 'om', 'kw', 'lb'],
      code: ''
    }
  },
  methods: {
    change (value) {
      if (!value) {
        return
      }
      const searchURL = config.views.search
      if (searchURL === window.location.pathname) {
        let query = utils.parseQueryString()
        query.query = value
        window.history.pushState({}, null, window.location.pathname + utils.encodeQueryString(query))
        this.$store.commit('updateSearch', value)
      } else {
        window.location.href = config.views.search + `?query=${value}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .search-bar {
    display: flex;
    height: 85px;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid $mecury;
    .logo {
      width: 12%;
      min-width: 200px;
    }
    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      .right-top {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .search /deep/ {
          display: flex;
          flex: 1;
          input {
            height: 40px;
            flex: 1;
            outline: none;
            border: 1px solid $mecury;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            padding: 0 15px;
            font-size: $small;
            transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            &:focus {
              border-color: $flamingo;
            }
          }

          .el-button--default {
            background: $flamingo;
            color: $white;
            border-radius: 0;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            border: 1px solid $flamingo;
          }
        }
        .login-cart {
          display: flex;
          align-items: center;

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
          .cart {
            margin-left: 30px;
          }
        }
      }
      .trending-search {
        visibility: hidden;
        ul {
          display: flex;
          color: #999;
          margin-top: 5px;
          li {
            list-style: none;
            font-size: $x-small;
            padding: 0 10px;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
