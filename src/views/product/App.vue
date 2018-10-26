<template>
  <fixed-header-container>
    <header-component slot="header"></header-component>
    <el-container>
      <el-aside width="200px">
        <aside-comp :style="asideStyle" style="width: 200px;"></aside-comp>
      </el-aside>
      <section class="main-container">
        <div class="main-header">
          <sort-bar class="sort-bar"></sort-bar>
        </div>
        <div class="products">
          <product-list></product-list>
        </div>
      </section>
      <back-to-top></back-to-top>
    </el-container>
  </fixed-header-container>
</template>

<script>
import 'assets/css/common'
import HeaderComponent from 'components/HeaderComponent'
import AsideComp from 'components/AsideComp'
import Breadcrumb from 'components/Breadcrumb'
import SortBar from 'components/SortBar'
import ProductList from 'components/ProductList'
import FixedHeaderContainer from 'components/FixedHeaderContainer'
import BackToTop from 'components/BackToTop'
import utils from 'assets/js/utils'
export default {
  components: {
    HeaderComponent,
    Breadcrumb,
    SortBar,
    ProductList,
    AsideComp,
    FixedHeaderContainer,
    BackToTop
  },
  data () {
    return {
      isAsideFixed: false,
      asideOffsetTop: 0,
      asideStyle: {
        position: 'inherit',
        top: 0
      }
    }
  },
  mounted () {
    window.onscroll = () => {
      let asideHeight = document.getElementsByClassName('aside')[0].clientHeight + document.getElementsByClassName('el-aside')[0].offsetTop
      let windowHeight = utils.getScrollTop() + window.innerHeight
      if (windowHeight > asideHeight) {
        this.asideStyle = {
          position: 'fixed',
          top: window.innerHeight - document.getElementsByClassName('aside')[0].clientHeight + 'px'
        }
      } else {
        this.asideStyle = {
          position: 'inherit',
          top: 0
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .container /deep/ {
    .products {
      display: flex;
      justify-content: center;
    }

    .el-aside {
      margin-left: 20px;
      margin-top: 25px;
      // position: sticky;
      top: 95px;
      align-self: flex-start;
      overflow-x: hidden;
    }
    .main-container {
      flex: 1;
      margin-left: 20px;
      margin-top: 10px;
      .main-header {
        position: sticky;
        top: 70px;
        background: $white;
        .sort-bar {
          font-size: $small;
          background-color: $white;
          padding-bottom: 10px;
          padding-left: 12px;
          padding-top: 15px;
        }
        .breadcrumb {
          padding-left: 10px;
          padding-top: 10px;
        }
      }
    }
  }
</style>
