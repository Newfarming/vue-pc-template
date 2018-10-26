<template>
  <div class="club-info">
    <div class="club-group">
      <a class="club-row" href="/views/document.html?type=factoryprice" target="_blank">
        <i class="iconfont icon-goubianyixianshizhekou"></i>
        <span>{{ $t('club_info.factory_price') }}</span>
      </a>
      <a class="club-row" href="/views/document.html?type=returnpolicy" target="_blank">
        <i class="iconfont icon-tuihuanhuo1"></i>
        <span v-html="$t('club_info.easy_return',{day:9})"></span>
      </a>
      <a class="club-row" href="/views/document.html?type=paymentprotection" target="_blank">
        <i class="iconfont icon-anquanzhifu"></i>
        <span v-html="$t('club_info.payment_protection')"></span>
      </a>
    </div>
    <div class="club-dest">
      <p class="p1">{{ $t('club_info.poster_1') }}</p>
      <p class="p2">{{ $t('club_info.poster_2') }}</p>

      <img :src="confidenceImgae" :class="{active: isToggle}">
      <div @click="onSeeMoreToggle" class="see-more">{{seeMoreText}}</div>
    </div>
  </div>
</template>

<script>
import confidence from 'assets/image/confidence.jpg'

export default {
  data () {
    return {
      confidenceImgae: confidence,
      isToggle: false
    }
  },
  methods: {
    onSeeMoreToggle () {
      this.isToggle = !this.isToggle
    }
  },
  computed: {
    seeMoreText () {
      return this.isToggle ? this.$t('club_info.see_less') : this.$t('club_info.see_more')
    }
  }
}
</script>

<style lang="scss" scoped>
  .club-info {
    margin-top: 40px;
    .club-group {
      display: flex;
      border-bottom: 1px solid $mecury;
      border-top: 1px solid $mecury;

      .club-row {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        min-height: 150px;
        color: $dove-gray;
        & + .club-row {
          border-left: 1px solid $mecury;
        }
        span {
          text-align: center;
        }
        .iconfont {
          color: $flamingo;
          &.icon-goubianyixianshizhekou {
            margin-top: -10px;
            font-size: 64px;
          }
          &.icon-tuihuanhuo1 {
            font-size: 40px;
            margin-bottom: 10px;
          }
          &.icon-anquanzhifu {
            font-size: 54px;
          }
        }
      }
    }
    .club-dest {
      text-align: center;
      margin-top: 25px;
      p {
        &.p1 {
          font-size: $xx-large;
        }
        &.p2 {
          font-size: $small;
          margin-top: 10px;
        }
      }
      img {
        max-width: 70%;
        // height: 450px;
        display: none;
        &.active {
          display: inline-block;
        }
      }

      .see-more {
        height: 40px;
        line-height: 40px;
        border-top: 1px solid $mecury;
        border-bottom: 1px solid $mecury;
        cursor: pointer;
        margin-top: 20px;
      }
    }
  }
</style>
