<template>
  <div>
    <div class="club-input-title">123123</div>
    <input type="text" class="club-input" placeholder="123123123">
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.club-input-title {
  color: rgb(153, 153, 153);
  font-size: 18px;
  font-weight: 300;
}
.club-input {
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #bebebe;
  box-sizing: border-box;
  color: #333;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: none;
  padding: 0 15px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  width: 100%;
}
</style>
