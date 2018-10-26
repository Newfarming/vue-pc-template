<template>
  <div>
    <span>{{title}}</span>
    <ul>
      <li v-for="item in sortItems" :key="item" :class="{active: activeItem === item}" @click="handleClick(item)">{{item}}</li>
    </ul>
  </div>
</template>

<script>
import utils from 'assets/js/utils'
export default {
  data () {
    return {
    }
  },
  methods: {
    handleClick (item) {
      this.$store.commit('activeSortItem', item)
      let query = utils.parseQueryString()
      query.sort_by = item
      window.history.replaceState({}, null, window.location.pathname + utils.encodeQueryString(query))
    }
  },
  computed: {
    sortInfo () {
      return this.$store.getters.sortInfo
    },
    title () {
      return this.sortInfo.title ? this.sortInfo.title + ' :' : ''
    },
    sortItems () {
      return this.sortInfo.values
    },
    activeItem () {
      return this.$store.state.activeSortItem
    }
  }
}
</script>

<style lang="scss" scoped>
  ul {
    display: inline-flex;
    li {
      margin-left: 20px;
      color: $dove-gray;
      cursor: pointer;
      &.active {
        color: $flamingo;
      }
    }
  }
</style>
