<template>
  <section class="main-container">
    <div class="main-header">
      <div class="title">Payment Method</div>
    </div>
    <div class="list">
      <div class="card_operate">
        <div class="card-left" @click="selectAll">
          <i class="iconfont icon-xuanze" :class="allSelect"></i>
          <span>Select all ({{quickIds.length}})</span>
        </div>
        <div class="delete" :class="{active: quickIds.length}" @click="deleteCard">Delete</div>
      </div>
      <div class="card_list" v-for="(item, index) in quickpayList" :key="index" @click="selectCard(item.quickpay_id)">
        <i class="iconfont icon-xuanze" :class="{'icon-xuanzhong': quickIds.indexOf(item.quickpay_id) > -1}"></i>
        <img :src="visa" />
        <span>{{item.card_number}}</span>
      </div>
    </div>
  </section>
</template>

<script>
import oceanMx from 'assets/image/payment/ocean_mx.jpg'
import visa from 'assets/image/payment/visa_logo.jpg'

export default {
  data () {
    return {
      quickPayType: oceanMx,
      visa: visa,
      quickpayList: [],
      quickIds: []
    }
  },
  async created () {
    const { quickpayList } = await this.$api.getQuickPayCards()
    this.quickpayList = quickpayList || []
  },
  computed: {
    allSelect () {
      return {
        'icon-xuanzhong': this.quickIds.length !== 0 && this.quickIds.length === this.quickpayList.length
      }
    }
  },
  methods: {
    selectCard (quickId) {
      let index = this.quickIds.indexOf(quickId)
      if (index > -1) {
        this.quickIds.splice(index, 1)
      } else {
        this.quickIds.push(quickId)
      }
    },
    selectAll () {
      if (this.quickIds.length === this.quickpayList.length) {
        this.quickIds = []
      } else {
        this.quickIds = this.quickpayList.map(item => {
          return item.quickpay_id
        })
      }
    },
    deleteCard () {
      if (this.quickIds.length) {
        this.$clubConfirm(
          'Are you sure?',
          'you want to delete this credit card information?',
          {
            confirmCallback: async () => {
              const result = await this.$api.deleteQuickPayCards(this.quickIds)
              console.log('result', result)
              if (result) {
                this.$message({
                  message: `Delete successfully`,
                  type: 'success'
                })
                this.quickpayList = this.quickpayList.filter(item => {
                  return this.quickIds.indexOf(item.quickpay_id) === -1
                })
                this.quickIds = []
              }
            },
            confirmText: 'Yes, delete it',
            cancelText: 'Cancel'
          }
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .main-container {
    flex: 1;
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
    }
    .list {
      width: 50%;
      .card_operate {
        padding: 10px 15px;
        display: flex;
        align-items: center;
        border-top: 1px solid #f2f2f2;
        justify-content: space-between;
        background: #fbfbfb;
        color: #666666;
        .card-left {
          display: flex;
          align-items: center;
          i {
            margin-right: 10px;
            font-size: 25px;
            &.icon-xuanzhong {
              color: $flamingo;
            }
          }
        }
        .delete {
          cursor: pointer;
          &.active {
            color: $flamingo;
          }
        }
      }
      .card_list {
        padding: 10px 15px;
        display: flex;
        align-items: center;
        border-top: 1px solid #f2f2f2;
        span {
          margin-left: 20px;
        }
        img {
          width: 54px;
        }
        i {
          color: #ccc;
          font-size: 25px;
          &.icon-xuanzhong {
            color: $flamingo;
          }
        }
      }
      .payment_line {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 0 15px;
        height: 60px;
        border-top: 1px solid #f2f2f2;
        color: #333;
        background-color: #fff;
        position: relative;
        .center {
          display: flex;
          align-items: center;
          span {
            color: #666;
            font-size: 18px;
            margin: 0 10px;
            font-weight: 300;
            font-family: PingFangSC-Regular;
          }
          i {
            color: #666;
            font-size: 25px;
          }
          img {
            width: 180px;
            position: relative;
            bottom: 2px;
          }
        }
        .iconfont {
          color: #ccc;
          clear: both;
        }
        div:first-child {
          width: 100%;
        }
        p {
          margin: 0;
          font-size: 14px;
          color: #707070
        }
        i {
          font-size: 30px;
          &.icon-xuanzhong {
            color: $flamingo;
          }
        }
      }
    }
  }

</style>
