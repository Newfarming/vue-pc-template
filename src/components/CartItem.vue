<template>
  <div class="cart-item">
    <div class="check-icon" v-if="operate" @click="checkItem(cartData.skuId)">
      <i class="iconfont icon-xuanze" :class="{'icon-xuanzhong': cartData.isChecked}"></i>
    </div>
    <div class="item-content">
      <div class="item-image">
        <img :src="cartData.image" @click="onProductDetailClick">
      </div>
      <div class="item-right">
        <div class="item-info">
          <div class="product-name">{{cartData.name}}</div>
          <div class="tips" v-if="cartData.tips">{{cartData.tips}}</div>
          <div class="product-base-info">
            <div class="product-sku">{{cartData.sku}}</div>
            <div class="product-price">
              <span class="sale-price">{{currentSymbol || symbol}} {{cartData.salePrice | round}}</span>
              <del class="del-price">{{cartData.delPrice | round}}</del>
            </div>
          </div>
        </div>
        <div class="item-operate" v-if="operate">
          <quantity-input :min="1" :max="999" :qty="cartData.quantity" :sku-id="cartData.skuId"></quantity-input>
          <div class="product-operate">
            <a href="javascript:" class="btn-product-delete" @click="deleteItem">{{$t('cart.delete') }}</a>
          </div>
        </div>
        <div class="item-quantity" v-else>
          x {{cartData.quantity}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import conf from 'assets/js/conf'
import utils from 'assets/js/utils'
import QuantityInput from 'components/QuantityInput'
export default {
  components: {
    QuantityInput
  },
  props: [
    'cartData',
    'operate',
    'currentSymbol'
  ],
  data () {
    return {
      symbol: utils.getSymbol()
    }
  },
  methods: {
    checkItem (skuId) {
      this.$emit('item-check-click', skuId)
    },
    async deleteItem () {
      const skuId = this.cartData.skuId
      // try {
      //   await this.$api.delCartItem(skuId)
      // } catch (e) {
      //   console.log('delete error: ', e)
      // }
      // console.log(`delete ${skuId} success...`)
      this.$emit('item-delete', skuId)
    },
    onProductDetailClick () {
      window.location.href = conf.views.productDetail + utils.encodeQueryString({productId: this.cartData.productId})
    }
  }
}
</script>

<style lang="scss" scoped>
  .cart-item {
    display: flex;
    align-items: center;
    min-height: 120px;
    border-bottom: 1px solid $mecury;
    margin-right: 5px;
    .check-icon {
      margin: 0 15px;
      cursor: pointer;
      i {
        font-size: $xx-large;
        color: $dove-gray;
        &.icon-xuanzhong {
          color: $flamingo;
        }
      }
    }

    .item-content {
      display: flex;
      align-items: center;
      flex: 1;
      font-size: $small;
      .item-image {
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        img {
          max-height: 100%;
          max-width: 100%;
        }
      }
      .item-right {
        flex: 1;
        display: flex;
        justify-content: space-between;
        min-height: 80px;
        margin-left: 15px;

        .item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .product-name {
            color: $dove-gray;
          }
          .tips {
            color: $flamingo;
          }
          .product-base-info {
            .product-sku {
              color: $dusty-gray;
            }
            .product-price {
              .sale-price {
                color: $flamingo;
              }
              .del-price {
                font-size: $x-small;
                color: $dusty-gray;
                margin-left: 15px;
              }
            }
          }
        }
        .item-operate {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;
          a {
            color: $havelock-blue;
          }
        }
        .item-quantity {
          font-size: $large;
        }
      }
    }
  }
</style>
