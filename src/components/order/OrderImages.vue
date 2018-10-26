<template>
  <div class="images-container">
    <div class="arrow left" @click="() => {this.left++}" :style="leftArrowStyle">
      <i class="iconfont icon-qianjin-copy"></i>
    </div>
    <div class="images">
      <div :style="transition">
        <div class="image" v-for="item in data" :key="item.product_id" :style="{background: `url(${item.image_url}) no-repeat center center / 100%`}" @click="goProductDetail(item.product_template_id)"></div>
      </div>
    </div>
    <!-- 当abs(left)等于图片的张数减去4，隐藏 -->
    <div class="arrow" @click="() => {this.left--}" :style="rightArrowStyle">
      <i class="iconfont icon-qianjin"></i>
    </div>
    <div class="clear"></div>
  </div>
</template>

<script>
import conf from 'assets/js/conf'
import utils from 'assets/js/utils'

export default {
  data () {
    return {
      left: 0
    }
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    transition () {
      return {
        transition: 'all 300ms',
        transform: `translate3d(${140 * this.left}px, 0, 0)`,
        height: '130px'
      }
    },
    leftArrowStyle () {
      return {
        display: this.left === 0 ? 'none' : ''
      }
    },
    rightArrowStyle () {
      return {
        display: Math.abs(this.left) === (this.data.length - 4) || this.data.length < 4 ? 'none' : ''
      }
    }
  },
  methods: {
    goProductDetail (productId) {
      window.location.href = conf.views.productDetail + utils.encodeQueryString({ productId: productId })
    }
  }
}
</script>

<style lang="scss" scoped>
  .images-container {
    margin-top: 15px;
    .images {
      width: 560px;
      height: 130px;
      overflow-x: scroll;
      overflow-y: hidden;
      white-space: nowrap;
      float: left;
      .image {
        cursor: pointer;
        height: 130px;
        width: 130px;
        background: red;
        display: inline-block;
        margin-left: 10px;
        &:first-child {
          margin-left: 0;
        }
        &:last-child {
          background: green;
        }
      }
    }
    .arrow {
      float: left;
      height: 130px;
      width: 50px;
      border: solid 1px $dusty-gray;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        font-size: 36px;
        font-weight: 600;
        color: $dove-gray;
      }
      &.left {
        position: absolute;
        z-index: 999;
        background: $white;
      }
    }
    .clear {
      clear: both;
    }
  }
</style>
