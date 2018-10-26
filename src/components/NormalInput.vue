<template>
  <div class="normal-input" :style="{ marginTop: hasTitle ? '20px' : '10px', width: inputData.width }">
    <div class="title" :class="{left: hasTitle}" :style="{ display: hasTitle ? '' : 'none' }">{{inputData.title}}<span>{{inputData.subTitle}}</span></div>
    <div class="warning" :class="{hide: !inputData.warningShow, right: hasTitle, disabled: inputData.disabled}">
      <i class="iconfont icon-icon" v-if="!inputData.disabled"></i>
       {{inputData.warning}}
    </div>
    <el-input
      :maxlength="inputData.maxLength"
      :name="inputData.name"
      v-model="input"
      :placeholder="inputData.placeholder"
      :type="inputData.type"
      :disabled="inputData.disabled"
      @blur="onBlur"
    >
      <template slot="prepend" v-if="inputData.prefix && inputData.prefix.length">{{inputData.prefix}}</template>
      <el-tooltip class="el-tooltip-item" slot="suffix" effect="dark" placement="bottom">
        <div class="item" slot="content">
          CVV <br>
          The last 3 digits displayed <br/>
          on the back of your card
        </div>
        <i v-if="inputData.suffix" class="iconfont icon-wenhao el-input__icon"></i>
      </el-tooltip>
    </el-input>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'inputs'
  },
  props: {
    inputData: {
      type: Object,
      default: () => {
        return {
          placeholder: '',
          warning: '',
          warningShow: false,
          type: 'text',
          title: '',
          subTitle: '',
          disabled: '',
          width: '',
          prefix: ''
        }
      }
    },
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    hasTitle () {
      return this.inputData.title && this.inputData.title.length > 0
    }
  },
  data () {
    return {
      input: ''
    }
  },
  created () {
    if (this.input !== this.value) {
      this.input = this.value
    }
  },
  methods: {
    // change (value) {
    //   if (!this.inputData.disabled) {
    //     this.$emit('inputs', value.trim())
    //   }
    // },
    onBlur (e) {
      this.$emit('blur', this.input)
    },
    replaceStr (value, maxLength) {
      let realValue = value.slice(0, value.indexOf('*'))
      return `${realValue}${'*'.repeat(maxLength - realValue.length)}`
    }
  },
  watch: {
    input (val) {
      if (!this.inputData.disabled) {
        // this.input = this.replaceStr(val, this.inputData.maxLength)
        this.$emit('inputs', val.trim())
      }
    },
    value (newVal) {
      if (this.input !== newVal) {
        this.input = newVal
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .hide {
    visibility: hidden;
  }
  .normal-input {
    margin-top: 10px;
    .title {
      color: $dusty-gray;
      font-size: $large;
      font-weight: 300;
      span {
        font-weight: 300;
        margin-left: 10px;
      }
      &.left {
        float: left;
        &::after {
          overflow: hidden;
          clear: both;
        }
      }
    }
  }
  .warning {
    color: $guardsman;
    font-size: $small;
    &.right {
      float: right;
    }
    &.disabled {
      color: $dusty-gray;
      font-weight: 200;
    }
    i {
      font-size: $small;
      vertical-align: 10%;
    }
  }
  .el-input /deep/{
    input {
      &:focus {
        border-color: $flamingo;
      }
      &::-webkit-input-placeholder {
        color: $dusty-gray;
      }
      &:-moz-placeholder {
        color: $dusty-gray;
      }
      &::-moz-placeholder {
        color: $dusty-gray;
      }
      &:-ms-input-placeholder {
        color: $dusty-gray;
      }
    }
    .el-input__inner {
      color: $mine-shaft;
      border-color: $silver;
      border-radius: 4px;
    }
    .el-input-group__prepend {
      background: $white;
      border: none;
      padding: 0 10px 0 0;
      color: #9b9b9b;
    }
  }
  .el-input.is-disabled /deep/ {
     .el-input__inner {
       color: #9b9b9b;
       background: #f9f9f9;
       border-color: #bebebe;
     }
  }
  body {
    .item {
      text-align: center;
    }
  }
</style>
