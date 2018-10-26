<template>
  <fixed-header-container>
    <header-component class="header" slot="header"></header-component>
    <el-container>
      <el-aside width="200px">
        <navigation-bar :menu="menu" @select="handleSelect" :defaultActive="selectedItem"></navigation-bar>
      </el-aside>
      <el-main>
        <main-content class="main-content" :selectedItem="selectedItem"></main-content>
      </el-main>
    </el-container>
  </fixed-header-container>
</template>

<script>
import 'assets/css/common'
import utils from 'assets/js/utils'

import HeaderComponent from 'components/HeaderComponent'
import FixedHeaderContainer from 'components/FixedHeaderContainer'
import NavigationBar from './Navigationbar.vue'
import MainContent from './main-content/Index.vue'

export default {
  components: {
    HeaderComponent,
    FixedHeaderContainer,
    NavigationBar,
    MainContent
  },
  created () {
    this.initNav()
    if (utils.parseQueryString()['type'] === 'aboutus') {
      let metas = [{
        name: 'Keywords',
        content: 'Club Factory Phone Number, customer care, customer service, customer service number，customer care contact, consumer support, consumer help'
      }, {
        name: 'Description',
        content: 'Contact Club Factory Customer Support at info@fromfactory.club or call our customer care at +91 9878009790 for your order related enquiries. We will be happy to help you.'
      }]
      utils.setSeoInfo(null, 'Club Factory Customer Support | Contact Us', metas)
    }
  },
  data () {
    return {
      selectedItem: 'shipping', // 默认选中 shipping
      menu: [ // 侧边导航栏配置对象
        {
          title: 'Let Us Help You',
          menuItems: [
            {text: 'Shipping', index: 'shipping'},
            {
              text: 'Return Policy',
              index: 'returnpolicy',
              submenu: [
                {text: 'About Returns', index: 'aboutreturns'},
                {text: 'About Refunds', index: 'aboutrefunds'},
                {text: 'About Return Shipping', index: 'aboutreturnshipping'},
                {text: 'Item Exchange', index: 'itemexchange'}
              ]
            },
            {text: 'Payment Protection', index: 'paymentprotection'},
            {text: 'FAQ', index: 'faq'}
          ]
        },
        {
          title: 'Get to Know Us',
          menuItems: [
            {text: 'Factory Price', index: 'factoryprice'},
            {text: 'About Us', index: 'aboutus'},
            {text: 'Terms & Conditions', index: 'termsconditions'},
            {text: 'Privacy Policy', index: 'privacypolicy'},
            {text: 'Contact Us', index: 'contactus'}
          ]
        },
        {
          title: 'Collaborate with Us',
          menuItems: [
            {text: 'Club Factory Ambassador', index: 'clubfactoryambassador'},
            {text: 'Short Videos', index: 'shortvideos'},
            {text: 'Business Partnerships', index: 'businesspartnerships'}
          ]
        }
      ]
    }
  },
  methods: {
    handleSelect (index) { // 组件显示设置
      this.selectedItem = index
      if (document.documentElement.scrollTop > 125) {
        document.documentElement.scrollTop = 125
      }
    },
    initNav () {
      let { type } = utils.parseQueryString()
      type = type.split('_').join('')
      if (!type) return // 如果查询参数中不存在预先设施的显示项
      // 如果是印度的 加入 call customer service
      if (utils.getUserCountry() === 'in') {
        this.menu[0].menuItems.push({text: 'Call Customer Service', index: 'callcustomerservice'})
      }
      let menu = this.menu.reduce((pre, curr) => { // 所有的一级菜单
        return pre.concat(curr.menuItems)
      }, [])
      for (let i = 0; i < menu.length; i++) {
        if (menu[i].index === type) {
          if (menu[i].submenu) { // 如果传入的默认选择项是一个二级导航的标题，则默认选择项是这个二级导航的第一项
            type = menu[i].submenu[0].index
          }
          this.handleSelect(type)
          break
        } else {
          if (menu[i].submenu) {
            for (let j = 0; j < menu[i].submenu.length; j++) {
              if (menu[i].submenu[j].index === type) { // 如果传入的默认选择项是一个二级导航
                this.handleSelect(type)
                return
              }
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .el-aside {
    position: sticky;
    top: 70px;
    align-self: flex-start;
    overflow-x: hidden;
    padding-top: 60px;
    max-height: 100vh;
  }
  .el-main {
    padding-left: 135px;
    padding-top: 60px;
  }
</style>
