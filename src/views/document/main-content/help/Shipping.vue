<template>
  <article>
    <h1>Shipping</h1>
    <section>
      <h2 class="country-name">{{ countryName }}</h2>
      <el-row>
        <el-col :span="10">Shipping Courier</el-col>
        <el-col :span="14">{{ courier }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="10">Preparing & Shipping Time</el-col>
        <el-col :span="14">{{ time }}</el-col>
      </el-row>
      <el-row>
        <el-col class="cost" :span="10">Cost</el-col>
        <el-col :span="14">
          <p>FREE for order over {{ unit }} {{ orderAmountLocal }}.</p>
          <p>Otherwise {{ unit }} {{ shippingCostLocal }}</p>
        </el-col>
      </el-row>
    </section>
  </article>
</template>

<script>
import utils from 'assets/js/utils'
import { countryCodeMap } from 'assets/js/country'

export default {
  data () {
    return {
      shippingInfo: '', // 当前国家的shipping信息
      userCountryCode: utils.getUserCountry(), // 当前国家代码
      orderAmountLocal: '', // 包邮的价格
      shippingCostLocal: '' // 邮费价格
    }
  },
  computed: {
    countryName () { // 当前国家名称
      return countryCodeMap[this.userCountryCode].name
    },
    courier () { // 运输方式
      if (!this.shippingInfo) { return '' }
      return this.shippingInfo.delivery_info.carrier
    },
    time () { // 准备和运输时间
      if (!this.shippingInfo) { return '' }
      let minDays = this.shippingInfo.prepare_info.min_days + this.shippingInfo.delivery_info.min_days // 最短时间
      let maxDays = this.shippingInfo.prepare_info.max_days + this.shippingInfo.delivery_info.max_days // 最长时间
      return `${minDays} - ${maxDays} days`
    },
    unit () { // 货币单位
      return countryCodeMap[this.userCountryCode].unit
    }
  },
  watch: {
    'shippingInfo': function () {
      if (!this.shippingInfo) { return '' }
      let shippingCosts = this.shippingInfo.shipping_costs
      let length = shippingCosts.length
      for (let i = 0; i < length; i++) {
        console.log('shippingCosts', shippingCosts)
        if (shippingCosts[i].shipping_cost_local === 0) {
          this.orderAmountLocal = shippingCosts[i].order_amount_local.toFixed()
          this.shippingCostLocal = shippingCosts[i - 1] && shippingCosts[i - 1].shipping_cost_local.toFixed()
          break
        }
      }
    }
  },
  async created () {
    this.shippingInfo = await this.$api.getShippingInfo()
  }
}
</script>

<style scoped lang="scss">
  .country-name {
    margin-bottom: 0;
  }
  .el-row {
    width: 650px;
    font-size: $medium;
    padding: 12px 0;
    border-bottom: 1px solid $mecury;
    .el-col:first-child {
      color: $dusty-gray;
    }
    .el-col p {
      color: $mine-shaft;
    }
    .cost {
      line-height: 64px;
    }
  }
</style>
