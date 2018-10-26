import Vue from 'vue'
import VueI18n from 'vue-i18n'

import {countries as countryInfo} from '../js/country'
import utils from '../js/utils'
import en from './en'
import es_MX from './es-MX'
import id from './id'
import pt_BR from './pt-BR'
import hi_IN from './hi-IN'
import ar from './ar'


function getLanguageCode() {
  console.log('getUserLanguage', utils)
  let languageCode = utils.getUserLanguage()
  if (!languageCode) {
    languageCode = countryInfo.language
  }
  // 以'ar-'开头的语言都认为是阿拉伯语
  if (languageCode.substr(0, 3).toLowerCase() === 'ar-') {
    languageCode = 'ar'
  }
  if (!utils.isSupportLanguage(languageCode)) {
    console.warn(`unsupported language: ${languageCode}, reset to English.`)
    languageCode = 'en'
  }
  console.log('languageCode: ', languageCode)
  return languageCode
}

const i18n = (function () {
  Vue.use(VueI18n)
  // console.log(JSON.stringify(en))
  return new VueI18n({
    locale: getLanguageCode(), // set locale
    // locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en,
      id,
      ar,
      'es-MX': es_MX,
      'pt-BR': pt_BR,
      'hi-IN': hi_IN,
    },
    silentTranslationWarn: true
  })
})()

export default i18n
