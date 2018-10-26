<template>
  <div>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link" @click="goUserCenter">
        {{titleText}}
        <i class="el-icon-arrow-down el-icon--right" v-if="isShowArrow"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="item in dropDownItems" :key="item.id" :disabled="item.disabled" :divided="item.divided" :command="item.command">{{item.title}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import config from 'assets/js/conf'

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    isShowArrow: {
      type: Boolean,
      default: true
    },
    dropDownItems: {
      type: Array,
      required: true
    }
  },
  data () {
    return {

    }
  },
  methods: {
    handleCommand (command) {
      this.$emit('dropdown-item-click', command)
    },
    goUserCenter () {
      window.location.href = config.views.user
    }
  },
  computed: {
    titleText () {
      return this.title.length > 25 ? this.title.slice(0, 25) : this.title
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-dropdown-link {
    font-size: $small;
    cursor: pointer;
  }
  .el-dropdown-menu {
    .el-dropdown-menu__item {
      &:hover {
        background-color: $chardon;
        color: $flamingo;
      }
    }
  }
</style>
