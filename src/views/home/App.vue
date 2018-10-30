<template>
  <fixed-header-container>
    <header-component class="header" slot="header"></header-component>
    123456
    <section class="content">
      <back-to-top></back-to-top>
      <carousel :carousel-items="banners" v-if="!showActivity"></carousel>
      <div class="activity" v-if="showActivity" @click="goDownload">
        <img :src="activityBanner" alt="banner">
      </div>
      <div class="products">
        <product-list></product-list>
      </div>
    </section>
  </fixed-header-container>
</template>

<script>
import 'assets/css/common'
import utils from 'assets/js/utils'

import HeaderComponent from 'components/HeaderComponent'
import Carousel from 'components/Carousel'
import ProductList from 'components/ProductList'
import FixedHeaderContainer from 'components/FixedHeaderContainer'
import BackToTop from 'components/BackToTop'
// import MyCarousel from 'components/MyCarousel'
import DiwaliBack from 'assets/image/activity/diwali_back.jpg'
import Diwali from 'assets/image/activity/diwali.jpg'
export default {
  components: {
    HeaderComponent,
    Carousel,
    ProductList,
    FixedHeaderContainer,
    BackToTop
  },
  async created () {
    const {
      AmountOff,
      ShippingFree,
      Promotion,
      Blank
    } = await this.$api.discount()
    if (AmountOff.expire_time) {
      this.discount = AmountOff.coupons
      this.countDownTime = AmountOff.expire_time
      this.countDown()
      this.showActivity = true
    } else {
      this.showActivity = false
    }
    if (ShippingFree.expire_time) {
      this.showActivity = true
    }
    if (Promotion.expire_time) {
      this.showActivity = true
      this.activityBanner = DiwaliBack
    }
    if (Blank.expire_time) {
      this.showActivity = true
      this.activityBanner = Diwali
    }
    let { banners } = await this.$api.getIndexPageInfo()
    this.banners = (banners || []).filter(item => {
      return item.url !== 'https://www.clubfactory.com/theme/20180224_earrings'
    }).splice(0, 8)
  },
  data () {
    return {
      symbol: utils.getSymbol(),
      banners: [],
      isLoading: false,
      showActivity: false,
      time: {
        day: 0,
        hour: 0,
        minute: 0,
        seconds: 0
      },
      discount: [],
      countDownTime: 0,
      activityBanner: DiwaliBack
    }
  },
  methods: {
    countDown () {
      let interval = window.setInterval(() => {
        this.time.hour = Math.floor(this.countDownTime / 3600)
        this.time.minute = Math.floor((this.countDownTime - this.time.hour * 3600) / 60)
        this.time.seconds = this.countDownTime - this.time.hour * 3600 - this.time.minute * 60
        this.time.hour = this.time.hour < 10 ? `0${this.time.hour}` : this.time.hour
        this.time.minute = this.time.minute < 10 ? `0${this.time.minute}` : this.time.minute
        this.time.seconds = this.time.seconds < 10 ? `0${this.time.seconds}` : this.time.seconds
        this.countDownTime--
        if (this.countDownTime === 0) {
          window.clearInterval(interval)
          this.showActivity = false
        }
      }, 1000)
    },
    goDownload () {
      window.open('/download_app', '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
  .content {
    .activity {
      width: 1200px;
      height: 384px;
      margin-top: 25px;
      cursor: pointer;
    }
    .promotion-activity {
      width: 100%;
      cursor: pointer;
      img {
        width: 100%;
        display: block;
      }
    }
    .products {
      display: flex;
      justify-content: center;
      max-width: 1200px;
      margin: 25px auto;
    }
  }
</style>
