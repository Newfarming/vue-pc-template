<template>
  <div class="checkbox"  @click="change">
    <i class="iconfont icon-xuanzhong" v-if="checked"></i>
    <i class="iconfont icon-xuanze" v-else></i>
    <div class="label"> {{ label }} </div>
  </div>
</template>

<script>
export default {
  props: {
    checked: {
      type: Boolean,
      default: false,
      required: true
    },
    label: {
      type: String
    }
  },
  methods: {
    change () {
      this.$emit('change', !this.checked)
    }
  }
}
</script>

<style lang="scss" scoped>
  .checkbox /deep/ {
    position: relative;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    padding: 10px 0;
    i {
      color: $flamingo;
      font-size: 18px;
    }
    .label {
      font-size: $x-small;
      display: inline-block;
      color: $dusty-gray;
      vertical-align: 10%;
    }
  }
</style>
