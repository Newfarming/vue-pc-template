<template>
  <fixed-header-container>
    <header-component slot="header"></header-component>
    <el-container>
      <el-main>
        <div class="breadcrumb hide">Account/Order/{{orderId}}</div>
        <div class="order_status" :style="top.style">
          <div class="flex">
            <i class="iconfont" :class="top.icon"></i>
            <div class="status">
              <div class="name">{{top.title}}</div>
              <div class="sub-title">{{top.subTitle}}</div>
              <div class="sub-sub-title">{{top.subSubTitle}}</div>
              <div class="tip" @click="tipClick">{{top.tip}}</div>
            </div>
            <div class="order_btn" v-if="top.button">
              <button class="btn pay_now" @click="paynowClick">{{ $t('order.pay_now') }}</button>
              <button class="btn delete" @click="deleteClick">{{ $t('order.delete_order') }}</button>
            </div>
          </div>
          <div v-if="this.orderDetail['Payment Method'] === 'Cash on Delivery' && top.title === 'Processing'">
            <p>Your COD order is waiting to be verified.</p>
            <p>We will call you within 24 hours of purchase for additional information to verify your order. </p>
            <p>After three attempts, you order will be canceled. </p>
          </div>
          <div v-if="this.orderDetail['Payment Method'] === 'Cash on Delivery' && top.title === 'Shipped'">
            <p>The courier will make a maximum of 3 attempts to deliver your order. </p>
            <p>If you don't accept delivery or cancel the order, </p>
            <p>you will be BLACKLISTED and lose COD option on other ecommerce sites.</p>
          </div>
        </div>
        <div class="order_info">
          <div class="top">
            <span>{{ $t('order.order_number') }}: {{orderId}}</span>
            <span v-if="virtualSellerInfo.name" class="seller_name"><img :src="iconStore" alt="" class="icon_store">{{virtualSellerInfo.name}}</span>
          </div>
          <div class="detail">
            <div class="item" v-for="(value, key) in orderDetail" :key="key" v-if="value">
              <div class="title">{{key}}</div>
              <div class="content" v-if="key === 'Address'" style="line-height: 18px;">
                {{ value.street }} ,<br>
                  {{ `${value.state},${value.city}` }} ,<br>
                  {{ value.country }} ,<br>
                  {{ value.zipcode }} <br>
                  {{ `Phone Number: ${value.phone}` }} <br>
                  {{ `Email: ${value.email}` }}
                </div>
                <div class="content" v-else-if="typeof value === 'string'">
                  {{value}}
                </div>
                <div class="content" v-else style="max-width: 300px;">
                  <div class="subitem" v-for="item in value" :key="item.label">
                    <div class="subitem-title">{{item.label}}:</div>
                    <div class="subitem-content">{{item.price !== 'Free' ? symbol : ''}}{{item.price | round}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <el-tabs v-model="activeName">
            <el-tab-pane :label="$t('order.order_detail')" name="Order Details">
              <table>
                <tbody>
                  <tr v-for="(data, index) in tableData" :key="index" @click="goProductDetail(data)">
                    <th width="360">
                      <div class="product">
                        <div class="product_img" :style="{background: `url(${data.image}) no-repeat center center / 100%`}"></div>
                        <div class="product_name">{{data.name}}</div>
                      </div>
                    </th>
                    <th>
                      {{data.sku}}
                    </th>
                    <th>
                      {{`${symbol} ${data.salePrice.toFixed(2)}`}}
                    </th>
                    <th>
                      {{`x ${data.quantity}`}}
                    </th>
                    <th>
                      {{`${symbol} ${data.amount.toFixed(2)}`}}
                    </th>
                  </tr>
                </tbody>
              </table>
              <!-- <el-table
                @row-click="goProductDetail"
                :show-header="false"
                :data="tableData"
                style="width: 100%">
                <el-table-column
                  prop="date"
                  label="Product"
                  width="360">
                  <template slot-scope="scope">
                    <div class="product">
                      <div class="product_img" :style="{background: `url(${scope.row.image}) no-repeat center center / 100%`}"></div>
                      <div class="product_name">{{scope.row.name}}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="sku"
                  label="Variants">
                </el-table-column>
                <el-table-column
                  prop="price"
                  label="Unit Price">
                  <template slot-scope="scope">
                    <span>{{`${symbol} ${scope.row.salePrice.toFixed(2)}`}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="quantity"
                  label="Units">
                  <template slot-scope="scope">
                    <span>{{`x ${scope.row.quantity}`}}</span>
                  </template>
                </el-table-column>
                <div style="height: 10px; width: 100%; background: red;"></div>
                <el-table-column
                  prop="amount"
                  label="Amount">
                  <template slot-scope="scope">
                    <span>{{`${symbol} ${scope.row.amount.toFixed(2)}`}}</span>
                  </template>
                </el-table-column>
              </el-table> -->
              <div class="warning hide">Sorry, 1 item(s) are unavailable. Please check the refund information in refund.</div>
            </el-tab-pane>
            <el-tab-pane label="Tracking" name="Tracking" v-if="trackInfos.length">
              <div v-loading="false" style="min-height: 70px;">
                <deliver-item v-for="(item, index) in trackInfos" :key="index" :index="index" :deliver="item" @clickTop="clickTrackTop" :showDetail="index === trackId"></deliver-item>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Refund" name="Refund" v-if="refundList.length">
              <refund-item v-for="(item, key) in refundList" :key="key" :refundId="item.refundId" :orderId="orderId" @clickTop="clickRefundTop" :showDetail="item.refundId === refundId" :token="token"></refund-item>
            </el-tab-pane>
          </el-tabs>
          <div class="downloadApp" v-show="downloadAppBlock">
            <div class="center">
              <div class="icon">
                <img src="../../../assets/image/appLogo.png" />
              </div>
                <div class="text">
                  <p class="p1">Please download our app for easy return</p>
                  <p class="p2">(Account > Find My Order > Apply for Return)</p>
                </div>
                <button class="button" @click="downloadApp">
                  DOWNLOAD
                </button>
                <div class="close" @click="downloadAppBlock = false">
                  <span class="closeIcon el-icon-close"></span>
                </div>
              </div>
            </div>
      </el-main>
    </el-container>
  </fixed-header-container>
</template>

<script>

import 'assets/css/common'
import conf from 'assets/js/conf'
import utils from 'assets/js/utils'
import iconStore from 'assets/image/icon_store.png'
import HeaderComponent from 'components/HeaderComponent'
import FixedHeaderContainer from 'components/FixedHeaderContainer'
import OrderItem from 'components/order/OrderItem'
import RefundItem from 'components/order/RefundItem'
import DeliverItem from 'components/order/DeliverItem'

export default {
  components: {
    HeaderComponent,
    FixedHeaderContainer,
    OrderItem,
    RefundItem,
    DeliverItem
  },
  async created () {
    let {
      orderId,
      type,
      token
    } = utils.parseQueryString()
    switch (type) {
      case 'detail':
        this.activeName = 'Order Details'
        break
      case 'track':
        this.activeName = 'Tracking'
        break
      case 'refund':
        this.activeName = 'Refund'
        break
      default:
        this.activeName = 'Order Details'
        break
    }
    const {
      address,
      summary,
      state,
      products,
      paidDate,
      patmentMethod,
      expiryString,
      arriveDate,
      symbol,
      deliveryInfo,
      virtualSellerInfo
    } = await this.$api.getOrderDetail(orderId, token)
    this.tableData = products
    console.log('tableData', this.tableData)
    this.symbol = symbol
    console.log('summary', summary)
    this.virtualSellerInfo = virtualSellerInfo
    this.orderDetail['Order Summary'] = summary
    this.orderDetail['Paid Date'] = paidDate
    this.orderDetail['Address'] = address
    this.orderDetail['Payment Method'] = patmentMethod === 'cod' ? 'Cash on Delivery' : patmentMethod
    this.orderDetail['Paid Date'] = paidDate
    this.orderDetail['Courier'] = deliveryInfo.delivery_name
    this.topVal.forEach(item => {
      if (item.state === state) {
        this.top = item
        if (item && item.subTitle) {
          if (item.subTitle.indexOf('Expires') > -1) {
            this.top.subTitle = `${item.subTitle}${expiryString}`
          } else if (item.subTitle.indexOf('Estimated') > -1) {
            this.top.subTitle = `${item.subTitle}${arriveDate}`
          } else {
            this.top.subTitle = ''
          }
        }
      }
    })
    this.state = state
    this.orderId = orderId
    this.expiryString = expiryString
    this.token = token
    this.getRefundList()
    this.getTrackShip()
  },
  data () {
    return {
      iconStore: iconStore,
      virtualSellerInfo: {},
      expiryString: '',
      orderId: '',
      state: '',
      symbol: utils.getSymbol(),
      activeName: 'Tracking',
      tableData: [],
      orderDetail: {
        'Order Summary': {},
        'Paid Date': '',
        'Address': '',
        'Payment Method': '',
        'Courier': ''
      },
      top: {},
      topVal: [{
        icon: 'icon-daifukuan1',
        state: 'Unpaid',
        title: this.$t('order.state.unpaid.title'),
        subTitle: this.$t('order.state.unpaid.expire_after'),
        subSubTitle: this.$t('order.state.unpaid.tip'),
        button: true
      }, {
        icon: 'icon-daifukuan1',
        state: 'Failed',
        title: this.$t('order.state.failed.title'),
        subTitle: this.$t('order.state.failed.expire_after'),
        subSubTitle: this.$t('order.state.failed.tip'),
        button: true
      }, {
        icon: 'icon-daifukuan1',
        state: 'Pending',
        title: this.$t('order.state.pending.title'),
        subTitle: this.$t('order.state.pending.expire_after'),
        subSubTitle: this.$t('order.state.pending.tip'),
        tip: `(${this.$t('order.already_paid')})`,
        button: true
      }, {
        icon: 'icon-daifukuan1',
        state: 'Expired',
        title: this.$t('order.state.expired.title'),
        style: {
          borderColor: '#999',
          background: '#f2f2f2',
          color: '#999'
        }
      }, {
        icon: 'icon-Ankerwebicon-',
        state: 'Processing',
        title: this.$t('order.state.processing.title'),
        subTitle: this.$t('order.state.processing.tip')
      }, {
        icon: 'icon-daifahuo',
        state: 'Shipped',
        title: this.$t('order.state.shipped.title'),
        subTitle: this.$t('order.state.shipped.tip')
      }, {
        icon: 'icon-daifukuan1',
        state: 'Canceled',
        title: this.$t('order.state.canceled.title'),
        style: {
          borderColor: '#999',
          background: '#f2f2f2',
          color: '#999'
        }
      }],
      refundList: [],
      refundId: '',
      trackInfos: [],
      trackId: '',
      downloadAppBlock: true
    }
  },
  methods: {
    clickTrackTop (index) {
      if (this.trackId === index) {
        this.trackId = ''
      } else {
        this.trackId = index
      }
    },
    clickRefundTop (refundId) {
      if (this.refundId === refundId) {
        this.refundId = ''
      } else {
        this.refundId = refundId
      }
    },
    async getRefundList () {
      const refunds = await this.$api.refundList(this.orderId, this.token)
      this.refundList = refunds
      this.refundId = refunds.length ? refunds[0].refundId : ''
    },
    async getTrackShip () {
      const { trackInfos } = await this.$api.trackShip(this.orderId, this.token)
      this.trackInfos = trackInfos
      this.trackId = trackInfos.length ? 0 : ''
    },
    tipClick () {
      this.$clubConfirm(
        this.$t('alert.already_paid.tile'),
        this.$t('alert.already_paid.message'),
        {
          cancelText: this.$t('alert.already_paid.btn_cancel'),
          showConfirm: false
        }
      )
    },
    paynowClick () {
      window.location.href = `${conf.views.paymentPay}?orderId=${this.orderId}`
    },
    deleteClick () {
      this.$clubConfirm(
        this.$t('alert.delete_order.title'),
        this.$t('alert.delete_order.message'),
        {
          confirmCallback: async () => {
            const { result } = await this.$api.deleteOrder(this.orderId)
            if (result) {
              window.location.href = `${conf.views.user}?type=order`
            }
          },
          confirmText: this.$t('alert.delete_order.btn_confirm')
        }
      )
    },
    goProductDetail (row) {
      window.location.href = conf.views.productDetail + utils.encodeQueryString({ productId: row.productId })
    },
    downloadApp () {
      window.open('https://www.clubfactory.com/download_app/')
    }
  },
  watch: {
    activeName (val) {
      let type = 'detail'
      switch (val) {
        case 'Order Details':
          type = 'detail'
          break
        case 'Tracking':
          type = 'track'
          break
        case 'Refund':
          type = 'refund'
          break
        default:
          type = 'detail'
          break
      }
      let query = utils.parseQueryString()
      query.type = type
      window.history.replaceState({}, null, window.location.pathname + utils.encodeQueryString(query))
    }
  }
}
</script>

<style lang="scss" scoped>
  .breadcrumb {
    color: $dusty-gray;
    font-size: $small;
  }
  .order_status {
    font-family: PingFangSC-Regular;
    width: 100%;
    padding: 20px 0;
    border: solid 1px $flamingo;
    color: $flamingo;
    background: $sauvignon;
    margin-top: 20px;
    text-align: center;
    p {
      line-height: 24px;
      font-size: 18px;
    }
    .flex {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 15px 0;
      text-align: left;
      i {
        font-weight: 400;
        font-size: 80px;
      }
      .status {
        margin-left: 20px;
        .name {
          font-size: $xxx-large;
          font-weight: 500;
          margin-bottom: 5px;
        }
        .sub-title {
          font-size: $large;
        }
        .sub-sub-title {
          font-size: $small;
          margin-top: 10px;
        }
        .tip {
          color: #4a90e2;
          text-decoration: underline;
          cursor: pointer;
          font-size: $small;
          margin-top: 10px;
        }
      }
    }
    .order_btn {
      margin-left: 50px;
      display: flex;
      flex-direction: column;
      .pay_now {
        background: $flamingo;
        color: $white;
        width: 245px;
        height: 52px;
      }
      .delete {
        color: $dove-gray;
        background: rgba(0, 0, 0, 0);
        border: none;
        margin-top: 0;
      }
    }
  }
  .order_info {
    border: solid 1px $mecury;
    color: $dove-gray;
    font-size: $small;
    margin-top: 20px;
    .top {
      border-bottom: solid 1px $mecury;
      padding: 15px;
    }
    .detail {
      display: flex;
      padding: 15px;
      .item {
        flex: 1;
        .title {
          font-size: $medium;
          color: $mine-shaft;
        }
        .content {
          margin-top: 10px;
          .subitem {
            margin-top: 10px;
            .subitem-title {
              width: 50%;
              display: inline-block;
            }
            .subitem-content {
              width: 40%;
              display: inline-block;
            }
          }
        }
      }
    }
  }
  .el-tabs /deep/ {
    margin-top: 20px;
    .el-tabs__nav-wrap {
      &::after {
        height: 1px;
        background: $mecury;
      }
    }
    .el-tabs__active-bar {
      background: $flamingo;
    }
    .el-tabs__item {
      font-weight: 400;
      color: $mine-shaft;
      &.is-active {
        color: $flamingo;
      }
    }
  }
  table {
    width: 100%;
    font-size: 14px;
    color: #606266;
    border-collapse: collapse;
    table-layout: fixed;
    font-family: PingFangSC-Regular;
    tr {
      border-bottom: solid 1px #ebeef6;
      height: 48px;
      cursor: pointer;
      &:hover {
        background: #fafafa;
      }
      td {
        padding-left: 10px;
      }
    }
  }
  // .el-table /deep/ {
  //   thead {
  //     color: $mine-shaft;
  //     font-size: $medium;
  //   }
  //   td {
  //     border: none;
  //     .cell {
  //       color: $dove-gray;
  //       font-size: $small;
  //     }
  //   }
  //   th {
  //     .cell {
  //       font-family: PingFangSC-Semibold;
  //       font-weight: 200;
  //     }
  //     border: none;
  //   }
  .product {
    display: flex;
    align-items: center;
    .product_img {
      height: 80px;
      width: 80px;
    }
    .product_name {
      font-size: $small;
      color: $dove-gray;
      font-family: PingFangSC-Regular;
      width: 230px;
      word-break: break-all;
      margin-left: 15px;
    }
  }
  // }
  .el-table::before {
    height: 0;
  }
  .warning {
    color: $guardsman;
    background: $vista;
    font-size: $small;
    padding: 7px 15px;
  }
  .hide {
    display: none;
  }
  .downloadApp {
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: #fbfbfb;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    .center {
      position: relative;
      padding: 0 200px;
      display: flex;
      align-items: center;
      .icon {
        > img {
          width: 40px;
          height: 40px;
        }
      }
      .text {
        min-width: 300px;
        margin: 0 20px;
        .p2 {
          font-size: 14px;
          color: #999999;
          font-family: PingFangSC-Regular;
        }
      }
      .button {
        border: 1px solid red;
        border-radius: 5px;
        background-color: white;
        color: red;
        font-size: 14px;
        padding: 10px;
      }
      .close {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 40px;
        .closeIcon {
          display: inline-block;
          width: 30px;
          height: 30px;
          margin: auto;
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          font-size: 30px;
          color: #bbbbbb;
          font-weight: 100;
        }
      }
    }
  }
  .seller_name {
    float: right;
    vertical-align: middle;
    position: relative;
    top: -8px;
    margin-right: 24px;
    .icon_store {
      width: 22px;
      position: relative;
      top: 4px;
      margin-right: 5px;
    }
  }
</style>
