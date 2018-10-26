<template>
  <div class="price-detail">
    <div class="price-detail-row" v-for="(item, index) in priceDetail" :key="item.label" v-if="!item.hide">
      <span>
        {{item.label}}
        <span v-if="item.label.indexOf('Tax') > -1" class="tax-label">New Policy</span>
      </span>
      <span v-if="isNumber(item.price)">
        <span class="ori" v-if="item.oriPrice"> {{symbol}} {{item.oriPrice | round}} </span>
        {{symbol}} {{item.price | round}}
        <span class="tax-included" v-if="isShowTaxInclued(index)">(Tax Included)</span>
      </span>
      <span v-else>{{item.price}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    priceDetail: {
      type: Array,
      required: true
    },
    symbol: {
      type: String,
      required: true
    },
    isTaxInclude: {
      type: Boolean
    }
  },
  data () {
    return {}
  },
  methods: {
    isNumber (value) {
      return value === +value
    },
    isShowTaxInclued (index) {
      return Object.keys(this.priceDetail).length - 1 === index && this.isTaxInclude
    }
  }
}
</script>

<style lang="scss" scoped>
  .price-detail {
    font-size: $large;
    color: $dove-gray;
    padding: 0 5px;
    .price-detail-row {
      display: flex;
      justify-content: space-between;
      margin: 15px 0;
      .tax-label {
        color: $green;
        border: solid 1px $green;
        font-size: $xx-small;
        background-color: #F4F8FB;
        padding: 0 3px;
        border-radius: 3px;
        margin-left: 5px;
        vertical-align: 10%;
      }
      .ori {
        display: none;
      }
      &:last-child {
        border-top: 1px solid $mecury;
        padding-top: 15px;
        font-size: $x-large;
        color: $mine-shaft;
        .ori {
          display: inline-block;
          margin-right: 10px;
          text-decoration: line-through;
          color: #999999;
          font-size: 14px;
        }
        .tax-included {
          color: #999;
          font-size: 16px;
        }
      }
    }
  }
</style>
