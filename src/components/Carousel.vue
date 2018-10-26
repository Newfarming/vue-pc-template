<template>
  <el-carousel :interval="5000" class="carousel" :autoplay="false">
    <el-carousel-item v-for="item in carouselItems" :key="item.imageUrl">
      <img :src="item.imageUrl" @click="goTheme(item)">
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import conf from 'assets/js/conf'
export default {
  props: {
    carouselItems: {
      type: Array,
      required: true
    }
  },
  methods: {
    goTheme (info) {
      console.log('info', info)
      if (info.type === 'theme') {
        window.open(`${conf.views.theme}?theme=${info.key}`, '_blank')
      } else {
        window.open(`${conf.views.picks}`, '_blank')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .carousel /deep/ {
    .el-carousel__container {
      height: 384px;
    }
    .el-carousel__arrow {
      background-color: $white;
      color: $mine-shaft;
    }
    .el-carousel__item {
      img {
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }
  }
</style>
