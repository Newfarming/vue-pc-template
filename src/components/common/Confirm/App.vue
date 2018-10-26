<template>
  <div class="club-confirm__mask" v-if="isShow">
    <transition
      name="fade"
    >
      <div class="club-confirm" v-if="showBox">
        <div class="club-confirm__header">
          {{title}}
        </div>
        <div class="club-confirm__body" v-html="content">
        </div>
        <div class="club-confirm__footer">
          <button class="btn club-confirm__cancel_btn" @click="cancel" v-if="showCancel">{{cancelText}}</button>
          <button class="btn club-confirm__confirm_btn" @click="confirm" v-if="showConfirm">{{confirmText}}</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'club-confirm',
  data () {
    return {
      isShow: true,
      showBox: false,
      title: '',
      content: '',
      showConfirm: true,
      showCancel: true,
      confirmText: 'OK',
      cancelText: 'Cancel'
    }
  },
  mounted () {
    this.showBox = true
  },
  methods: {
    cancel () {
      this.cancelCallback()
      this.hide()
    },
    confirm () {
      this.confirmCallback()
      this.hide()
    },
    confirmCallback () {
      console.log('im inner confirmCallback')
    },
    cancelCallback () {
      console.log('im inner cancelCallback')
    },
    hide () {
      this.showBox = false
      setTimeout(() => {
        this.isShow = false
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
  .club-confirm__mask {
    background: rgba(102, 102, 102, 0.5);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 9999;
    .club-confirm {
      position: fixed;
      text-align: center;
      left: 50%;
      margin-left: -275px;
      margin-top: 270px;
      max-width: 700px;
      // transform: translate(-50%, -50%);
      font-size: 20px;
      background: #fff;
      box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.5);
      .club-confirm__header {
        padding-top: 40px;
        font-size: 24px;
        color: $mine-shaft;
        min-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .club-confirm__body {
        padding: 0 100px;
        padding-top: 15px;
        color: #666;
        font-family: PingFangSC-Regular;
        font-size: 20px;
        font-weight: 400;
        line-height: 25px;
      }
      .club-confirm__footer {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 25px;
        padding-bottom: 45px;
        .club-confirm__confirm_btn {
          border: solid 1px #000;
          color: #000;
          background: #fff;
          margin-left: 20px;
          border-radius: 5px;
          height: 50px;
          width: 165px;
        }
        .club-confirm__cancel_btn {
          background: $flamingo;
          color: #fff;
          border: none;
          border-radius: 5px;
          height: 50px;
          width: 165px;
        }
      }
    }
  }
  .fade-enter-active {
    transition: all .5s;
  }
  .fade-leave-active {
    transition: all .3s ease-out;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(-20px);
  }
</style>
