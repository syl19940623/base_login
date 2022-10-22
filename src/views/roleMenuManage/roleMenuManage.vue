<template>
  <div class="roleMenuManageOut">
    <div class="midOut">
      <div class="leftOut">
        <HbTable
          ref="hbTable"
          :toolbar="true"
          :page="true"
          :tableData="tableData"
          @rowClick="rowClick"
          @loadTable="loadTable"
          @search="loadTable(1)"
          @saveRoleMenu="saveRoleMenu">
        </HbTable>
      </div>
      <div class="rightOut">
        <HbTree ref="hbTree" :data="menuTree" :check="menuTreeCheck" @onCheck="onCheck"></HbTree>
      </div>
    </div>
  </div>
</template>

<script>
  import HbTable from "@/components/HbTable/HbTable";
  import HbTree from "@/components/HbTree/HbTree";

  export default {
    name: 'roleMenuManage',
    components: {
      HbTable,
      HbTree
    },
    data() {
      return {
        tableData: {
          toolbarList: [
            {
              type: 'text',
              prop: 'name',
              label: '用户名称'
            },
            {
              type: 'text',
              prop: 'showName',
              label: '用户描述'
            },
            {
              type: 'primary',
              text: '查询',
              event: 'search'
            },
            {
              type: 'primary',
              text: '保存',
              event: 'saveRoleMenu'
            }
          ],
          toolbarData: {
            name: '',
            showName: ''
          },
          headData: [
            {
              prop: 'name',
              label: '角色名称'
            },
            {
              prop: 'showName',
              label: '角色描述'
            }
          ],
          bodyData: [],
          count: 0
        },
        menuTree: [],
        tableCurrentRowId: 0,
        menuTreeCheck: {
          enable: true,
          chkboxType: {
            'Y': 'p',
            'N': 'p'
          }
        }
      }
    },
    methods: {
      loadTable(page, limit) {
        const sendData = this.tableData.toolbarData
        sendData.page = page ?? this.$refs.hbTable.pageNum
        sendData.limit = limit ?? this.$refs.hbTable.pageSize
        this.$post('role/getPaging', sendData).then(res => {
          if (res.code == 0) {
            this.tableData.bodyData = res.data
            this.tableData.count = res.count
          }
        })
      },
      rowClick(data) {
        this.tableCurrentRowId = data.id_prikey
        this.$post('role/getRoleMenus', {
          id_prikey: data.id_prikey
        }).then(res => {
          if (res.code == 0) {
            this.$refs.hbTree.checkAllNodes(false)
            const checkedNodes = res.data
            for (let v of checkedNodes) {
              const checkedNode = this.$refs.hbTree.getNodeByParam('value', v)
              this.$refs.hbTree.checkNode(checkedNode, true, true)
            }
          }
        })
      },
      loadTree() {
        this.$post('menu/getTreeAll').then(res => {
          if (res.code == 0) {
            this.menuTree = res.data
          }
        })
      },
      onCheck(event, treeId, treeNode) {
        const valueArr = []
        const checkedValueArr = this.getChildren(valueArr, treeNode);
        for (let v of checkedValueArr) {
          const node = this.$refs.hbTree.getNodeByParam("value", v, null);
          this.$refs.hbTree.checkNode(node, treeNode.checked, treeNode.checked);
        }
      },
      getChildren(valueArr, treeNode) {
        valueArr.push(treeNode.value);
        if (treeNode.isParent) {
          for (const obj in treeNode.children) {
            this.getChildren(valueArr, treeNode.children[obj]);
          }
        }
        return valueArr;
      },
      saveRoleMenu() {
        if (this.tableCurrentRowId == 0) {
          this.$message({
            message: '请先选择一个角色',
            type: 'error',
            duration: 1000
          });
        } else {
          let totalCheckedNodes = this.$refs.hbTree.getCheckedNodes(true)
          let totalCheckedNodeKey = []
          for (let v of totalCheckedNodes) {
            totalCheckedNodeKey.push(v.value)
          }
          this.$post('role/addMenu', {
            roleId: this.tableCurrentRowId,
            menuIds: totalCheckedNodeKey
          }).then(res => {
            this.$message({
              message: res.msg,
              type: 'info',
              duration: 1000
            });
          })
        }
      }
    },
    mounted() {
      this.loadTable()
      this.loadTree()
    }
  }
</script>

<style lang="less" scoped>
  .roleMenuManageOut{
    .midOut{height: 100vh;
      .leftOut{width: 70%;float: left;border-right: 1px solid #EBEEF5;height: 100%;}
      .rightOut{width: 30%;float: left;height: 100%;overflow: auto;}
    }
  }
</style>