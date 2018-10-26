<template>
  <div class="carousel" @mouseover="showArrow = true" @mouseout="showArrow = false">
    <button class="button left" @click="changePage('add')" :class="{'show-left': this.showArrow}">
      <i class="iconfont icon-qianjin-copy"></i>
    </button>
    <button class="button right" @click="changePage('del')" :class="{'show-right': this.showArrow}">
      <i class="iconfont icon-qianjin"></i>
    </button>
    <div class="carousel-item" v-for="item in banners" :key="item.url" :style="item.style" @transitionend="transitionend"></div>
    <div class="dots">
      <div class="dot" :class="{active: page === item.page}" v-for="item in banners" :key="item.url" @mouseover="changePage(item.page)" @click="changePage(item.page)"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      banner: [{
        page: 0,
        url: 'https://d3kpm7yklociqe.cloudfront.net/ext/theme/20180408_push_weddings/banner.jpg'
      }, {
        page: 1,
        url: 'https://d3kpm7yklociqe.cloudfront.net/ext/theme/april/editors_picks20180404.jpg'
      }, {
        page: 2,
        url: 'https://d3kpm7yklociqe.cloudfront.net/ext/theme/20180411_men_bags/banner.jpg'
      }],
      circleArr: [0, 100, -100],
      page: 0,
      showArrow: false,
      canAnimate: true
    }
  },
  computed: {
    banners () {
      // let length = this.banner.length
      // let half = Math.floor(length / 2)
      let banners = this.banner.map((item, index) => {
        // let i = index
        // /**
        //  * 2张 0 100%
        //  * 3张 0 100% -100%
        //  * 4张 0 100% 200% -100%
        //  * 5张 0 100% 200% -200% -100%
        //  * 6张 0 100% 200% 300% -200% -100%
        //  * 7张 0 100% 200% 300% -300% -200% -100%
        //  */
        // 0,1,2  ======>>>>>>>> -1 eq 2 , -2 eq 1, -3 eq 0, 3 eq 0
        // Math.abs(index % length)
        // if (index > half) {
        //   i = index - length
        // }
        item.style = {
          background: `url(${item.url}) no-repeat center center / 100%`,
          transform: `translate3d(${(this.circleArr[index])}%, 0, 0)`
        }
        if (this.circleArr[index] === 0 || item.show) {
          item.style.zIndex = 9999
        } else {
          item.style.transition = ''
        }
        if (this.circleArr[index] < 0) {
          item.style.transition = ''
        }
        item.show = this.circleArr[index] === 0
        return item
      })
      console.log('banners', banners)
      return banners
    }
  },
  methods: {
    init () {

    },
    changePage (event) {
      if (this.canAnimate) {
        if (event === 'add') {
          this.page++
        } else if (event === 'del') {
          this.page--
        } else {
          this.page = event
        }
      }
    },
    turn (distance) {
      console.log('dids', distance)
      if (distance > 0) {
        this.circleArr = this.circleArr.concat(this.circleArr.splice(0, distance))
      } else {
        this.circleArr = this.circleArr.splice(this.circleArr.length - Math.abs(distance), Math.abs(distance)).concat(this.circleArr)
      }
      console.log('circleArr', this.circleArr)
    },
    transitionend () {
      if (!this.canAnimate) {
        this.canAnimate = true
      }
    }
  },
  watch: {
    page (newPage, oldPage) {
      if (this.canAnimate) {
        this.turn(newPage - oldPage)
        this.canAnimate = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .carousel {
    height: 380px;
    position: relative;
    overflow: hidden;
    .button {
      border: none;
      outline: 0;
      padding: 0;
      margin: 0;
      height: 36px;
      width: 36px;
      cursor: pointer;
      transition: .3s;
      border-radius: 50%;
      background-color: #fff;
      color: #333;
      position: absolute;
      top: 50%;
      z-index: 10;
      transform: translateY(-50%);
      text-align: center;
      font-size: 12px;
      opacity: 0;
      z-index: 99999;
      &.show-left {
        transform: translate3d(16px, -50%, 0);
        opacity: 1;
      }
      &.show-right {
        transform: translate3d(-16px, -50%, 0);
        opacity: 1;
      }
      &.left {
        left: 0;
      }
      &.right {
        right: 0;
      }
    }
    .carousel-item {
      height: 380px;
      width: 100%;
      background: red;
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      transition: transform .4s ease-in-out,-webkit-transform .4s ease-in-out;
    }
    .dots {
      position: absolute;
      bottom: 10px;
      z-index: 99999;
      margin: auto;
      left: 50%;
      transform: translateX(-50%);
      .dot {
        opacity: .48;
        width: 30px;
        height: 2px;
        background-color: #fff;
        cursor: pointer;
        transition: .3s;
        display: inline-block;
        margin-left: 10px;
        &:first-child {
          margin-left: 0;
        }
        &.active {
          opacity: 1;
        }
      }
    }
  }
</style>
