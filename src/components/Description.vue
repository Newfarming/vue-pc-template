<template>
  <div class="description">
    <table>
      <tr v-for="desc in descriptions.slice(0, 5)" :key="desc.key + desc.value">
        <td>{{desc.key}}</td>
        <td>{{desc.value}}</td>
      </tr>
    </table>
    <div class="desc-more" :class="{active: isToggle}">
      <table>
        <tr v-for="desc in descriptions.slice(6)" :key="desc.key + desc.value">
          <td>{{desc.key}}</td>
          <td>{{desc.value}}</td>
        </tr>
      </table>
    </div>
    <div class="toggle-more" v-if="hasMore" @click="onSeeMoreToggle">{{toggleText}}</div>
  </div>

</template>

<script>
export default {
  props: {
    descriptions: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isToggle: false
    }
  },
  methods: {
    onSeeMoreToggle () {
      this.isToggle = !this.isToggle
    }
  },

  computed: {
    hasMore () {
      return this.descriptions && this.descriptions.length > 5
    },

    toggleText () {
      return this.isToggle ? 'See Less' : 'See More'
    }
  }
}
</script>

<style lang="scss" scoped>
  .description {
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: $small;
      tr {
        border-bottom: 1px solid $mecury;
        td {
          width: 50%;
          padding: 10px 0;
          &:last-child {
            border-left: 1px solid $mecury;
            text-align: right;
            color: $dusty-gray;
          }
        }
      }
    }
    .desc-more {
      height: 0;
      display: none;
      transition: height 0.3s;
      &.active {
        display: block;
        height: auto;
      }
    }
    .toggle-more {
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-bottom: 1px solid $mecury;
      cursor: pointer;
    }
  }
</style>
