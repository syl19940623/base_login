<template>
  <div>
    <HbTable
      ref="hbTable"
      :toolbar="true"
      :bar="true"
      :page="true"
      :table-data="tableData"
      first-column-type="index"
      @loadTable="loadTable"
      @search="loadTable"
      @add="add"
      @edit="edit"
      @del="del"
      @bindUser="bindUser">
    </HbTable>

    <Dialog :show.sync="operateRoleShow" title="角色信息" width="500px" height="450px" :btn="['保存', '取消']" @dialogOperate="dialogOperate" @dialogEnd="dialogEnd">
      <div slot="vNode">
        <HbForm ref="hbForm" :hb-form="operateRoleForm" :hb-form-data="operateRoleFormData"></HbForm>
      </div>
    </Dialog>

    <Dialog :show.sync="bindUserShow" title="绑定用户" width="700px" height="638px" :btn="['绑定','取消']" @dialogOperate="bindUserDialogOperate">
      <div slot="vNode">
        <bindUser ref="bindUser" :data="bindUserData"></bindUser>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import HbTable from "@/components/HbTable/HbTable";
  import Dialog from "@/components/Dialog/Dialog";
  import HbForm from "@/components/HbForm/HbForm";
  import bindUser from "@/views/roleManage/bindUser/bindUser";
  import { util } from "@/utils/util";

  export default {
    name: "roleManage",
    components: {
      HbTable,
      Dialog,
      HbForm,
      bindUser
    },
    data() {
      return {
        tableData: {
          toolbarList: [
            {
              type: 'text',
              prop: 'name',
              label: '角色名称'
            },
            {
              type: 'text',
              prop: 'showName',
              label: '角色描述'
            },
            {
              type: 'primary',
              text: '查询',
              event: 'search'
            },
            {
              type: 'primary',
              text: '添加',
              event: 'add'
            }
          ],
          toolbarData: {},
          barList: [
            {
              type: 'primary',
              text: '修改',
              event: 'edit'
            },
            {
              type: 'danger',
              text: '删除',
              event: 'del',
              confirm: true
            },
            {
              type: 'warning',
              text: '绑定用户',
              event: 'bindUser'
            }
          ],
          headData: [
            {
              prop: 'name',
              label: '角色名称'
            },
            {
              prop: 'showName',
              label: '角色描述'
            },
            {
              prop: 'disabled',
              label: '角色状态',
              format: (d) => {
                if (d.disabled == 0) {
                  return '启用'
                } else {
                  return '停用'
                }
              }
            }
          ],
          bodyData: [],
          count: 0
        },
        operateRoleShow: false,
        operateRoleForm: {
          list: [
            {
              type: 'text',
              label: '角色名称',
              prop: 'name'
            },
            {
              type: 'text',
              label: '角色描述',
              prop: 'showName'
            },
            {
              type: 'select',
              label: '角色状态',
              prop: 'disabled',
              options: [
                {
                  label: '启用',
                  value: 0
                },
                {
                  label: '停用',
                  value: 1
                }
              ]
            }
          ]
        },
        operateRoleFormData: {
          name: '',
          showName: '',
          disabled: false
        },
        currentId: '',
        bindUserShow: false,
        bindUserData: []
      }
    },
    methods: {
      loadTable() {
        const sendData = this.tableData.toolbarData
        sendData.page = this.$refs.hbTable.pageNum
        sendData.limit = this.$refs.hbTable.pageSize
        this.$post('role/getPaging', sendData).then(res => {
          if (res.code == 0) {
            this.tableData.bodyData = res.data
            this.tableData.count = res.count
          }
        })
      },
      add() {
        this.currentId = ''
        this.operateRoleShow = true
      },
      edit(data, index) {
        this.currentId = data.id_prikey
        Object.assign(this.operateRoleFormData, data)
        this.operateRoleShow = true
      },
      dialogOperate(index) {
        if (index == 0) {
          const sendData = {}
          Object.assign(sendData, this.operateRoleFormData)
          let url = 'role/add'
          if (this.currentId) {
            sendData.id_prikey = this.currentId
            url = 'role/set'
          }
          this.$post(url, sendData).then(res => {
            util.axiosCb(res, () => {
              this.operateRoleShow = false
              this.loadTable()
            })
          })
        }
      },
      dialogEnd() {
        this.$data.operateRoleFormData = this.$options.data().operateRoleFormData
      },
      del(data, index) {
        this.$post('role/remove', {
          id_prikey: data.id_prikey
        }).then(res => {
          util.axiosCb(res, this.loadTable())
        })
      },
      bindUser(data, index) {
        this.bindUserData = data
        this.bindUserShow = true
      },
      bindUserDialogOperate(index) {
        if (index == 0) {
          const userIdList = []
          for (let v of this.$refs.bindUser.userTableData.bodyData) {
            userIdList.push(v.value.replace('user_', ''))
          }
          this.$post('role/addUser', {
            roleId: this.bindUserData.id_prikey,
            userIds: userIdList
          }).then(res => {
            util.axiosCb(res, this.bindUserShow = false)
          })
        }
      }
    },
    mounted() {
      this.loadTable()
    }
  }
</script>

<style lang="less" scoped>

</style>