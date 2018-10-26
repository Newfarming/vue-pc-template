<template>
  <div class="sku-choose" :class="{shake: isShake, 'shake-animate': isAnimate}">
    <div v-for="attribute in attributes" :key="attribute.id" class="attr-row">
      <p class="attr-label">
        <span>{{attribute.title}}</span>
        <size-guide-dialog :category-ids="categoryIds" v-if="attribute.title.indexOf('Size') > -1"></size-guide-dialog>
      </p>
      <ul class="attr-group">
        <li v-for="attr in attribute.attrs" :key="attr.attrId"
            :class="{disabled: attr.status === -1, active: attr.status === 1}"
            @click="skuChoose(attribute.id, attr.attrId, attr.status)">
          {{attr.title}}
        </li>
      </ul>
    </div>

    <div class="attr-row quantity">
      <p class="attr-label">
        <span>{{ $t('product.quantity') }}</span>
      </p>
      <quantity-input :min="1" :max="99"></quantity-input>
    </div>
  </div>
</template>

<script>
import QuantityInput from 'components/QuantityInput'
import SizeGuideDialog from 'components/SizeGuideDialog'

export default {
  components: {
    QuantityInput,
    SizeGuideDialog
  },
  props: {
    categoryIds: {
      type: Array,
      default: () => {
        return []
      }
    },
    skuInfo: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  created () {
    this.$bus.$on('add-cart', () => {
      let skuInfo = this.checkForShake()
      if (skuInfo) {
        this.$bus.$emit('sku-selected', skuInfo.skuId)
      }
    })
    this.$bus.$on('buy-now', () => {
      let skuInfo = this.checkForShake()
      console.log('skuInfo====>>>>>>', skuInfo)
      if (skuInfo) {
        this.$bus.$emit('buy-sku-selected', skuInfo.skuId)
      }
    })
  },
  data () {
    return {
      dialogSizeChartVisible: false,
      isShake: false,
      isAnimate: false,
      quantity: 1,
      attributes: [],
      skuMap: {}
    }
  },
  methods: {
    checkForShake () {
      this.isShake = false
      // 收到加入购物车消息，检查用户是否选择了sku
      let attrArray = this.attributes.map(item => {
        return item.attrs.filter(attr => {
          return attr.status === 1
        })[0]
      }).filter(Boolean)
      // 判断是否可以组合
      console.log('attrArray: ', attrArray)
      if (attrArray.length === this.attributes.length) {
        let skuKey = attrArray.map(attr => {
          return attr.attrId
        }).join('-')
        let skuInfo = this.skuMap[skuKey]
        if (skuInfo) {
          return skuInfo
        }
      }
      window.scrollTo(0, 0)
      setTimeout(() => {
        this.isShake = true
        this.isAnimate = true
        setTimeout(() => {
          this.isAnimate = false
        }, 150)
      }, 100)
    },
    // 抄来的，逻辑没看，结果问题不大，但是arr不要只有一个元素就行,
    // 对多个数组进行全排列组合
    doExchange (arr) {
      let len = arr.length
      // 当数组大于等于2个的时候
      if (len >= 2) {
        // 第一个数组的长度
        let len1 = arr[0].length
        // 第二个数组的长度
        let len2 = arr[1].length
        // 2个数组产生的组合数
        let lenBoth = len1 * len2
        //  申明一个新数组
        let items = new Array(lenBoth)
        // 申明新数组的索引
        let index = 0
        for (let i = 0; i < len1; i++) {
          for (let j = 0; j < len2; j++) {
            if (arr[0][i] instanceof Array) {
              items[index] = arr[0][i].concat(arr[1][j])
            } else {
              items[index] = [arr[0][i]].concat(arr[1][j])
            }
            index++
          }
        }
        let newArr = new Array(len - 1)
        for (let i = 2; i < arr.length; i++) {
          newArr[i - 1] = arr[i]
        }
        newArr[0] = items
        return this.doExchange(newArr)
      } else {
        return arr[0]
      }
    },

    skuChoose (id, attrId, status) {
      // todo 这边的选择逻辑还有点问题，以后再调整，先不管了
      console.log(id, attrId, status)
      if (status === -1) {
        console.log('disabled...')
        return false
      }

      // 选出剩余组的数据
      let restAttributes = this.attributes.map(item => {
        if (item.id === id) {
          return item.attrs.filter(attr => {
            if (attr.attrId === attrId) {
              attr.status = attr.status === 0 ? 1 : 0
              return attr.status === 1
            } else if (attr.status === 1) {
              attr.status = 0
            }
            return false
          })
        } else {
          return item.attrs
        }
      }).filter(item => {
        return item && item.length > 0
      })
      console.log('restAttributes---->', restAttributes)
      if (restAttributes.length <= 1) {
        this.attributes.map(item => {
          item.attrs.map(attr => {
            if (attr.status !== 1) {
              attr.status = 0
            }
          })
        })
        return false
      }

      let echangeAttributes = this.doExchange(restAttributes)
      console.log('echangeAttributes---->', echangeAttributes)
      // 在禁用attr之前需要先把其他组所有的禁用attr设置正常,否则禁用后重新选择一个可用的也不会变回
      this.attributes.map(item => {
        if (item.id !== id) {
          item.attrs.map(attr => {
            if (attr.status === -1) {
              attr.status = 0
            }
          })
        }
      })

      echangeAttributes.map(attr => {
        let skuArr = attr.map(item => {
          return item.attrId
        })
        let skuInfo = this.skuMap[skuArr.join('-')]
        if (!skuInfo) {
          skuArr.filter(skuAttrId => {
            return skuAttrId !== attrId
          }).map(skuAttrId => {
            this.attributes.map(item => {
              if (item.id !== id) {
                item.attrs.map(attr => {
                  if (attr.attrId === skuAttrId) {
                    attr.status = -1
                  }
                })
              }
            })
          })
        }
      })
    },
    handleChange (value) {
      console.log(value)
    }
  },
  watch: {
    skuInfo () {
      let hash = {}
      let attrMap = {}
      let dest = []
      let skuMap = {}
      this.skuInfo
        .map(item => {
          let attrInfo = item.attribute_info || []
          // 生成当前sku的组合key
          let skuKey = attrInfo.sort((a, b) => {
            return a.attr_id - b.attr_id
          }).map(item => {
            return item.attr_value_id
          }).join('-')
          skuMap[skuKey] = {
            skuId: item.id,
            productId: item.product_template_id
          }
          return attrInfo
        })
        .reduce((a, b) => {
          return a.concat(b)
        }, [])
        .reduce((a, b) => {
          if (!hash[b.attr_value_id]) {
            hash[b.attr_value_id] = true
            a.push(b)
          }
          return a
        }, [])
        .map(attr => {
          if (!attrMap[attr.attr_id]) {
            dest.push({
              id: attr.attr_id,
              title: attr.attr_name,
              attrs: [{
                attrId: attr.attr_value_id,
                title: attr.attr_value_name,
                status: 0
              }]
            })
            attrMap[attr.attr_id] = true
          } else {
            dest.every(item => {
              if (item.id === attr.attr_id) {
                item.attrs.push({
                  attrId: attr.attr_value_id,
                  title: attr.attr_value_name,
                  status: 0
                })
                return false
              }
              return true
            })
          }
        })
      this.attributes = dest.sort((a, b) => {
        return a.id - b.id
      }).map(item => {
        if (item.title === 'Size' && item.attrs[0]) {
          if (item.attrs[0].title.indexOf('UK') > -1) {
            item.title = `${item.title} - UK/India`
            item.attrs = item.attrs.map(attr => {
              attr.title = attr.title.replace(/\(UK\)/, '')
              return attr
            })
          } else if (item.attrs[0].title.indexOf('US') > -1) {
            item.title = `${item.title} - US`
            item.attrs = item.attrs.map(attr => {
              attr.title = attr.title.replace(/\(US\)/, '')
              return attr
            })
          }
        }
        return item
      })
      this.skuMap = skuMap
    }
  }
}
</script>

<style lang="scss" scoped>
  @keyframes chooseShake {
    0% {
      left: 0;
    }

    33% {
      left: 15px;
    }

    66% {
      left: -15px;
    }

    100% {
      left: 0;
    }
  }

  .sku-choose {
    position: relative;
    &.shake {
      border: 1px solid $flamingo;
      padding: 0 20px 20px 20px;
    }
    &.shake-animate {
      animation: chooseShake 0.15s ease-in-out;
    }
    .attr-row {
      margin-top: 25px;
      font-size: $small;
      .attr-label {
        display: flex;
        justify-content: space-between;
      }
      .attr-group {
        display: flex;
        flex-wrap: wrap;
        li {
          padding: 5px 20px;
          border: 1px solid $mecury;
          cursor: pointer;
          margin-right: 18px;
          margin-top: 8px;

          &.disabled {
            border-style: dashed;
            cursor: not-allowed;
            background: $alabaster;
            color: $mecury;
          }

          &.active {
            color: $flamingo;
            border-color: $flamingo;
          }
        }
      }
    }
  }
</style>
