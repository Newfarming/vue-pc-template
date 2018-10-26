<template>
  <div class="product-preview">
    <el-tabs tab-position="left" style="height: 420px;">
      <el-tab-pane v-for="thumbnail in thumbnails" :key="thumbnail.id" @click="onThumbnailClick(thumbnail.id)">
        <div slot="label" class="thumbnail" :class="{active: thumbnail.checked}" v-if="!isReviews">
          <img :src="thumbnail.thumbnailURL">
        </div>
        <div class="preview">
          <img itemprop="image" :src="thumbnail.largeURL">
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="btn-footer" v-if="!isReviews">
      <el-button v-if="active&&!showBuyNow" class="btn-add-cart normal opacity" type="danger"
                 @click="onAddCartClick">{{ $t('cart.add_to_cart') }}
      </el-button>
      <el-button v-if="active" class="btn-add-cart normal" type="danger" @click="onBuyNowClick">
        BUY NOW
      </el-button>
      <el-button v-else class="btn-add-cart sold-out" type="danger" disabled>{{ $t('cart.sold_out') }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    },
    isReviews: {
      type: Boolean,
      default: false
    },
    showBuyNow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  methods: {
    onThumbnailClick (id) {
      this.productPreview.thumbnails = this.productPreview.thumbnails.map(item => {
        item.checked = item.id === id
        return item
      })
    },
    onAddCartClick () {
      this.$bus.$emit('add-cart')
    },
    onBuyNowClick () {
      this.$bus.$emit('buy-now')
    }
  },
  computed: {
    thumbnails () {
      console.log('this.images:', this.images)
      return this.images.map((item, index) => {
        return {
          id: index,
          thumbnailURL: item.url_small,
          largeURL: item.url,
          checked: index === 0
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-preview /deep/ {
    display: flex;
    flex-direction: column;

    .el-tabs__header {
      .el-tabs__nav-wrap {
        // width: 70px;
        &::after {
          background-color: $white;
        }
        .el-tabs__active-bar {
          display: none;
        }
        .el-tabs__nav-next,
        .el-tabs__nav-prev {
          background-color: $white;
          border: 1px solid $mecury;
          width: 68px;
          z-index: 9;
        }
        .el-tabs__item {
          height: 70px;
          padding: 0;
          margin-top: 8px;

          &.is-active {
            .thumbnail {
              border: 1px solid $flamingo;
            }
          }

          .thumbnail {
            width: 70px;
            height: 70px;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              max-width: 100%;
              max-height: 100%;
            }
          }
        }
      }
    }

    .el-tabs__content {
      width: 420px;
      .preview {
        width: 420px;
        height: 420px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
    }

    .btn-footer {
      text-align: right;
      margin-top: 25px;
      display: flex;
      padding-left: 60px;
      .btn-add-cart {
        flex: 1;
        // width: 200px;
        height: 60px;
        font-size: $xx-large;
        color: $white;
        &.normal {
          background: $flamingo;
          &:active {
            opacity: 0.5;
          }
        }
        &.opacity {
          border: solid 1px $flamingo;
          background: rgba(241, 84, 64, 0.1);
          color: $flamingo;
        }
        &.sold-out {
          background: $dusty-gray;
          border-color: $dusty-gray;
        }
      }
    }
  }
</style>
