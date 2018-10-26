<template>
  <div class="deliver">
    <div class="deliver-top" @click="clickTop">
      <span><span class="deliver-id-text">Tracking :</span><span class="deliver-id">{{deliver.tracking_no}}</span></span>
      <span><span class="deliver-id-text">Courier :</span><span class="deliver-id">{{deliver.courier}}</span></span>
      <span><span class="deliver-id-text">Estimated Delivery Date :</span><span class="deliver-id">{{deliver.delivery_date}}</span></span>
      <span class="plus">{{open}}</span>
    </div>
    <div class="detail" ref="detail">
      <div class="blank">
        <tracking-item v-for="(item, index) in deliver.tracking_msg" :key="index" :track="item">
          <tracking-item v-for="(node, i) in item.nodes" :key="i" :track="node">
          </tracking-item>
        </tracking-item>
      </div>
    </div>
  </div>
</template>

<script>
import TrackingItem from 'components/order/TrackingItem'
export default {
  components: {
    TrackingItem
  },
  props: [
    'deliver', 'index', 'showDetail'
  ],
  data () {
    return {
      open: '+'
    }
  },
  mounted () {
    this.show(this.showDetail)
  },
  methods: {
    clickTop () {
      this.$emit('clickTop', this.index)
    },
    show (show) {
      if (!show) {
        this.$refs.detail.style.maxHeight = ''
        this.open = '+'
      } else {
        this.$refs.detail.style.maxHeight = '2000px'
        this.open = '-'
      }
    }
  },
  watch: {
    showDetail (val) {
      this.show(val)
    }
  }
}
</script>

<style lang="scss" scoped>
  .deliver {
    margin-bottom: 20px;
    .deliver-top {
      background: #FBFBFB;
      height: 54px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;
      span {
        .deliver-id-text {
          color: #333;
          font-size: $medium;
        }
        .deliver-id {
          margin-left: 10px;
          color: #666;
          font-size: $small;
        }
      }
      .plus {
        color: #333;
        font-size: 20px;
      }
    }
    .detail{
      transition: all 300ms;
      height: auto;
      max-height: 0;
      overflow: hidden;
      .blank {
        padding: 30px;
      }
    }
  }
</style>
