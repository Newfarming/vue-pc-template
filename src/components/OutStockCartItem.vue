<template>
  <div class="product-item">
    <div class="product-image">
      <img :src="cartData.image">
    </div>
    <div class="product-right">
      <div class="product-info">
        <div class="product-name">{{cartData.name}}</div>
        <div class="out-stock">Out of Stock</div>
        <div>
          <span class="tips">This item will not be included in your order</span>
        </div>
      </div>
      <div class="product-operate">
        <a href="javascript:" @click="deleteItem">Delete</a>
      </div>
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
  },
  methods: {
    async deleteItem () {
      const skuId = this.cartData.skuId
      try {
        await this.$api.delCartItem(skuId)
      } catch (e) {
        console.log('delete error: ', e)
      }
      console.log(`delete ${skuId} success...`)
      this.$emit('item-delete', skuId)
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-item {
    min-height: 120px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $mecury;
    padding: 0 10px;
    .product-image {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .product-right {
      display: flex;
      flex-direction: row;
      flex: 1;
      justify-content: space-between;
      min-height: 80px;
      font-size: $small;
      .product-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 15px;
        .product-name {
          color: $dove-gray;
        }
        .out-stock {
          color: $flamingo;
          font-size: $large;
        }
        .tips {
          color: $carrot-orange;
          background: $milk-punch;
          padding: 2px 3px;
        }
      }
      .product-operate {
        display: flex;
        align-items: flex-end;
        a {
          color: $havelock-blue;
        }
      }
    }
  }
</style>
