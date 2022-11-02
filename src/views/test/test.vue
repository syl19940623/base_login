<template>
  <div>
    <HbTable :table-data="tableData" :bar="true"></HbTable>
  </div>
</template>

<script>
  import HbTable from "@/components/HbTable/HbTable";

  export default {
    name: "test",
    components: {
      HbTable
    },
    data() {
      return {
        tableData: {
          barList: [
            {
              type: 'primary',
              text: '修改',
              event: 'edit',
              if: 'name!=张三'
            },
            {
              type: 'danger',
              text: '删除',
              event: 'del',
              confirm: true
            }
          ],
          headData: [
            {
              prop: 'name',
              label: '姓名'
            }
          ],
          bodyData: [
            {
              name: '张三'
            },
            {
              name: '李四'
            }
          ]
        }
      }
    }
  }
</script>

<style lang="less" scoped>

</style>