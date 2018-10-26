<template>
  <div class="order-container">
    <div class="title">
      <div class="item" v-for="(item, index) in items" :key="index" :class="{hide: !item.visible}">
        <div class="item-key">{{item.key}}</div>
        <div class="item-value">{{item.value}}</div>
      </div>
    </div>
    <div class="order_detail">
      <div class="order_basic">
        <div class="order_status">{{orderState}} <span v-if="showTip" @click="tipClick">(Already Paid?)</span></div>
        <div class="expire" v-if="needExpireText">Expires in {{order.expiryDate}}</div>
        <div class="order_tracking none">
          Tracking: Click here to check delivery updates.
          <i class="iconfont icon-qianjin"></i>
          </div>
        <div class="order_other" v-if="trackRefund" @click="goTrackRefund">
          Refund: {{order.refundInfo}}
          <i class="iconfont icon-qianjin"></i>
        </div>
        <order-images :data="product"></order-images>
      </div>
      <div class="order_set">
        <button class="order_btn full" v-if="payNow" @click="paynowClick">PAY NOW</button>
        <button class="order_btn" @click="goDetail">View Order Detail</button>
        <button class="order_btn" v-if="deleteOrder" @click="deleteSingleOrder">Delete Order</button>
        <button class="order_btn green" v-if="trackOrder" @click="goTrackOrder">Track Order</button>
        <button class="order_btn red" v-if="trackRefund" @click="goTrackRefund">Track Refund</button>
      </div>
    </div>
  </div>
</template>

<script>

import OrderImages from 'components/order/OrderImages'
import conf from 'assets/js/conf'

export default {
  components: {
    OrderImages
  },
  props: {
    order: {
      type: Object
    }
  },
  created () {
    this.init()
  },
  data () {
    return {
      orderState: '',
      showTip: false,
      product: [],
      items: {
        'order_number': {
          key: 'Order Number',
          value: '',
          visible: true
        },
        'total': {
          key: 'Total',
          value: '',
          visible: true
        },
        'items': {
          key: 'Items',
          value: '',
          visible: true
        },
        'paid_date': {
          key: 'Paid Data',
          value: '',
          visible: false
        },
        'delivery': {
          key: 'Delivery',
          value: '',
          visible: false
        }
      }
    }
  },
  computed: {
    payNow () {
      let status = ['Unpaid', 'Pending', 'Failed']
      return status.indexOf(this.order.state) > -1
    },
    deleteOrder () {
      let status = ['Unpaid', 'Pending', 'Failed', 'Expired']
      return status.indexOf(this.order.state) > -1
    },
    needExpireText () {
      let status = ['Unpaid', 'Pending', 'Failed']
      return status.indexOf(this.order.state) > -1
    },
    trackOrder () {
      let status = ['Processing', 'Shipped']
      return status.indexOf(this.order.state) > -1
    },
    trackRefund () {
      return !!this.order.refundInfo
    }
  },
  methods: {
    init () {
      if (this.order.state === 'Failed') {
        this.orderState = 'Payment Failed. Try Again!'
      } else if (this.order.state === 'Pending') {
        this.orderState = 'Payment Failed. Try Again!'
        this.showTip = true
      } else {
        this.orderState = this.order.state
      }
      this.items.order_number.value = this.order.orderId
      this.items.total.value = this.order.total.toFixed(2)
      this.items.items.value = this.order.items
      if (this.order.paymentDate) {
        this.items.paid_date.value = this.order.paymentDate
        this.items.paid_date.visible = true
      }
      if (this.order.delivery) {
        this.items.delivery.value = this.order.delivery
        this.items.delivery.visible = true
      }
      this.product = this.order.product
    },
    deleteSingleOrder () {
      this.$clubConfirm(
        'Delete Order',
        'Are you sure to delete this order?',
        {
          confirmCallback: async () => {
            const {orderId, result} = await this.$api.deleteOrder(this.order.orderId)
            if (result) {
              this.$bus.$emit('deleteOrder', orderId)
            }
          },
          confirmText: 'Delete it'
        }
      )
    },
    tipClick () {
      this.$clubConfirm(
        'Already Paid?',
        'It takes 24 hours to get your payment confirmed by your bank. Please contact the customer service if your order is still unpaid after 1 day.',
        {
          cancelText: 'OK',
          showConfirm: false
        }
      )
    },
    goDetail () {
      window.location.href = `${conf.views.orderDetail}?orderId=${this.order.orderId}&type=detail`
    },
    goTrackOrder () {
      window.location.href = `${conf.views.orderDetail}?orderId=${this.order.orderId}&type=track`
    },
    goTrackRefund () {
      window.location.href = `${conf.views.orderDetail}?orderId=${this.order.orderId}&type=refund`
    },
    paynowClick () {
      window.location.href = `${conf.views.paymentPay}?orderId=${this.order.orderId}`
    }
  },
  watch: {
    order (newOrder, oldOrder) {
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
  .hide {
    visibility: hidden;
  }
  .none {
    display: none;
  }
  .order-container {
    border: solid 1px $mecury;
    width: 100%;
    margin-top: 30px;
    background: $white;
    .title {
      background: $alabaster;
      display: flex;
      padding: 10px 15px;
      .item {
        flex: 1;
        .item-key {
          color: $dusty-gray;
          font-size: $x-small;
          padding-bottom: 5px;
        }
        .item-value {
          color: $dove-gray;
          font-size: $small;
          padding-top: 5px;
        }
        &:last-child {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
      }
    }
    .order_detail {
      padding: 20px 15px;
      padding-bottom: 40px;
      display: flex;
      .order_basic {
        .order_status {
          color: $mine-shaft;
          font-size: $large;
          padding: 5px 0;
          span {
            color: #4A90E2;
            text-decoration: underline;
            cursor: pointer;
            font-size: $small;
            margin-top: 10px;
          }
        }
        .expire {
          color: $flamingo;
          font-size: $small;
          padding: 5px 0;
        }
        .order_tracking {
          font-size: $small;
          color: $green;
          padding: 5px 0;
          i {
            font-size: $x-small;
            font-weight: 600;
          }
        }
        .order_other {
          font-size: $small;
          color: $guardsman;
          padding: 5px 0;
          cursor: pointer;
          i {
            font-size: $x-small;
            font-weight: 600;
          }
        }
      }
      .order_set {
        margin-left: 30px;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        .order_btn {
          width: 245px;
          height: 52px;
          margin-top: 15px;
          background: $white;
          color: $mine-shaft;
          font-size: $medium;
          border: solid 1px $mine-shaft;
          outline: none;
          border-radius: 4px;
          cursor: pointer;
          user-select: none;

          &:active {
            opacity: 0.5;
          }
          &:disabled {
            opacity: 0.4;
          }
          &.red {
            color: $guardsman;
            border-color: $guardsman;
          }
          &.green {
            color: $green;
            border-color: $green;
          }
          &.full {
            background: $flamingo;
            border-color: $flamingo;
            color: $white;
          }
          &:first-child {
            margin-top: 0;
          }
        }
      }
    }
  }
  .el-message-box__wrapper /deep/ {
    .el-message-box {
      border: none;
      .el-message-box__header {
        text-align: center;
        background: #000;
        color: $white;
      }
    }
  }
</style>
