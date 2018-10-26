<template>
  <div class="backToTop" @click="scrollToTop">
    <p>↑</p>
    TOP
  </div>
</template>

<script>
export default {
  methods: {
    scrollToTop () {
      window.scroll(0, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.backToTop {
  color: $flamingo;
  position: fixed;
  bottom: 30px;
  right: 30px;
  text-align: center;
  border: 1px solid #FDEDEB;
  box-shadow: 0 2px 6px 0 rgba(241,84,64,0.10);
  height: 50px;
  width: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 25px;
  background: $white;
  user-select: none;
  cursor: pointer;
}
</style>
