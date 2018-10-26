<template>
  <div class="filter">
    <div class="title">
      <span>{{filterItem.length ? 'Filtering by' : 'Filters'}}</span>
      <span class="clear" v-if="filterItem.length" @click="clear">Clear All</span>
    </div>
    <div class="filtering">
      <div class="filtering-item" v-for="(_, index) in filterItem" :key="index" @click="deleteFilter(_)">{{_.value}} <i class="iconfont icon-guanbi_cp"></i></div>
    </div>
    <div class="item">
      <div class="item-top">
        <div class="item-name">
          Pirce
        </div>
        <div class="item-sub"></div>
      </div>
      <div class="item-price">
        <el-slider
          ref="slider"
          :format-tooltip="formatTooltip"
          v-model="priceRange"
          range
          :max="price.length - 1">
        </el-slider>
        <div class="item-select">
          <select-comp :selectData="minSelectData" v-model="priceRange[0]" @change="selectChange('min')"></select-comp>
          <span>-</span>
          <select-comp :selectData="maxSelectData" v-model="priceRange[1]" @change="selectChange('max')"></select-comp>
        </div>
      </div>
    </div>
    <div class="item" v-if="filter.color.length">
      <div class="item-top">
        <div class="item-name">
          Color
        </div>
        <div class="item-sub"></div>
      </div>
      <div class="item-content" ref="color">
        <div class="filter-value" :class="{select: colorValue.indexOf(_) > -1}" v-for="(_, index) in filter.color" :key="index" @click="onFilterItemClick('color', _)">{{_}}</div>
      </div>
      <div class="item-show-btn" @click="show('color')">
        {{showColorText ? 'Show Less' : 'Show All'}}
      </div>
    </div>
    <div class="item" v-if="filter.size.length">
      <div class="item-top">
        <div class="item-name">
          Size
        </div>
        <div class="item-sub"></div>
      </div>
      <div class="item-content" ref="size">
        <div class="filter-value" :class="{select: sizeValue.indexOf(_) > -1}" v-for="(_, index) in filter.size" :key="index" @click="onFilterItemClick('size', _)">{{_}}</div>
      </div>
      <div class="item-show-btn" @click="show('size')">
        {{showSizeText ? 'Show Less' : 'Show All'}}
      </div>
    </div>
  </div>
</template>

<script>
import utils from 'assets/js/utils'
import config from 'assets/js/conf'
import SelectComp from 'components/SelectComp'

