<template>
  <el-menu
    ref="el-menu"
    :default-active="defaultActive"
    unique-opened
    @select="handleSelect">
    <el-menu-item-group v-for="menuGroup in menu" :key="menuGroup.title">
      <span slot="title">{{ menuGroup.title }}</span>
      <div v-for="item in menuGroup.menuItems" :key="item.index">
        <el-submenu v-if="item.submenu" :index="item.index">
          <span slot="title">{{ item.text }}</span>
          <el-menu-item v-for="subItem in item.submenu" :index="subItem.index" :key="subItem.index">
            <span slot="title">{{ subItem.text }}</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-else :index="item.index">
          <span slot="title">{{ item.text }}</span>
        </el-menu-item>
      </div>
    </el-menu-item-group>
  </el-menu>
</template>

<script>
export default {
  props: [
    'menu',
    'defaultActive'
  ],
  data () {
    return {
      submenuItems: [] // 缓存二级子菜单
    }
  },
  created () {
    this.menu.forEach(menu => { // 所有的二级子菜单
      menu.menuItems.forEach(menuItem => {
        if (menuItem.submenu) {
          this.submenuItems.push(...menuItem.submenu)
        }
      })
    })
  },
  methods: {
    handleSelect (index) {
      if (this.submenuItems.indexOf(index) === -1) { // 如果 index 不属于某个submenu，则关闭所有子菜单
        this.$refs['el-menu'].openedMenus = []
      }
      this.$emit('select', index)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-menu /deep/ {
    border-right: 0;
    .el-menu-item-group__title {
      font-size: 20px;
      color: #333333;
    }
    .el-menu-item-group + .el-menu-item-group {
      margin-top: 45px;
    }
    /*一级导航*/
    .el-menu-item {
      color: #666666;
      &:hover {
        background-color: #FDEDEB;
      }
      &:focus {
        background-color: white;
      }
    }
    .el-menu-item.is-active {
      color: #F15440;
      font-weight: bold;
    }
    /*二级导航*/
    .el-submenu .el-submenu__title {
      color: #666666;
      &:hover {
        background-color: #FDEDEB;
      }
    }
    /*展开的二级导航的title*/
    .el-submenu.is-opened .el-submenu__title {
      color: #F15440;
    }
  }
</style>
