<template>
    <div class="club-info">
        this is componentA
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
