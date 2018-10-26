<template>
  <div class="comment-item">
    <div class="comment-info">
      <div class="comment-user">
        <div class="comment-avatar">{{comment.username.slice(0, 1).toUpperCase()}}</div>
        <span class="comment-name">{{comment.username}}</span>
      </div>
      <div class="comment-rate">
        <div class="comment-rate-text">{{satisfiedLevel[Math.round(comment.rating) - 1]}}</div>
        <el-rate v-model="comment.rating" disabled></el-rate>
      </div>
    </div>
    <div class="comment-time">
      <span>{{new Date(comment.time).toLocaleString()}}</span>
      <span class="comment-sku">{{comment.sku}}</span>
    </div>
    <p class="comment-content">{{comment.comment.substr(0, 300)}}</p>
    <comment-images :images="comment.images"></comment-images>
  </div>
</template>

<script>
import CommentImages from './CommentImages'

export default {
  components: {
    CommentImages
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      satisfiedLevel: ['Very Dissatisfied', 'Dissatisfied', 'Average', 'Somewhat Satisfied', 'Satisfied']
    }
  }
}
</script>

<style lang="scss" scoped>
  .comment-item /deep/ {
    font-size: $small;
    padding-top: 10px;
    & + .comment-item {
      margin-top: 20px;
      border-top: 1px solid $mecury;
    }
    .comment-info {
      display: flex;
      justify-content: space-between;
      .comment-user {
        display: flex;
        align-items: center;
        .comment-avatar {
          background: #F9A196;
          height: 26px;
          width: 26px;
          border-radius: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        .comment-name {
          font-size: $medium;
          margin-left: 10px;
        }
      }
      .comment-rate {
        display: flex;
        align-items: center;
        .comment-rate-text {
          color: #999;
          font-size: 12px;
          margin-right: 10px;
        }
      }
    }
    .comment-time {
      color: $dusty-gray;
      margin: 10px 0;
      font-family: PingFangSC-Regular;
      .comment-sku {
        margin-left: 10px;
      }
    }
    .comment-content {
      color: #666;
      font-size: 14px;
      line-height: 20px;
    }
    .el-rate__icon {
      font-size: $small;
      margin-right: 2px;
    }
  }
</style>
