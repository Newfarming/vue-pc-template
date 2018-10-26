<template>
  <div class="select" :style="{ marginTop: hasTitle ? '20px' : '10px', width: selectData.width }">
    <div class="title" :class="{left: hasTitle}" :style="{ display: hasTitle ? '' : 'none' }">{{selectData.title}}<span>{{selectData.subTitle}}</span></div>
    <div class="warning" :class="{hide: !selectData.warningShow, right: hasTitle, disabled: selectData.disabled}">
      <i class="iconfont icon-icon" v-if="!selectData.disabled"></i>
       {{selectData.warning}}
    </div>
    <el-select v-model="myValue" :name="selectData.name" :placeholder="placeholder ? placeholder : selectData.placeholder" @change="onChange" :disabled="selectData.disabled" :style="{ width: '100%' }">
      <el-option
        v-for="item in selectData.option"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    selectData: {
      type: Object,
      default: () => {
        return {
          title: '',
          subTitle: '',
          width: '',
          option: [],
          disabled: false,
          warningShow: false,
          warning: ''
        }
      }
    },
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: ''
  },
  computed: {
    hasTitle () {
      return this.selectData.title.length > 0
    },
    myValue: {
      get () {
        return this.value
      },
      set (value) {
        value = this.value
      }
    }
  },
  methods: {
    onChange (value) {
      this.$emit('change', value)
    }
  }
}
</script>

<style lang="scss">
  .hide {
    visibility: hidden;
    display: none;
  }
  .select {
    margin-top: 10px;
    .title {
      color: $dusty-gray;
      font-size: $large;
      font-weight: 300;
      &.left {
        float: left;
      }
    }
    .el-select /deep/ {
       .el-input.is-focus {
          .el-input__inner {
            border-color: $flamingo;
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
  .el-select-dropdown {
    &.el-popper {
      margin-top: 0;
      .el-select-dropdown__list {
        padding: 0;
        .el-select-dropdown__item {
          &:hover {
            background: $provincial-pink;
            color: $flamingo;
          }
          &.selected {
            color: $flamingo;
            background: $white;
          }
        }
      }
    }
    .popper__arrow {
      display: none;
    }
  }
  .el-popper {
    &[x-placement^=top] {
      margin-bottom: 0;
    }
  }
</style>
