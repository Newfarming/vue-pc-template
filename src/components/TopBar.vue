<template>
  <div class="top-bar" :class="{ 'mini-top-bar': isMini }">
    <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" background-color="#f9f9f9"
             text-color="#999999" active-text-color="#999999">
      <country-language></country-language>
      <template v-for="item in dropDownItems">
        <el-submenu class="cf-menu" :index="item.index" v-if="item.submenuItems" :key="item.id"
                    popper-class="cf-topbar-submenu">
          <template slot="title">
            <i class="el-icon-mobile-phone" v-if="item.index === 'download'"></i>
            <span v-html="item.title" class="menu-title"></span>
          </template>
          <el-menu-item class="cf-menu-item" :index="submenu.index" v-for="submenu in item.submenuItems"
                        :key="submenu.id">
            <img :src="submenu.image" v-if="submenu.image">
            <a href="javascript:">{{submenu.title}}</a>
          </el-menu-item>
        </el-submenu>
        <el-menu-item class="cf-menu" :index="item.index" v-else :key="item.id">
          <i class="el-icon-mobile-phone" v-if="item.index === 'download'"></i>
          {{item.title}}
        </el-menu-item>
      </template>
    </el-menu>
    <search-guest-order></search-guest-order>
  </div>
</template>

<script>
import utils from '../assets/js/utils'
import CountryLanguage from './CountryLanguage'
import SearchGuestOrder from 'components/SearchGuestOrder'

