<template>
  <div class="circle-tag" :style="style">
    <span>{{digist}}</span>
    <span>{{title}}</span>
  </div>
</template>

<script>
export default {
  props: [
    'digist',
    'title',
    'color'
  ],
  data () {
    return {
      style: {
        color: this.color,
        'border-color': this.color
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .circle-tag {
    display: inline-flex;
    flex-direction: column;
    width: 44px;
    height: 44px;
    justify-content: center;
    align-items: center;
    border: 1px solid $flamingo;
    border-radius: 50%;
    font-size: 12px;
    color: $flamingo;
    margin-left: 20px;
  }
</style>
