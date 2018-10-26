<template>
  <component class="format-article" :is="selectedItem"></component>
</template>

<script>
import shipping from './help/Shipping.vue'
import paymentprotection from './help/PaymentProtection.vue'
import faq from './help/FAQ.vue'
import aboutrefunds from './help/AboutRefunds.vue'
import aboutreturns from './help/AboutReturns.vue'
import aboutreturnshipping from './help/AboutReturnShipping.vue'
import itemexchange from './help/ItemExchange.vue'
import callcustomerservice from './help/CallCustomerService'

import factoryprice from './about/FactoryPrice.vue'
import contactus from './about/ContactUs.vue'
import termsconditions from './about/TermsConditions.vue'
import privacypolicy from './about/PrivacyPolicy.vue'
import aboutus from './about/AboutUs.vue'

import clubfactoryambassador from './collaborate/ClubFactoryAmbassador'
import shortvideos from './collaborate/ShortVideos'
import businesspartnerships from './collaborate/BusinessPartnerships'

export default {
  props: [
    'selectedItem'
  ],
  components: {
    shipping,
    paymentprotection,
    faq,
    callcustomerservice,
    aboutreturnshipping,
    aboutreturns,
    aboutrefunds,
    itemexchange,
    factoryprice,
    contactus,
    termsconditions,
    privacypolicy,
    aboutus,
    clubfactoryambassador,
    shortvideos,
    businesspartnerships
  }
}
</script>

<style lang="scss" scoped>
  article.format-article /deep/ {
    font-size: $medium;
    line-height: 32px;
    color: $mine-shaft;
    section {
      margin: 70px 0;
    }
    h1 {
      font-weight: normal;
      font-size: 40px;
      line-height: 40px;
      margin-bottom: 70px;
    }
    h2 {
      font-size: 30px;
      font-weight: normal;
      margin-bottom: 28px;
    }
    h3 {
      margin-top: 28px;
    }
    h4 {
      font-weight: normal;
      margin-top: $medium;
    }
    p {
      color: $dusty-gray;
    }
    ul {
      margin: 20px 0;
      li {
        margin-left: 20px;
        color: #151515;
      }
    }
    .notice {
      font-size: 13px;
      font-style: italic;
      color: $dusty-gray;
    }
    .text-danger {
      color: #D00202;
    }
    .link {
      font-size: 16px;
      text-decoration: underline;
      color: $havelock-blue;
      &:hover {
        color: #337AB7;
      }
    }
    .email {
      font-style: italic;
      color: $havelock-blue;
    }
    .p-br {
      margin-bottom: 16px;
    }
  }
</style>
