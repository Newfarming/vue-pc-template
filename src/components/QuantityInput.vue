<template>
  <div class="input-number">
    <el-input-number v-model="quantity" @change="handleChange" :min="min" :max="max" size="mini"></el-input-number>
  </div>
</template>

<script>
export default {
  props: {
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 99
    },
    qty: {
      type: Number,
      default: 1
    },
    skuId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      quantity: this.qty
    }
  },
  methods: {
    handleChange (value) {
      this.$bus.$emit('quantity-change', value, this.skuId)
    }
  }
}
</script>

<style lang="scss" scoped>
  .input-number /deep/ {
    margin-top: 8px;
    .el-input-number {
      width: 100px;
      height: 24px;
      .el-input-number__decrease,
      .el-input-number__increase {
        width: 22px;
        height: 22px;
        line-height: 24px;
        border: 1px solid $mecury;
        border-radius: 0;
        background: $white;
        &:not(.is-disabled):hover {
          color: $mine-shaft;
        }
      }
      .el-input {
        height: 24px;
        line-height: 24px;
        .el-input__inner {
          border: none;
          height: 24px;
        }
      }
    }
  }
</style>
