<template>
  <div>
    <el-popover ref="cart-popover" placement="bottom" width="400" trigger="hover" popper-class="cart-popover"
                :open-delay="100" @show="showCartData">
      <p class="recent-add">{{ $t('cart.recent_add') }}</p>
      <div v-loading="loading" style="min-height: 70px;">
        <template v-if="cartData.length > 0">
          <popover-cart-item v-for="item in displayItems" :key="item.skuId" :cartData="item"></popover-cart-item>
        </template>
        <div v-else class="empty-cart">
          <i class="iconfont icon-gouwuche"></i>
          {{ $t('cart.empty') }}
        </div>
      </div>
      <p class="other-item-tip" v-if="restItemCount > 0">{{restItemCount}} {{ $t('cart.other_item') }}</p>
      <p class="btn-check">
        <a @click="checkout">{{ $t('cart.check_out') }}</a>
      </p>
    </el-popover>
    <a class="cart-logo" v-popover:cart-popover @click="checkout">
      <i class="iconfont icon-gouwuche"></i>
      <span>
        ({{num}})
      </span>
    </a>
  </div>
</template>

<script>
import config from 'assets/js/conf'
import utils from 'assets/js/utils'
import PopoverCartItem from 'components/PopoverCartItem'
// import ClubPopover from 'components/common/ClubPopover'

export default {
  components: {
    PopoverCartItem
  },
  async created () {
    this.num = await this.$api.getCartNum()
    // setTimeout(async () => {
    //   if (!this.loading) {
    //     await this.fetchCartData()
    //   }
    // }, 1500)
    this.$bus.$on('add-cart-success', async () => {
      if (!this.loading) {
        this.num = await this.$api.getCartNum()
        await this.fetchCartData()
      }
    })
    this.$bus.$on('delete-cart', async () => {
      if (!this.loading) {
        this.num = await this.$api.getCartNum()
        await this.fetchCartData()
      }
    })
  },
  data () {
    return {
      loading: false,
      cartData: [],
      cartURL: `${config.views.cart}`,
      showItemCount: 5,
      symbol: utils.getSymbol(),
      num: 0
    }
  },
  methods: {
    checkout () {
      console.log('checkout')
      window.location.href = config.views.cart
    },
    async fetchCartData () {
      try {
        this.loading = true
        let {availabelItems} = await this.$api.getCartData()
        this.cartData = availabelItems.map(item => {
          item.symbol = this.symbol
          return item
        })
      } finally {
        this.loading = false
      }
    },
    async showCartData () {
      if (this.loading || this.cartData.length > 0) {
        return false
      }
      await this.fetchCartData()
    }
  },
  computed: {
    displayItems () {
      return this.cartData.slice(0, this.showItemCount)
    },
    restItemCount () {
      let restCount = this.cartData.length - this.showItemCount
      return restCount > 0 ? restCount : 0
    }
  }
}
</script>

<style lang="scss">
  body {
    .cart-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $xx-large;
      color: $flamingo;
      margin-left: 20px;
      cursor: pointer;
      span {
        font-size: $small;
        margin-left: 5px;
      }
      .iconfont {
        font-size: $size36;
      }
    }
    .recent-add {
      padding: 10px 20px;
      font-size: $x-small;
      color: $dusty-gray;
    }
    .other-item-tip {
      padding: 10px 15px;
      font-size: $x-small;
      color: $dusty-gray;
      text-align: right;
    }
    .btn-check {
      padding: 0 15px;
      margin-top: 20px;
      a {
        display: block;
        text-align: center;
        width: 100%;
        height: 34px;
        line-height: 34px;
        font-size: $small;
        color: $white;
        background-color: $flamingo;
        border-radius: 2px;
        cursor: pointer;
        &:active {
          opacity: 0.5;
        }
      }
    }
    .cart-popover {
      padding: 0;
      padding-bottom: 20px;
    }

    .empty-cart {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      color: $dusty-gray;
      .iconfont {
        font-size: 24px;
        margin-right: 15px;
      }
    }
  }
</style>
