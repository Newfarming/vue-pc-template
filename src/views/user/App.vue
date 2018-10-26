<template>
  <fixed-header-container>
    <header-component slot="header"></header-component>
      <el-container>
        <el-aside width="200px">
          <user-side :name="account"></user-side>
        </el-aside>
        <order v-if="type === 'order'"></order>
        <coupon v-if="type === 'coupon'"></coupon>
        <payment-method v-if="type === 'paymentMethod'"></payment-method>
      </el-container>
  </fixed-header-container>
</template>

<script>
import 'assets/css/common'
import utils from 'assets/js/utils'
import conf from 'assets/js/conf'

import HeaderComponent from 'components/HeaderComponent'
import FixedHeaderContainer from 'components/FixedHeaderContainer'
import UserSide from 'components/user/UserSide'
import Order from 'components/user/Order'
import Coupon from 'components/user/Coupon'
import PaymentMethod from 'components/user/PaymentMethod'

export default {
  components: {
    HeaderComponent,
    FixedHeaderContainer,
    UserSide,
    Order,
    Coupon,
    PaymentMethod
  },
  data () {
    return {
      account: '',
      type: 'order'
    }
  },
  async created () {
    var tokenInfo = utils.getDecodeToken()
    if (!tokenInfo) {
      window.location.href = conf.views.home
    }
    console.log('enter', tokenInfo)
    this.account = tokenInfo.nickname || tokenInfo.account
    const {type} = utils.parseQueryString()
    this.type = type || 'order'
  }
}
</script>

<style lang="scss" scoped>
  .main-container {
    flex: 1;
    .orders {
      display: flex;
      justify-content: center;
    }
    .main-header {
      position: sticky;
      top: 65px;
      background: $white;
      padding: 20px;
      padding-bottom: 15px;
      z-index: 99;
      .title {
        font-size: $size36;
        color: $mine-shaft;
      }
      .el-tabs /deep/ {
        .el-tabs__content {
          margin-top: -30px;
        }
        .el-tabs__nav-wrap {
          &::after {
            height: 1px;
            background: $mecury
          }
        }
        .el-tabs__active-bar {
          background: $flamingo
        }
        .el-tabs__item {
          font-weight: 400;
          color: $mine-shaft;
          &.is-active {
            color: $flamingo
          }
        }
      }
    }
  }
  .el-aside {
    padding: 20px;
    position: sticky;
    top: 65px;
    align-self: flex-start;
    overflow-x: hidden;
  }
  .order-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .list-complete-item {
    transition: all 1s;
  }
  .list-complete-enter, .list-complete-leave-to
  /* .list-complete-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
  }
  .list-complete-leave-active {
    position: absolute;
  }

</style>
