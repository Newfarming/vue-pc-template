<template>
  <div class="btn_container" @click="onClick">
    <div id="fb_btn" class="fb_login fb_btn" v-if="type==='facebook'">
      <a class="btn">
        <img src="https://d1n1fwner8zc14.cloudfront.net/m/nsr/static/img/Facebook.png?v=0766cc2955aef4660d1a3b24212be7b4">
        <span class="text fb_text">Log in with Facebook</span>
      </a>
    </div>
    <div class="default" v-else-if="type == 'default'">
      <a class="btn" :class="{ disabled: disabled }">
        <span class="text">{{ text }}</span>
      </a>
    </div>
    <div class="blank" v-else-if="type == 'blank'">
      <a class="btn">
        <span class="text">{{ text }}</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'default'
    },
    data: {
      type: String
    },
    text: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick () {
      console.log('disabled', this.disabled)
      if (!this.disabled) {
        this.$emit('clicked', this.data)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .btn_container {
    margin-top: 30px;
  }
  .btn {
    display: block;
    margin-bottom: 0;
    padding: 0;
    font-size: 18px;
    text-align: center;
    white-space: nowrap;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    width: 100%;
    box-sizing: border-box;
    height: 44px;
    line-height: 44px;
    .text {
      font-weight: 200;
    }
  }
  .default {
    a {
      background-color: $flamingo;
      color: white;
    }
    .disabled {
      background: $rose-bud;
    }
  }
  .blank {
    a {
      color: $flamingo;
      border: solid 1px $flamingo;
      background: $white;
    }
  }
  .fb_login {
    a {
      border: none;
      padding: 0;
      background-color: #3B5998;
      color: white;
      box-shadow: 0 0 0 1px #D9D9D9;
      img {
        height: 25px;
        position: relative;
        bottom: 2px;
        vertical-align: middle;
      }
      .fb_text{
        margin-left: 15px;
      }
    }
  }
</style>
