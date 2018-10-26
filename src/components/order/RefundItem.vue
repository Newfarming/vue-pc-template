<template>
  <div class="refund">
    <div class="refund-top" @click="clickTop">
      <span><span class="refund-id-text">Refund ID :</span><span class="refund-id">{{refundId}}</span></span>
      <span class="plus">{{open}}</span>
    </div>
    <div class="detail" ref="detail" v-loading="loading">
      <div class="refund-detail">
        <div class="refund-info">
          <div class="refund-info-item">
            <span class="refund-info-item-label">Refund Amount :</span>
            <span class="refund-info-item-value">{{symbol}} {{refundAmount | round}}</span>
          </div>
          <div class="refund-info-item">
            <span class="refund-info-item-label">Refund Reason :</span>
            <span class="refund-info-item-value">{{refundReason}}</span>
          </div>
          <div class="refund-info-item">
            <span class="refund-info-item-label">Refund Channel :</span>
            <span class="refund-info-item-value">{{refundChannel}}</span>
          </div>
          <div class="refund-info-item" v-if="refundAccount">
            <span class="refund-info-item-label">Refund Account :</span>
            <span class="refund-info-item-value">{{refundAccount}}</span>
          </div>
        </div>
        <div class="refund-process">
          <div class="progress">
            <div class="steps" v-if="refundStatus.length">
              <div class="step" :class="isActive(0)">
                <div class="sublabel">Applied</div>
                <div class="circle" :class="isActive(0)">1</div>
                <div class="label">
                  {{refundStatus[0].date.slice(0, 10)}}
                  <br>
                  {{refundStatus[0].date.slice(11)}}
                </div>
              </div>
              <div class="line" :class="isActive(1)"></div>
              <div class="step" :class="isActive(1)">
                <div class="sublabel">Approved</div>
                <div class="circle" :class="isActive(1)">2</div>
                <div class="label">
                  {{refundStatus[1].date.slice(0, 10)}}
                  <br>
                  {{refundStatus[1].date.slice(11)}}
                </div>
              </div>
              <div class="line" :class="isActive(2)"></div>
              <div class="step" :class="isActive(2)">
                <div class="sublabel">Refunded</div>
                <div class="circle" :class="isActive(2)">3</div>
                <div class="label">
                  {{refundStatus[2].date.slice(0, 10)}}
                  <br>
                  {{refundStatus[2].date.slice(11)}}
                </div>
              </div>
            </div>
          </div>
          <div class="notice">
            ※ It usually takes 5-10 business days for the money to become available in your balance depending on the bank involved.
          </div>
        </div>
      </div>
      <div class="refund-product">
        <table>
          <tr>
            <th style="text-align: left; padding-left: 20px;">Refund Product</th>
            <th>Variants</th>
            <th>Unit Price</th>
            <th>Units</th>
            <th>Amount</th>
            <th>Refund Amount</th>
          </tr>
          <tr v-for="(product, index) in products" :key="index">
            <td style="width: 30%;">
              <div class="product">
                <div class="img" :style="{background: `url(${product.image}) no-repeat center center / 100%`}"></div>
                <div class="name">{{product.name}}</div>
              </div>
            </td>
            <td>{{product.sku}}</td>
            <td>{{symbol}}{{product.salePrice | round}}</td>
            <td>x {{product.quantity}}</td>
            <td>{{symbol}}{{product.amount | round}}</td>
            <td>{{symbol}}{{product.refundAmount | round}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'refundId', 'orderId', 'showDetail', 'token'
  ],
  data () {
    return {
      open: '+',
      refundAmount: '',
      refundReason: '',
      refundChannel: '',
      refundAccount: '',
      active: 0,
      refundStatus: [],
      symbol: '',
      loading: false,
      products: []
    }
  },
  mounted () {
    this.show(this.showDetail)
  },
  methods: {
    clickTop () {
      this.$emit('clickTop', this.refundId)
    },
    show (show) {
      if (!show) {
        this.$refs.detail.style.maxHeight = ''
        this.open = '+'
      } else {
        this.$refs.detail.style.maxHeight = '500px'
        this.open = '-'
        if (!this.refundAmount) {
          this.loading = true
          this.getDetail()
        }
      }
    },
    isActive (index) {
      return {
        active: this.active >= index
      }
    },
    async getDetail () {
      const {
        refundAmount,
        refundReason,
        refundChannel,
        refundAccount,
        refundState,
        refundStatus,
        products,
        symbol
      } = await this.$api.refundDetail(this.orderId, this.refundId, this.token)
      switch (refundState) {
        case 'Applied':
          this.active = 0
          break
        case 'Approved':
          this.active = 1
          break
        case 'Refunded':
          this.active = 2
          break
      }
      this.refundAmount = refundAmount
      this.refundReason = refundReason
      this.refundChannel = refundChannel
      this.refundAccount = refundAccount
      this.refundStatus = refundStatus
      this.products = products
      this.symbol = symbol
      this.loading = false
    }
  },
  watch: {
    showDetail (val) {
      this.show(val)
    }
  }
}
</script>

<style lang="scss" scoped>
  .refund {
    margin-bottom: 20px;
    .refund-top {
      background: #FBFBFB;
      height: 54px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;
      span {
        .refund-id-text {
          color: #333;
          font-size: $medium;
        }
        .refund-id {
          margin-left: 10px;
          color: #666;
          font-size: $small;
        }
      }
      .plus {
        color: #333;
        font-size: 20px;
      }
    }
    .detail {
      transition: all 300ms;
      height: auto;
      max-height: 0;
      overflow: hidden;
      .refund-detail {
        height: 150px;
        display: flex;
        padding: 10px 20px;
        .refund-info {
          flex: 1;
          border-right: solid 1px #999;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .refund-info-item {
            flex: 1;
            color: #333;
            display: flex;
            align-items: center;
            .refund-info-item-lable {
              font-family: PingFangSC-Semibold;
            }
            .refund-info-item-value {
              font-family: PingFangSC-Regular;
              margin-left: 10px;
            }
          }
        }
        .refund-process {
          flex: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          .notice {
            color: #999;
            font-size: 12px;
            margin-top: 10px;
          }
          .progress {
            .steps {
              display: flex;
              align-items: center;
              .line {
                height: 1px;
                width: 175px;
                background: #DFE0E1;
                &.active  {
                  background: #4C4C4B;
                }
              }
              .step {
                display: flex;
                flex-direction: column;
                align-items: center;
                color: #999;
                font-size: 14px;
                &.active  {
                  color: #333;
                }
                .circle {
                  height: 20px;
                  width: 20px;
                  background: #DFE0E1;
                  color: #fff;
                  border-radius: 100%;
                  text-align: center;
                  line-height: 20px;
                  margin: 5px;
                  &.active  {
                    background: #4C4C4B;
                  }
                }
                .label {
                  text-align: center;
                }
              }
            }
          }
        }
      }
      .refund-product {
        border: solid 1px #E5E5E5;
        table {
          width: 100%;
          color: #999;
          tr {
            th {
              font-size: $medium;
              padding: 10px 5px;
              font-weight: 600;
              font-family: PingFangSC-Regular;
            }
            td {
              text-align: center;
              font-size: $small;
              .product {
                display: flex;
                align-items: center;
                width: 390px;
                font-size: $small;
                margin: 10px 20px;
                .img {
                  border: solid 1px #999;
                  height: 80px;
                  width: 80px;
                }
                .name {
                  width: 300px;
                  text-align: left;
                  margin-left: 10px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
