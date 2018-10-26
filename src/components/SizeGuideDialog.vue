<template>
  <div class="size-chart-dialog">
    <a href="javascript:" @click="visiable=true">{{ $t('size.size_guide') }}</a>
    <el-dialog :visible.sync="visiable">
      <div slot="title">
        <img :src="logo" class="logo">
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="genDisplayName(data)" :name="data.id" v-for="data in sizeChartData" :key="data.id">
          <table >
            <thead>
              <tr>
                <th v-for="header in data.header" :key="header.name">{{header.title}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(body, index) in data.data" :key="index">
                <td v-for="header in data.header" :key="header.name">
                  <div v-if="body[header.name].indexOf('/') > -1" class='td-div' v-html="'<span>' +body[header.name].replace('/', '</span><span>/</span><span>')+'</span>'">
                  </div>
                  <div v-else>{{body[header.name]}}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>

</template>

<script>
import logo from 'assets/image/logo.png'
import { getSizeChartByCategoryId, getSizeChart } from 'assets/js/size'
export default {
  props: {
    categoryIds: {
      type: Array,
      required: true
    }
  },
  data () {
    /**
     * Children's Shoes =>>>>>> 32212
     * Baby Shoes =>>>>>>>>> 200002101
     * Men's Shoes =>>>>>>>> [72,100001617,200002158,100001619,200002118,100001618]
     * Women's Shoes =>>>>>> [200002161,100001607,100001611,200002155,200002164,100001610,200002157]
     */
    return {
      logo: logo,
      visiable: false,
      UStoUKCategory: [

      ]
    }
  },
  methods: {
    genDisplayName (data) {
      console.log('genDisplayName', data)
      return data.sizeType ? `${data.displayName}(${data.sizeType})` : data.displayName
    }
  },
  computed: {
    sizeChartData () {
      let sizeCharts = this.categoryIds.map(id => {
        return getSizeChartByCategoryId(id + '')
      }).reduce((a, b) => {
        return a.concat(b)
      }, [])
      sizeCharts = Array.from(new Set(sizeCharts))
      return sizeCharts.map(item => {
        let sizeChartItem = getSizeChart(item)
        console.log('sizeChartItem', sizeChartItem)
        let data = sizeChartItem.data
        let header = data[0].map((item, index) => {
          return {
            name: `header-${index}`,
            title: item
          }
        })
        let tableData = data.slice(1).map(item => {
          let tmp = {}
          item.map((value, i) => {
            tmp[`header-${i}`] = value
          })
          return tmp
        })
        return {
          header: header,
          data: tableData,
          displayName: sizeChartItem.display_name,
          id: sizeChartItem.id,
          sizeType: sizeChartItem.size_type
        }
      })
    },
    activeName: {
      get () {
        return this.sizeChartData && this.sizeChartData.length > 0 ? this.sizeChartData[0].id : ''
      },
      set (value) {
        // 只要给一个setter方法即可，什么也不用做...
        console.log('value: ', value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .size-chart-dialog /deep/ {
    a {
      color: $havelock-blue;
    }
    .logo {
      height: 20px;
    }

    .el-tabs__item {
      &.is-active {
        color: $flamingo;
      }
      &:hover {
        color: $flamingo;
      }
    }
    .el-tabs__active-bar {
      background-color: $flamingo;
    }
    table {
      width: 100%;
      font-size: 14px;
      color: #606266;
      border-collapse: collapse;
      table-layout: fixed;
      thead {
        color: #909399;
        font-weight: 500;
        text-align: left;
        th {
          padding-left: 10px;
        }
      }
      tr {
        border-bottom: solid 1px #ebeef6;
        height: 48px;
        &+:nth-child(even) {
          background: #fafafa;
        }
        &:hover {
          background: #F9A196;
        }
        td {
          padding-left: 10px;
          .td-div{
            display: flex;
            span{
              width:20%;
            }
          }
        }
      }
    }
  }
</style>
