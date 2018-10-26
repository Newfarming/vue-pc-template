<template>
  <div class="popover-cart-item">
    <div class="product-image">
      <img :src="cartData.image">
    </div>
    <div class="product-content">
      <p class="product-name">{{cartData.name}}</p>
      <p class="product-sku">{{cartData.sku}}</p>
      <p class="bottom">
        <span class="product-price">{{cartData.symbol}} {{cartData.salePrice | round}}</span>
        <span class="product-quantity">x {{cartData.quantity}}</span>
      </p>
    </div>
  </div>
</template>

<script>

export default {
  props: [
    'cartData'
  ],
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
  .popover-cart-item {
    display: flex;
    min-height: 80px;
    align-items: center;
    padding: 0 15px;
    &:hover {
      background-color: $chardon;
      cursor: pointer;
    }
    .product-image {
      width: 58px;
      height: 58px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .product-content {
      margin-left: 20px;
      flex: 1;
      min-width: 0;
      font-size: $x-small;
      display: flex;
      justify-content: space-between;
      min-height: 58px;
      flex-direction: column;
      color: $dove-gray;
      .product-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
      }
      .product-sku {
        color: $dusty-gray;
      }
      .bottom {
        display: flex;
        justify-content: space-between;
        .product-price {
          color: $flamingo;
        }
      }
    }
  }
</style>
