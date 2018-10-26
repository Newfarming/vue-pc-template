<template>
  <div class="comments">
    <div class="comments-summary">
      <div class="comments-total">{{rateScore}}/5</div>
      <div class="comments-rates">
        <span class="comments-rates-text">{{satisfiedLevel[Math.round(rateScore) - 1]}}</span>
        <el-rate class="comments-rate-star" v-model="rateScore" disabled></el-rate>
        <span class="comments-rates-num">{{rateNum}} Ratings</span>
      </div>
    </div>
    <comment-item v-for="comment in comments" :key="comment.id" :comment="comment"></comment-item>
    <div @click="onSeeMoreToggle" class="see-more" v-if="showSeeMore">See More</div>
  </div>
</template>

<script>
import CommentItem from './CommentItem'
import conf from 'assets/js/conf'
import utils from 'assets/js/utils'

export default {
  components: {
    CommentItem
  },
  props: {
    comments: {
      type: Array,
      default: () => {
        return []
      }
    },
    showSeeMore: {
      type: Boolean,
      default: true
    },
    rateScore: {
      default: 0
    },
    rateNum: {
      default: ''
    }
  },
  data () {
    return {
      isToggle: false,
      satisfiedLevel: ['Very Dissatisfied', 'Dissatisfied', 'Average', 'Somewhat Satisfied', 'Satisfied']
    }
  },
  methods: {
    onSeeMoreToggle () {
      let query = utils.parseQueryString()
      window.open(conf.views.productReviews + utils.encodeQueryString(query))
    },
    loadMore () {
      console.log('loadmore')
    }
  }
}
</script>

<style lang="scss" scoped>
  .comments {
    .comments-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      border-bottom: solid 1px #e5e5e5;
      color: #333;
      .comments-total {
        font-size: 36px;
        font-family: PingFangSC-Semibold;
      }
      .comments-rates {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        .comments-rates-num {
          color: #999;
        }
        .comments-rate-star {
          margin: 0 10px;
        }
      }
    }
    .more-comments {
      display: none;
      &.toggle {
        display: block;
        border-top: 1px solid $mecury;
        margin-top: 20px;
      }
    }
    .see-more {
      height: 40px;
      line-height: 40px;
      margin-top: 20px;
      text-align: center;
      border-top: 1px solid $mecury;
      border-bottom: 1px solid $mecury;
      cursor: pointer;
    }
  }
</style>
