<template>
  <ul class="breadcrumb" v-if="breadcrumb.length > 0">
    <li v-for="item in breadcrumb" :key="item.title">
      <a :href="item.href" v-if="item.href">{{item.title}}</a>
      <a v-else>{{item.title}}</a>
    </li>
  </ul>
</template>

<script>
import config from 'assets/js/conf'
export default {
  data () {
    return {
    }
  },

  computed: {
    subMenu () {
      const subMenu = this.$store.state.subMenu
      return {
        id: subMenu.name,
        title: (() => {
          const subs = subMenu.subs
          if (subs) {
            let res = subs.filter(item => {
              return item.isSelected
            })
            if (res.length > 0) {
              return res[0].title
            } else {
              return ''
            }
          }
        })()
      }
    },
    category () {
      const cate = this.$store.state.category
      return {
        href: config.views.product + `?categoryId=${cate.id}&subId=${cate.id}`,
        id: cate.id,
        title: cate.title
      }
    },
    breadcrumb () {
      if (this.category.id && this.subMenu.id) {
        return [
          this.category,
          this.subMenu
        ]
      } else {
        return []
      }
    }
  }

}
</script>

<style lang="scss" scoped>
  .breadcrumb {
    display: flex;
    margin-bottom: 10px;
    flex-wrap: wrap;
    li {
      a {
        font-size: $small;
        color: $dusty-gray;
      }
      & + li {
        &::before {
          content: "/";
          padding: 0 10px;
          color: $dusty-gray;
        }
      }
    }
  }
</style>