export default {
  components: {
    SelectComp
  },
  data () {
    return {
      symbol: utils.getSymbol(),
      priceRange: [0, 0],
      minSelectData: {
        title: '',
        width: '45%',
        option: [],
        placeholder: 'Min'
      },
      maxSelectData: {
        title: '',
        width: '45%',
        option: [],
        placeholder: 'Max'
      },
      colorValue: [],
      sizeValue: [],
      showColorText: false,
      showSizeText: false,
      range: [],
      mounted: false
    }
  },
  created () {
    let query = utils.parseQueryString()
    if (query.filter) {
      let q = JSON.parse(query.filter)
      if (q.Color) {
        this.colorValue = q.Color
      }
      if (q.Size) {
        this.sizeValue = q.Size
      }
      if (q.Price) {
        this.range = [q.Price[0].beg, q.Price[0].end]
      }
    }
  },
  mounted () {
    this.mounted = true
    // this.$nextTick(() => {
    //   console.log('colorElement', this.$refs.color.clientHeight)
    // })
  },
  methods: {
    filterProduct () {
      let query = utils.parseQueryString()
      let filter = {}
      let hasFilter = false
      if (this.colorValue.length) {
        filter.Color = this.colorValue
        hasFilter = true
      }
      if (this.sizeValue.length) {
        filter.Size = this.sizeValue
        hasFilter = true
      }
      if (this.priceValue[0] !== 'Min' || this.priceValue[1] !== 'Max') {
        filter.Price = [{
          beg: this.priceValue[0] === 'Min' || this.priceValue[0] === 'Max' ? 0 : this.priceValue[0],
          end: this.priceValue[1] === 'Max' || this.priceValue[1] === 'Min' ? 0 : this.priceValue[1]
        }]
        hasFilter = true
      }
      if (hasFilter) {
        query.filter = JSON.stringify(filter)
        window.history.replaceState({}, null, config.views.product + utils.encodeQueryString(query))
        this.$store.commit('filterChange', filter)
      } else {
        delete query.filter
        window.history.replaceState({}, null, config.views.product + utils.encodeQueryString(query))
        this.$store.commit('filterChange', '')
      }
    },
    deleteFilter (deleteItem) {
      console.log('deleteItem', deleteItem)
      this.sizeValue = this.sizeValue.filter(item => {
        return item !== deleteItem.key
      })
      this.colorValue = this.colorValue.filter(item => {
        return item !== deleteItem.key
      })
      if (deleteItem.key === 'price') {
        this.priceRange = [0, this.price.length - 1]
      }
    },
    clear () {
      this.sizeValue = []
      this.colorValue = []
      this.priceRange = [0, this.price.length - 1]
    },
    formatTooltip (val) {
      return this.price[parseInt(val)]
    },
    onFilterItemClick (type, value) {
      if (type === 'color') {
        let index = this.colorValue.indexOf(value)
        if (index === -1) {
          this.colorValue.push(value)
        } else {
          this.colorValue.splice(index, 1)
        }
      } else if (type === 'size') {
        let index = this.sizeValue.indexOf(value)
        if (index === -1) {
          this.sizeValue.push(value)
        } else {
          this.sizeValue.splice(index, 1)
        }
      }
    },
    show (type) {
      let ele = this.$refs.color
      if (type === 'size') {
        ele = this.$refs.size
        this.showSizeText = !this.showSizeText
      } else {
        this.showColorText = !this.showColorText
      }
      if (!ele.style.maxHeight) {
        ele.style.maxHeight = '1000px'
      } else {
        ele.style.maxHeight = ''
      }
    },
    disableOption () {
      this.maxSelectData.option = this.maxSelectData.option.map(item => {
        if (parseFloat(item.value) <= this.minValue) {
          item.disabled = true
        } else {
          item.disabled = false
        }
        return item
      })
      this.minSelectData.option = this.minSelectData.option.map(item => {
        if (parseFloat(item.value) >= this.maxValue) {
          item.disabled = true
        } else {
          item.disabled = false
        }
        return item
      })
    },
    selectChange () {
      this.$refs.slider && this.$refs.slider.setValues()
    }
  },
  computed: {
    filter () {
      return this.$store.getters.filterInfo
    },
    price () {
      let price = []
      this.filter.price.forEach(_ => {
        if (_.beg === 0) {
          price.push('Min')
        } else {
          price.push(_.beg)
        }
      })
      price.push('Max')
      return price
    },
    priceValue () {
      let min = this.price[parseInt(this.priceRange[0])]
      let max = this.price[parseInt(this.priceRange[1])]
      min = min === 'Max' ? 'Min' : min
      return [min, max]
    },
    filterItem () {
      let item = this.colorValue.map(_ => {
        return {
          key: _,
          value: _
        }
      }).concat(this.sizeValue.map(_ => {
        return {
          key: _,
          value: `${_} Size`
        }
      }))
      if (this.priceValue[0] !== 'Min' || this.priceValue[1] !== 'Max') {
        item.push({
          key: 'price',
          value: `
            ${this.priceValue[0] === 'Min' ? 'Min' : `${this.symbol} ${this.priceValue[0]}`} - 
            ${this.priceValue[1] === 'Max' ? 'Max' : `${this.symbol} ${this.priceValue[1]}`}
          `
        })
      }
      return item || []
    }
  },
  watch: {
    filterItem () {
      this.filterProduct()
    },
    price (price) {
      if (price.length) {
        let min = 0
        let max = price.length - 1
        if (this.range.length) {
          min = this.price.findIndex(item => {
            return item === this.range[0]
          })
          max = this.price.findIndex(item => {
            return item === this.range[1]
          })
          min = min < 0 ? 0 : min
          max = max < 0 ? price.length - 1 : max
        }
        this.priceRange = [min, max]
        this.minSelectData.option = price.slice(0, -1).map((_, index) => {
          return {
            value: index,
            label: _
          }
        })
        this.maxSelectData.option = price.slice(1, price.length).map((_, index) => {
          return {
            value: index + 1,
            label: _
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .filter {
    color: #333;
    .title {
      font-size: $large;
      padding: 20px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .clear {
        color: #666;
        font-size: $small;
        cursor: pointer;
      }
    }
    .filtering {
      border-bottom: solid 1px #E5E5E5;
      padding-bottom: 10px;
      display: flex;
      flex-wrap: wrap;
      .filtering-item {
        color: #666;
        font-size: $small;
        cursor: pointer;
        margin: 5px 10px;
        i {
          font-size: $small;
        }
      }
    }
    .item {
      .item-top {
        display: flex;
        justify-content: space-between;
        padding: 15px 0;
        .item-name {
          font-size: $small;
        }
        .item-sub {
          width: 13px;
          height: 2px;
          background-color: #696969;
          margin-top: 7px;
        }
      }
      .item-show-btn {
        color: $flamingo;
        font-size: $small;
        margin-top: 10px;
        cursor: pointer;
      }
      .item-price {
        position: relative;
        padding: 0 8px;
        .item-select {
          display: flex;
          align-items: center;
          margin-top: -10px;
          span {
            margin: 10px;
            color: #666;
            margin-top: 20px;
          }
        }
        .el-slider /deep/ {
          .el-slider__runway {
            height: 1px;
            background-color: #e5e5e5;
            .el-slider__bar {
              background: $flamingo;
              height: 2px;
            }
            .el-slider__stop {
              height: 1px;
              width: 1px;
            }
            .el-slider__button-wrapper {
              top: -17px;
              .el-slider__button {
                height: 10px;
                width: 10px;
                border: solid 1px $flamingo;
              }
            }
          }
        }
      }
      .item-content {
        display: flex;
        flex-wrap: wrap;
        height: auto;
        max-height: 105px;
        overflow: hidden;
        transition: all 300ms;
        .filter-value {
          cursor: pointer;
          font-size: $small;
          color: #333;
          border: solid 1px #E5E5E5;
          padding: 5px 10px;
          margin-right: 10px;
          margin-top: 5px;
          &.select {
            border-color: $flamingo;
            color: $flamingo;
          }
        }
      }
    }
  }
</style>
