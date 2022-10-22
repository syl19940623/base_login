<template>
  <div class="systemLog">
    <HbTable
      ref="hbTable"
      :table-data="tableData"
      :toolbar="true"
      :page="true"
      first-column-type="index"
      @loadTable="loadTable"
      @search="loadTable">
    </HbTable>
  </div>
</template>

<script>
  import HbTable from "@/components/HbTable/HbTable";
  import { util } from "@/utils/util";

  export default {
    name: "systemLog",
    components: {
      HbTable
    },
    data() {
      return {
        tableData: {
          loading: true,
          toolbarList: [
            {
              type: 'select',
              prop: 'dateNum',
              label: '日志日期',
              options: []
            },
            {
              type: 'primary',
              text: '查询',
              event: 'search'
            }
          ],
          toolbarData: {
            dateNum: ''
          },
          headData: [
            {
              prop: 'logTime',
              label: '请求时间'
            },
            {
              prop: 'userId',
              label: '用户id'
            },
            {
              prop: 'ip',
              label: '请求ip'
            },
            {
              prop: 'logType',
              label: '日志类型'
            },
            {
              prop: 'url',
              label: '请求方法'
            },
            {
              prop: 'time',
              label: '耗时',
              template: (d) => {
                return d.time + 'ms'
              }
            },
            {
              prop: 'msg',
              label: '日志内容'
            },
            {
              prop: 'errorMsg',
              label: '错误日志'
            }
          ],
          bodyData: []
        }
      }
    },
    methods: {
      loadTable() {
        const sendData = this.tableData.toolbarData
        sendData.page = this.$refs.hbTable.pageNum
        sendData.limit = this.$refs.hbTable.pageSize
        this.$post('log/getPaging', sendData).then(res => {
          if (res.code == 0) {
            this.tableData.loading = false
            this.tableData.bodyData = res.data
            this.tableData.count = res.count
          }
        })
      },
      loadLogDate() {
        this.$post('log/getLogDateList').then(res => {
          if (res.code == 0) {
            util.getObjectArrayByKey(this.tableData.toolbarList, 'prop', 'dateNum').options = res.data
            if (res.data.length > 0) {
              this.tableData.toolbarData.dateNum = res.data[0].value
            }
            this.$nextTick(() => {
              this.loadTable()
            })
          }
        })
      }
    },
    mounted() {
      this.loadLogDate()
    }
  }
</script>

<style lang="less" scoped>

</style>