<template>
  <div>
    <el-dialog :visible.sync="visible" :modal='true' :center='true' width='650px' :show-close='false'>
      <i class="el-icon-close" @click="visible=false"></i>
      <div class="title" slot="title">
        {{showAll ? 'Detailed COD Restrictions' : 'COD is not available'}}
      </div>
      <p>Our COD is still under trial. During this phase,</p>
      <div class="limit-detail">
        <p v-for="(reason, index) in reasons" :key="`reason${index}`" v-if="codReason.indexOf(index) > -1 || showAll">{{reason}}</p>
      </div>
      <p>Thank you for your understanding, COD will be available to more customers soon.</p>
      <a v-if="!showAll" @click="showAll = true">See More Details >></a>
      <button class="btn" @click="visible=false">OK</button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: [
    'codReason', 'codLimit', 'symbol'
  ],
  data () {
    return {
      visible: false,
      reasons: [
        'COD is offered to a limited number of pin codes.',
        `COD will not be available if your order value exceeds ${this.symbol} 3404. This cap could vary depending on your shipping address.`,
        'COD can not be paid for certain items, due to customs restrictions.',
        'You may not place another COD order if your current COD order has not been fulfilled and paid for.',
        'We may restrict the use of COD for some customers based on their purchase history.'
      ],
      showAll: false
    }
  },
  created () {
    console.log('this', this.codLimit)
    this.$bus.$on('call-cod-restriction', (showAll) => {
      this.showAll = !!showAll
      this.visible = true
    })
  },
  watch: {
    visible () {
      this.reasons.splice(1, 1, this.codLimit[0] === 0 ? `COD will not be available if your order value exceeds ${this.symbol} ${this.codLimit[1]}. This cap could vary depending on your shipping address.` : `COD is only available for order between ${this.symbol} ${this.codLimit[0]} and ${this.symbol} ${this.codLimit[1]}.`)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper /deep/ {
  .el-dialog__body {
    padding: 30px 100px;
  }
}
.title {
  font-size: 24px;
}
p {
  font-size: 16px;
  line-height: 20px;
  padding: 20px 0;
  font-family: SFUIText-Regular;
}
.limit-detail {
  padding: 0 20px;
  p {
    color: #999;
    font-size: 16px;
    font-style: italic;
    display: list-item;
    padding: 5px 0;
  }
}
a {
  color: $havelock-blue;
  font-size: 16px;
  cursor: pointer;
  font-family: SFUIText-Regular;
}
.btn {
  width: 100%;
  border-radius: 5px;
}
.el-icon-close {
  position: absolute;
  font-size: $size36;
  top: 15px;
  right: 15px;
  color: #A5A5A5;
}

</style>
