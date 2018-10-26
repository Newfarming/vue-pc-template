<template>
  <section class="main-container">
    <div class="main-header">
      <div class="title">
        Coupon
        <div class="promo-code">
          <input type="text" v-model="promoCode">
          <button class="btn redeem-btn" @click="onRedeem" :disabled="!promoCode.length">Redeem</button>
        </div>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="Available" name="1"></el-tab-pane>
        <el-tab-pane label="Inactive" name="0"></el-tab-pane>
        <el-tab-pane label="Used" name="2"></el-tab-pane>
        <el-tab-pane label="Expired" name="3"></el-tab-pane>
      </el-tabs>
    </div>
    <transition-group tag="div" class="coupons" name='list-complete' v-on:leave="leave">
      <coupon class="list-complete-item" :class="gray" v-for="_ in coupon" :key="_.id" :coupon="_" :showSelect="false"></coupon>
    </transition-group>
  </section>
</template>

<script>
import 'assets/css/common'
import utils from 'assets/js/utils'

import Coupon from 'components/Coupon'

export default {
  components: {
    Coupon
  },
  data () {
    return {
      activeName: '1',
      coupon: [],
      used: [],
      expired: [],
      inactive: [],
      available: [],
      isLoading: false,
      isDisabled: false,
      page: 1,
      limit: 10,
      promoCode: ''
    }
  },
  async created () {
    const {
      used,
      expired,
      inactive,
      available
    } = await this.$api.getCouponList()
    this.inactive = inactive
    this.used = used
    this.expired = expired
    this.available = available
    this.coupon = this.available
    let p = utils.parseQueryString()
    if (p.active) {
      this.activeName = p.active
    }
  },
  methods: {
    leave (el, done) {
      if (!this.coupon.length) {
        el.style.transition = 'none'
      }
      done()
    },
    async onRedeem () {
      const coupon = await this.$api.getCoupon(this.promoCode)
      if (coupon.id) {
        this.$message({
          message: `You‘ve got a coupon successfully!`,
          type: 'success'
        })
        switch (coupon.state) {
          case 1:
            this.available.push(coupon)
            break
          case 0:
            this.inactive.push(coupon)
            break
          case 2: case 3:
            this.used.push(coupon)
            break
          case 4:
            this.expired.push(coupon)
            break
        }
      }
    },
    couponList (val) {
      switch (parseInt(val)) {
        case 0:
          this.coupon = this.inactive
          break
        case 1:
          this.coupon = this.available
          break
        case 2:
          this.coupon = this.used
          break
        case 3:
          this.coupon = this.expired
          break
      }
      console.log('coupon=====>>>>>>>', this.coupon)
      let query = utils.parseQueryString()
      query.active = val
      window.history.replaceState({}, null, window.location.pathname + utils.encodeQueryString(query))
    }
  },
  computed: {
    gray () {
      return this.activeName === '1' ? '' : 'gray'
    }
  },
  watch: {
    async activeName (val) {
      this.couponList(val)
    }
  }
}
</script>

<style lang="scss" scoped>
  .gray {
    filter: grayscale(100%);
  }
  .main-container {
    flex: 1;
    .coupons {
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
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
        .promo-code {
          color: #333;
          display: inline-block;
          input {
            border: none;
            outline: none;
            border: solid 1px #E5E5E5;
            width: 160px;
            height: 32px;
            box-sizing: border-box;
            padding: 10px;
          }
          .redeem-btn {
            height: 32px;
            width: 80px;
            margin-left: -10px;
            margin-top: 0px;
            font-size: 14px;
            vertical-align: -1px;
          }
        }
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
  .list-complete-item {
    transition: all 1s;
    width: 325px;
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
