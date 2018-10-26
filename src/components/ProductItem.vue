<template>
  <div class="product-item">
    <div class="product-image" :style="{background: `url(${data.imageUrl}) no-repeat center center / 100%`}" @click="onProductItemClick">
      <div class="mark" v-if="showMark"></div>
    </div>
    <div class="product-info">
      <div class="product-price">
        <span class="price">{{data.symbol}} {{data.price | round}}</span>
        <span class="discount">{{data.discount}}</span>
      </div>
      <div class="third-price">
        <template v-if="!isExclusive">
          <!-- <span v-if="data.platformName">{{data.platformName}}</span> -->
          <span class="platform-price">{{data.symbol}} {{data.platformPrice | round}}</span>
        </template>
        <span v-else>Exclusive</span>
      </div>
    </div>
  </div>
</template>

<script>
import config from 'assets/js/conf'
import utils from 'assets/js/utils'
export default {
  props: [
    'data', 'showMark'
  ],
  data () {
    return {
      isExclusive: !(this.data.platformName || this.data.platformPrice) || this.data.price > this.data.platformPrice
    }
  },
  methods: {
    onProductItemClick () {
      let query = utils.parseQueryString()
      query.productId = this.data.productId
      window.open(config.views.productDetail + utils.encodeQueryString(query))
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-item {
    display: inline-flex;
    flex-direction: column;
    margin: 0 10px 25px 10px;
    cursor: pointer;
    .product-image {
      width: 220px;
      height: 220px;
      .mark {
        background: url('../assets/image/activity/mark.png') no-repeat center center / 100%;
        height: 56px;
        width: 48px;
      }
    }
    .product-info {
      padding: 0 3px;
      .product-price {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;

        .price {
          font-size: $x-large;
        }

        .discount {
          color: $flamingo;
        }
      }

      .third-price {
        font-size: $x-small;
        color: $dusty-gray;
        .platform-price {
          text-decoration: line-through;
        }
        span {
          &:first-child {
            margin-right: 10px;
          }
        }
      }
    }
  }
</style>
