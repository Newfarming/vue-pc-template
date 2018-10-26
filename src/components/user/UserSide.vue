
<template>
  <div>
    <div class="title">{{name}}</div>
    <ul>
      <li v-for="(item, index) in items" :key="index" @click="item.onClick" :class="{active: item.isSelected}">{{item.title}}</li>
    </ul>
  </div>
</template>

<script>
import conf from 'assets/js/conf'
import utils from 'assets/js/utils'

export default {
  props: {
    name: {
      type: String
    }
  },
  created () {
    const {type} = utils.parseQueryString()
    switch (type) {
      case 'order':
        this.items.order.isSelected = true
        break
      case 'coupon':
        this.items.coupon.isSelected = true
        break
      case 'paymentMethod':
        this.items.paymentMethod.isSelected = true
        break
      default:
        this.items.order.isSelected = true
    }
  },
  data () {
    return {
      items: {
        order: {
          title: 'Track Orders',
          isSelected: false,
          onClick: this.trackOrder
        },
        coupon: {
          title: 'Coupon',
          isSelected: false,
          onClick: this.goCoupon
        },
        paymentMethod: {
          title: 'Payment Method',
          isSelected: false,
          onClick: this.goPayment
        },
        signout: {
          title: 'Sign Out',
          isSelected: false,
          onClick: this.logout
        }
      }
    }
  },
  methods: {
    logout () {
      this.$api.logout()
    },
    trackOrder () {
      window.location.href = `${conf.views.user}?type=order`
    },
    goCoupon () {
      window.location.href = `${conf.views.user}?type=coupon`
    },
    goPayment () {
      window.location.href = `${conf.views.user}?type=paymentMethod`
    }
  }
}
</script>

<style lang="scss" scoped>
  .title {
    font-size: $size36;
    color: $mine-shaft;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  ul {
    color: $dove-gray;
    font-size: $small;
    margin-top: 10px;
    li {
      padding-left: 18px;
      height: 30px;
      line-height: 30px;
      &:hover,
      &.active {
        color: $flamingo;
        background-color: $chardon;
        cursor: pointer;
      }
    }
  }
</style>
