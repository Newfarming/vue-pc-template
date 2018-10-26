<template>
  <div class="comment-images-container">
    <div class="comment-images">
      <div class="image" v-for="(image, i) in images" :class="{active: i === index}" :key="i" @click="chooseImage(i)" :style="{background: `url(${shrinkImg(image, '100x100')}) no-repeat center center / 100%`}"></div>
    </div>
    <div class="preview-image" v-if="index > -1" :style="rotateContainer">
      <img ref="preview" class="preview" :src="shrinkImg(images[index], '500x500')" alt="comment-preview-image" :style="rotateStyle">
      <div class="left-rotate" @click="rotate(-1)">
        <i class="iconfont icon-zhongbo-m"></i>
        <span>left</span>
      </div>
      <div class="right-rotate" @click="rotate(1)">
        <i class="iconfont icon-zhongbo-m"></i>
        <span>right</span>
      </div>
      <div class="preview-mask">
        <div class="preview-pre" @click="chooseImage(index - 1)" v-if="index !== 0"></div>
        <div class="preview-shrink" @click="chooseImage(-1)"></div>
        <div class="preview-next" @click="chooseImage(index + 1)" v-if="index !== (images.length - 1)"></div>
      </div>
    </div>
    <div class="clear"></div>
  </div>
</template>

<script>
export default {
  props: [
    'images'
  ],
  data () {
    return {
      index: -1,
      rotateDeg: 0,
      rotateStyle: {},
      rotateContainer: {}
    }
  },
  methods: {
    shrinkImg (img, size) {
      let splitBydot = img.split('.')
      let suffix = splitBydot[splitBydot.length - 1]
      return img.replace(`.${suffix}`, `_${size}.${suffix}`)
    },
    chooseImage (index) {
      if (this.index !== index) {
        this.rotateDeg = 0
        this.rotateStyle = {}
        this.rotateContainer = {}
      }
      this.index = index
    },
    rotate (count) {
      this.rotateDeg = this.rotateDeg + count
      if (Math.abs(this.rotateDeg % 2)) {
        let height = this.$refs.preview.height
        let width = this.$refs.preview.width
        this.rotateStyle = {
          marginLeft: `${(height - width) / 2}px`,
          marginTop: `${(width - height) / 2}px`,
          transform: `rotate(${90 * this.rotateDeg}deg)`
        }
        this.rotateContainer = {
          height: `${width}px`,
          width: `${height}px`
        }
      } else {
        this.rotateStyle = {
          transform: `rotate(${90 * this.rotateDeg}deg)`
        }
        this.rotateContainer = {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-images-container{
  .comment-images {
    display: flex;
    margin-top: 10px;
    .image {
      height: 80px;
      width: 80px;
      margin-right: 15px;
      border: solid 1px #e2e2e2;
      cursor: url('../../assets/image/cursor/amplifier.ico'), default;
      &.active {
        border: solid 2px $flamingo;
      }
    }
  }
  .preview-image {
    margin-top: 20px;
    position: relative;
    float: left;
    img {
      border: solid 1px #e5e5e5;
      max-width: 350px;
      max-height: 458px;
      transition: all 300ms;
    }
    .left-rotate {
      width: 55px;
      height: 26px;
      border-radius: 5px;
      background: rgba($color: #000000, $alpha: 0.5);
      top: 5px;
      left: 5px;
      position: absolute;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      z-index: 9;
      user-select: none;
      span {
        margin-left: 5px;
      }
      i {
        transform: scaleX(-1);
      }
    }
    .right-rotate{
      left: 65px;
      top: 5px;
      width: 55px;
      height: 26px;
      border-radius: 5px;
      background: rgba($color: #000000, $alpha: 0.5);
      position: absolute;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      z-index: 9;
      user-select: none;
      span {
        margin-left: 5px;
      }
    }
    .preview-mask {
      display: flex;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      .preview-pre {
        cursor: url('../../assets/image/cursor/left.png'), default;
        flex: 1
      }
      .preview-next {
        cursor: url('../../assets/image/cursor/right.png'), default;
        flex: 1
      }
      .preview-shrink {
        cursor: url('../../assets/image/cursor/shrink.ico'), default;
        flex: 2
      }
    }
  }
  .clear {
    clear: both;
  }
}
</style>