export default {
  components: {CountryLanguage, SearchGuestOrder},
  props: ['isMini'], // 是否显示mini版本的topbar
  async created () {
    const countryCode = utils.getUserCountry()
    // 如果是印度  增加help下拉框中的选项 Call Customer Service
    if (countryCode === 'in') {
      this.dropDownItems[1].submenuItems.push({
        id: 4,
        title: this.$t('topbar.call_customer_service'),
        index: 'callcustomerservice',
        url: '/views/document.html?type=callcustomerservice'
      })
    }
  },
  data () {
    return {
      activeIndex: 'about',
      dropDownItems: [
        {
          id: 0,
          title: this.$t('topbar.about_us'),
          index: 'about',
          submenuItems: [
            {
              id: 0,
              title: this.$t('topbar.factory_price'),
              index: 'about-factory-price',
              url: '/views/document.html?type=factory_price'
            }, {
              id: 1,
              title: this.$t('topbar.about_us'),
              index: 'about-about-us',
              url: '/views/document.html?type=about_us'
            }, {
              id: 2,
              title: this.$t('topbar.terms'),
              index: 'about-term-conditions',
              url: '/views/document.html?type=termsconditions'
            }, {
              id: 3,
              title: 'Collaborate with Us',
              index: 'collaborate-with-us',
              url: '/views/document.html?type=clubfactoryambassador'
            }, {
              id: 4,
              title: this.$t('topbar.privacy_policy'),
              index: 'about-privacy-policy',
              url: '/views/document.html?type=privacypolicy'
            }, {
              id: 5,
              title: this.$t('topbar.contact_us'),
              index: 'about-contact-us',
              url: '/views/document.html?type=contact_us'
            }
          ]
        },
        {
          id: 1,
          title: this.$t('topbar.help'),
          index: 'help',
          submenuItems: [
            {
              id: 0,
              title: this.$t('topbar.shipping'),
              index: 'shipping',
              url: '/views/document.html?type=shipping'
            }, {
              id: 1,
              title: this.$t('topbar.return_policy'),
              index: 'return-policy',
              url: '/views/document.html?type=returnpolicy'
            }, {
              id: 2,
              title: this.$t('topbar.payment_protection'),
              index: 'payment-protection',
              url: '/views/document.html?type=paymentprotection'
            }, {
              id: 3,
              title: this.$t('topbar.faq'),
              index: 'faq',
              url: '/views/document.html?type=faq'
            }
          ]
        },
        {
          id: 2,
          title: this.$t('topbar.download'),
          index: 'download',
          url: '/download_app'
        },
        {
          id: 3,
          title: (() => {
            const sex = utils.getUserSex()
            if (sex === 'M') {
              return this.$t('topbar.male')
            } else if (sex === 'F') {
              return this.$t('topbar.female')
            } else {
              // 默认选Female
              utils.saveUserSex('U')
              return 'Select Gender'
            }
          })(),
          type: 'select',
          index: 'sex',
          submenuItems: [
            {
              id: 0,
              title: this.$t('topbar.male'),
              index: 'M'
            }, {
              id: 1,
              title: this.$t('topbar.female'),
              index: 'F'
            }, {
              id: 2,
              title: 'Select Gender',
              index: 'U'
            }
          ]
        },
        {
          id: 4,
          title: this.$t('topbar.search_guest_order'),
          index: 'search-guest-order'
        }
      ]
    }
  },

  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
      if (keyPath[0] === 'sex') {
        utils.saveUserSex(key)
        window.location.reload(true)
      } else if (keyPath[0] === 'search-guest-order') {
        this.$bus.$emit('call-search-guest-order')
        // this.$alert(this.$t('alert.find_guest_order.message'), this.$t('alert.find_guest_order.title'), {
        //   confirmButtonText: this.$t('alert.find_guest_order.btn_confirm'),
        //   center: true,
        //   callback: action => {
        //     if (action === 'confirm') {
        //       window.open('http://clubfactory.com', '_blank')
        //     }
        //   }
        // })
      } else {
        // return true
        let items = this.dropDownItems.filter(item => {
          return item.index === keyPath[0]
        })
        if (items.length > 0) {
          if (items[0].url) {
            window.open(items[0].url, '_blank')
          } else {
            let subItems = items[0].submenuItems
            if (subItems) {
              let subs = subItems.filter(item => {
                return item.index === keyPath[1]
              })
              if (subs.length > 0) {
                let url = subs[0].url
                window.open(url, '_blank')
              }
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .top-bar /deep/ {
    .el-menu--horizontal {
      display: flex;
      justify-content: flex-end;
      & > li[role="menuitem"] {
        & + li {
          border-left: 1px solid $mecury;
        }
      }
      .el-submenu {
        &.is-active {
          .el-submenu__title {
            border: none !important;
          }
        }
        .el-submenu__title {
          height: 36px;
          line-height: 36px;
          border-bottom: none;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 30px;
            height: 20px;
            padding: 0 3px;
            position: relative;
            top: -1px;
          }
          &:hover {
            background: $white !important;
          }
        }
        & > .el-menu {
          top: 36px;
        }
        .el-menu-item {
          .el-menu--horizontal {
            background: red;
            .el-menu {
              background-color: $white !important;
              max-height: 600px;
              overflow-y: auto;
              overflow-x: hidden;
              img {
                width: 28px;
                height: 18px;
              }
            }
          }
        }
      }
      .el-menu-item {
        height: 36px;
        line-height: 36px;
        &:hover {
          background-color: $white !important;
        }
      }
    }
  }

  .mini-top-bar /deep/ {
    .el-menu--horizontal {
      .el-submenu {
        .el-submenu__title {
          font-size: $x-small;
          height: 20px;
          line-height: 20px;
          &:hover {
            background-color: $white !important;
          }
          /*国旗大小调整*/
          .menu-title {
            img {
              width: 21px;
              height: 14px;
            }
          }
        }
        & > .el-menu {
          top: 20px;
        }
        /*保持二级导航的高度*/
        .el-menu-item {
          height: 36px;
          line-height: 36px;
        }
      }
      .el-menu-item {
        font-size: $x-small;
        height: 20px;
        line-height: 20px;
        &:hover {
          background-color: $white !important;
        }
        /*一级导航icon大小调整*/
        [class^='el-icon-'] {
          font-size: $small;
          margin-right: 0;
        }
      }
      /*一级导航点击之后不需要下划线*/
      .el-menu-item.is-active {
        border-bottom: none;
      }
    }
  }
</style>
