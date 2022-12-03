<template>
  <div class="container">
    <div class="left">
      <HbTree
        ref="hbTree"
        :search="true"
        :highlight="false"
        :data="userTreeData"
        :check="{enable: true}"
        @onCheck="onCheck">
      </HbTree>
    </div>
    <div class="right">
      <HbTable :bar="true" :table-data="userTableData" table-height="500px" @removeUser="removeUser"></HbTable>
    </div>
  </div>
</template>

<script>
  export default {
    name: "bindUser",
    props: {
      data: Object
    },
    data() {
      return {
        userTreeData: [],
        userTableData: {
          barList: [
            {
              type: 'danger',
              text: '移除',
              event: 'removeUser'
            }
          ],
          headData: [
            {
              prop: 'label',
              label: '用户名称'
            }
          ],
          bodyData: []
        }
      }
    },
    methods: {
      loadAllUsers() {
        this.$post('dept/getTreeChildrenUserData').then(res => {
          if (res.code == 0) {
            this.userTreeData = res.data
            this.$nextTick(() => {
              this.loadCheckedUsers()
            })
          }
        })
      },
      onCheck(event, treeId, treeNode) {
        const checkedUserNodes = []
        for (let v of this.$refs.hbTree.getCheckedNodes()) {
          if (v.value.indexOf('user_') != -1) {
            checkedUserNodes.push(v)
          }
        }
        this.userTableData.bodyData = checkedUserNodes
      },
      loadCheckedUsers() {
        this.$post('role/getRoleUsers', {
          id_prikey: this.data.id_prikey
        }).then(res => {
          if (res.code == 0) {
            const checkedUserNodes = []
            for (let v of res.data) {
              const node = this.$refs.hbTree.getNodeByParam('value', v)
              this.$refs.hbTree.checkNode(node, true, true)
              checkedUserNodes.push(node)
            }
            this.userTableData.bodyData = checkedUserNodes
          }
        })
      },
      removeUser(data, index) {
        this.userTableData.bodyData.splice(index, 1)
        this.$refs.hbTree.checkNode(data, false, true)
      }
    },
    mounted() {
      this.loadAllUsers()
    }
  }
</script>

<style lang="less" scoped>
  .container{display: flex;
    .left,.right{flex: 1;}
  }
</style>