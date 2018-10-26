<template>
  <div class="card">
    <div class="card-title" :style="styles">
      <span>{{title}}</span>
      <span class="sub-title">{{sub}}</span>
    </div>
    <slot>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    sub: {
      type: String,
      default: ''
    },
    styles: {
      type: Object,
      default: () => {
        return {
          fontSize: '36px',
          paddingBottom: '10px'
        }
      }
    }

  },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
  .card {
    .card-title {
      border-bottom: 1px solid $mine-shaft;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .sub-title {
        font-size: $small;
        color: $dusty-gray;
      }
    }
  }
</style>
