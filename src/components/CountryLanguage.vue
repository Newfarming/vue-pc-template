<template>
  <el-submenu index="country_language" @select="changeLanguage"
              popper-class="cf-topbar-submenu cf-country-language">
    <template slot="title">
      <img :src="country.image" :alt="country.name">
      ({{ country.symbol }}) | {{ language.name }}
    </template>

    <el-menu-item index="country_title" disabled v-t="'topbar.ship_to'"></el-menu-item>
    <el-submenu class="cf-menu-item" index="country">
      <template slot="title">
        <a>{{ country.name }}</a>
      </template>
      <div style="max-height: 400px; overflow: hidden; overflow-y: scroll;">
        <template v-for="item in country_items">
          <el-menu-item class="cf-menu-item" :index="item.index" :key="item.index" @click="changeCountry(item.index)">
            <img :src="item.image" v-if="item.image" height="18" width="28" style="height: 18px; width: 28px;">
            <a href="javascript:">{{ item.name }}</a>
          </el-menu-item>
        </template>
      </div>
    </el-submenu>

    <el-menu-item index="language_title" disabled v-t="'topbar.language'"></el-menu-item>
    <el-submenu class="cf-menu-item" index="language">
      <template slot="title">{{ language.name }}</template>
      <template v-for="item in language_items">
        <el-menu-item class="cf-menu-item" :index="item.index" @click="changeLanguage(item.index)" :key="item.index">
          <a href="#">{{ item.name }}</a>
        </el-menu-item>
      </template>
    </el-submenu>

  </el-submenu>
</template>

<script>
import utils from '../assets/js/utils'
import {countries, countryCodeMap} from '../assets/js/country'
import {languageMap} from '../assets/js/language'

export default {
  name: 'CountryLanguage',
  data () {
    return {
      country: (() => {
        const countryCode = utils.getUserCountry()
        return countryCodeMap[countryCode]
      })(),
      language: (() => {
        const languageCode = this.$i18n.locale || 'us'
        return languageMap[languageCode]
      })(),
      country_items: (() => {
        return countries.map(item => {
          return {
            id: item.id,
            name: item.name,
            index: item.code,
            image: item.image
          }
        })
      })(),
      language_items: (() => {
        return Object.values(languageMap).map(item => {
          return {
            index: item.code,
            name: item.name
          }
        })
      })()
    }
  },
  methods: {
    changeLanguage (languageCode) {
      console.log('language切换为' + languageCode)
      utils.saveUserLanguage(languageCode)
      // this.$i18n.locale = languageCode
      window.location.reload(true)
    },
    changeCountry (countryCode) {
      const countryInfo = countryCodeMap[countryCode] || countryCodeMap['us']
      const symbol = countryInfo.symbol
      utils.saveUserCountry(countryCode)
      utils.saveSymbol(symbol)
      window.location.reload(true)
    }
  }
}
</script>

<style lang="scss" scoped>
  .cf-country-language {
    .is-disabled {
      font-weight: 700;
      color: black !important;
      cursor: default !important;
      opacity: 1 !important;
    }
  }

  .cf-topbar-submenu {
    a {
      color: inherit;
    }
    .el-menu {
      .el-submenu {
        .el-menu--horizontal {
          max-height: 400px;
          overflow-y: auto;
          overflow-x: hidden;
        }
      }
      &.is-open {
        .el-submenu__title {
          border: none !important;
        }
      }
      .el-submenu__title {
        // @include topbar-title;
        &:hover {
          background: $white !important;
        }
      }
      .el-menu {
        max-height: 400px;
        overflow-y: auto;
        overflow-x: hidden;
        .cf-menu-item {
          background-color: $white !important;
          &:hover {
            background-color: $chardon !important;
            color: $flamingo !important;
          }
          .el-submenu__title:hover {
            background-color: $chardon !important;
            color: $flamingo !important;
          }
        }
      }
      .el-menu-item {
        img {
          width: 28px;
          height: 18px;
        }

      }

      .el-menu {
        background-color: $white !important;
        max-height: 400px;
        overflow-y: auto;
        overflow-x: hidden;
      }
    }
  }
</style>
