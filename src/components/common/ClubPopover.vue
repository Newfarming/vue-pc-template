<template>
  <div class="club-popover">
    <slot></slot>
    <div x-arrow="" class="club-popover__arrow"></div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
  .club-popover {
    width: 400px;
    height: 200px;
    position: absolute;
    top: 500px;
    left: 300px;
    transform-origin: center top 0px;
    z-index: 9999;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border: 1px solid #ebeef5;
    background: white;
    .club-popover__arrow {
      height: 10px;
      width: 10px;
      background: white;
      transform: rotate(45deg);
      position: absolute;
      top: -7px;
      right: 20px;
      border-top: solid 1px rgba(232,232,232,.7);
      border-left: solid 1px rgba(232,232,232,.7);
      // box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      // box-shadow: -12px -12px 12px -12px rgba(0, 0, 0, 0.1),
      // -12px -12px 12px -12px rgba(0, 0, 0, 0.1);
    }
  }
</style>
