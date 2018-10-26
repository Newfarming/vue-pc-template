<template>
  <section class="main-container">
    <div class="main-header">
      <div class="title">Orders</div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="All" name="1"></el-tab-pane>
        <el-tab-pane label="Unfinished" name="2"></el-tab-pane>
        <el-tab-pane label="Paid" name="3"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="orders">
        <div class="order_list" v-infinite-scroll="loadMore" infinite-scroll-distance="500" :infinite-scroll-disabled="isDisabled">
          <transition-group name='list-complete' v-on:leave="leave">
            <order-item class="list-complete-item" v-for="item in orders" :key="item.orderId" :order="item"></order-item>
          </transition-group>
          <div v-loading="isLoading" style="width: 100%; height: 60px;"></div>
        </div>
    </div>
  </section>
</template>

<script>
import 'assets/css/common'
import utils from 'assets/js/utils'
import googleAnalytics from 'assets/js/google_analytics'

import OrderItem from 'components/order/OrderItem'
import infiniteScroll from 'vue-infinite-scroll'

export default {
  components: {
    OrderItem
  },
  data () {
    return {
      activeName: '1',
      orders: [],
      all: [],
      unfinished: [],
      paid: [],
      isLoading: false,
      isDisabled: false,
      page: 1,
      account: '',
      limit: 10
    }
  },
  async created () {
    let p = utils.parseQueryString()
    if (p.active) {
      this.activeName = p.active
    }
    this.$bus.$on('deleteOrder', (orderId) => {
      this.orders = this.orders.filter(item => {
        return item.orderId !== orderId
      })
      this.all = this.all.filter(item => {
        return item.orderId !== orderId
      })
      this.unfinished = this.unfinished.filter(item => {
        return item.orderId !== orderId
      })
      this.paid = this.paid.filter(item => {
        return item.orderId !== orderId
      })
    })
  },
  methods: {
    leave (el, done) {
      if (!this.orders.length) {
        el.style.transition = 'none'
      }
      done()
    },
    async loadMore () {
      if (!this.isLoading && !this.isDisabled) {
        this.isLoading = true
        this.isDisabled = true
        let orderType = parseInt(this.activeName)
        const {
          all,
          unfinished,
          paid,
          counts,
          account
        } = await this.$api.orderList({
          order_type: orderType,
          limit: this.limit,
          page: this.page
        })
        this.account = account
        this.all = this.all.concat(all)
        this.unfinished = this.unfinished.concat(unfinished)
        this.paid = this.paid.concat(paid)
        if (orderType === 1) {
          this.orders = this.all
        } else if (orderType === 2) {
          this.orders = this.unfinished
        } else {
          this.orders = this.paid
        }
        // this.orders = this.orders.concat(orderInfo)
        // 增加自定义纬度
        let productNos = this.orders.reduce((a, b) => {
          if (a.product) {
            return a.product.concat(b.product)
          }
          return a.concat(b.product)
        }, []).map(item => {
          return item.product_no
        })
        googleAnalytics.setEcommProdid(productNos)

        this.isLoading = false
        this.isDisabled = !(this.orders.length < counts)
        this.page++
      }
    }
  },
  watch: {
    async activeName (val, oldVal) {
      console.log('new', [val, oldVal])
      this.isLoading = false
      this.isDisabled = false
      this.page = 1
      switch (parseInt(val)) {
        case 1:
          this.orders = this.all
          break
        case 2:
          this.orders = this.unfinished
          break
        case 3:
          this.orders = this.paid
          break
      }
      let query = utils.parseQueryString()
      query.active = val
      window.history.replaceState({}, null, window.location.pathname + utils.encodeQueryString(query))
      if (this.orders.length > 0) {
        this.page = Math.ceil(this.orders.length / this.limit)
      } else {
        console.log('loaded')
        await this.loadMore()
      }
    }
  },
  directives: {
    infiniteScroll
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
    .el-loading-parent--relative {
      .el-loading-spinner /deep/ {
         .path {
           stroke: red;
         }
      }
    }
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
