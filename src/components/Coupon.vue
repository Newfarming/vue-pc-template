<template>
  <div class="coupon">
    <div class="coupon-item">
      <div class="coupon-detail">
        <span class="coupon-price">{{coupon.des}}</span>
        <span class="coupon-date">{{coupon.start}} - {{coupon.end}}</span>
      </div>
      <div class="coupon-des">All categories eligible（Excluding certain campaign items</div>
      <i v-if="showSelect" class="iconfont icon-xuanze" :class="{'icon-xuanzhong': couponId === coupon.id}" @click="selectCouponId"></i>
    </div>
    <div class="pipe">
      <div class="circle left"></div>
      <div class="dash"></div>
      <div class="circle right"></div>
    </div>
    <div class="notice" ref="notice" v-if="coupon.terms.length">
      Notice: <br>
      <span v-for="item in coupon.terms" :key="item">
        {{item}} <br>
      </span>
      <i ref="tri" class="iconfont icon-xiala" @click="showMore"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'coupon', 'couponId', 'symbol', 'showSelect'
  ],
  data () {
    return {
      select: false
    }
  },
  methods: {
    showMore () {
      if (this.$refs.notice.style.maxHeight) {
        this.$refs.notice.style.maxHeight = ''
        this.$refs.tri.style.transform = ''
      } else {
        this.$refs.notice.style.maxHeight = '100px'
        this.$refs.tri.style.transform = 'rotate(-180deg)'
      }
    },
    selectCouponId () {
      this.$emit('onChange', this.coupon)
    }
  }
}
</script>

<style lang="scss" scoped>
$circleHeight: 15px;
.coupon {
  margin: 10px 4px;
  .coupon-item {
    border: solid 1px $flamingo;
    border-bottom: none;
    background: #FFFBE9;
    position: relative;
    padding: 10px 15px;
    .coupon-detail {
      display: flex;
      justify-content: space-between;
      padding-bottom: 5px;
      margin-right: 13px;
      .coupon-price {
        color: $flamingo;
        font-size: 18px;
        span {
          font-size: 36px;
        }
      }
      .coupon-date {
        color: #FF9400;
        font-size: 14px;
        display: flex;
        align-items: flex-end;
        margin-bottom: 5px;
      }
    }
    .coupon-des {
      color: #A17B45;
      font-size: 12px;
    }
    i {
      font-size: 22px;
      color: $flamingo;
      position: absolute;
      right: 3px;
      top: 3px;
      cursor: pointer;
      background: $white;
      border-radius: 100%;
    }
  }
  .pipe {
    height: $circleHeight;
    width: 100%;
    position: relative;
    overflow: hidden;
    background: $white;
    * {
      box-sizing: border-box;
    }
    .circle {
      border: solid 1px $flamingo;
      border-radius: 100%;
      height: $circleHeight;
      width: $circleHeight;
      position: absolute;
      z-index: 999;
      background: $white;
    }
    .left {
      left: -$circleHeight / 2;
    }
    .right {
      right: -$circleHeight / 2;
    }
    .dash {
      border-bottom: dashed 1px $flamingo;
      height: $circleHeight / 2;
      position: absolute;
      width: 100%;
      background: #FFFBE9;
    }
  }
  .notice {
    border: solid 1px $flamingo;
    border-top: none;
    font-size: 12px;
    color: #D0AF73;
    padding: 0 15px 10px 15px;
    line-height: 18px;
    overflow: hidden;
    transition: all 500ms;
    max-height: 26px;
    position: relative;
    background: $white;
    i {
      position: absolute;
      right: 5px;
      top: 7px;
      font-size: 14px;
      font-weight: 600;
      transition: all 300ms;
      cursor: pointer;
    }
  }
}
</style>
