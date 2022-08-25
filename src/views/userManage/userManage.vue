<template>
  <div class="userManageOut">
    <HbTable
      ref="hbTable"
      :toolbar="true"
      :bar="true"
      :page="true"
      :tableData="tableData"
      first-column-type="index"
      @loadTable="loadTable"
      @search="loadTable"
      @add="add"
      @edit="edit"
      @del="del"
      @bindRole="bindRole"
      @bindDept="bindDept">
    </HbTable>

    <Dialog :show.sync="operateUserShow" title="用户信息" width="500px" height="66%" :btn="['保存', '取消']" @dialogOperate="dialogOperate" @dialogEnd="dialogEnd">
      <div slot="vNode">
        <HbForm ref="hbForm" :hb-form="operateUserForm" :hb-form-data="operateUserFormData"></HbForm>
      </div>
    </Dialog>

    <Dialog :show.sync="bindRoleShow" :btn="['关闭']" width="742px" title="绑定角色">
      <div slot="vNode">
        <bindRole :data="bindRoleData"></bindRole>
      </div>
    </Dialog>

    <Dialog :show.sync="bindDeptShow" :btn="['保存', '取消']" width="350px" height="550px" title="绑定部门" @dialogOperate="bindDeptDialogOperate">
      <div slot="vNode">
        <bindDept ref="bindDept" :data="bindDeptData"></bindDept>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import HbTable from '@/components/HbTable/HbTable';
  import Dialog from '@/components/Dialog/Dialog';
  import HbForm from '@/components/HbForm/HbForm';
  import bindRole from './bindRole/bindRole';
  import bindDept from './bindDept/bindDept';
  import { Base64 } from 'js-base64';
  import { util } from '@/utils/util.js';

  export default {
    name: 'userManage',
    components: {
      HbTable,
      Dialog,
      HbForm,
      bindRole,
      bindDept
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
              text: '角色归属',
              event: 'bindRole'
            },
            {
              type: 'warning',
              text: '部门权限',
              event: 'bindDept'
            }
          ],
          headData: [
            {
              prop: 'name',
              label: '用户名称'
            },
            {
              prop: 'showName',
              label: '用户描述'
            },
            {
              prop: 'deptName',
              label: '所在部门'
            },
            {
              prop: 'disabled',
              label: '用户状态',
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
        operateUserShow: false,
        operateUserForm: {
          list: [
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
              type: 'password',
              prop: 'pass',
              label: '用户密码',
              showPassword: true
            },
            {
              prop: 'deptId',
              label: '所在部门',
              type: 'cascader',
              showAllLevels: false,
              filterable: true,
              options: []
            },
            {
              type: 'select',
              prop: 'disabled',
              label: '用户状态',
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
        operateUserFormData: {
          name: '',
          showName: '',
          pass: '',
          deptId: '',
          disabled: ''
        },
        currentId: '',
        bindRoleShow: false,
        bindRoleData: {},
        bindDeptShow: false,
        bindDeptData: {}
      }
    },
    methods: {
      loadTable() {
        const sendData = this.tableData.toolbarData
        sendData.page = this.$refs.hbTable.pageNum
        sendData.limit = this.$refs.hbTable.pageSize
        this.$post('user/getPaging', sendData).then(res => {
          if (res.code == 0) {
            this.tableData.bodyData = res.data
            this.tableData.count = res.count
          }
        })
      },
      loadDept() {
        this.$post('dept/getTreeChildrenData').then(res => {
          if (res.code == 0) {
            util.getObjectArrayByKey(this.operateUserForm.list, 'prop', 'deptId').options = res.data
          }
        })
      },
      add() {
        this.currentId = ''
        this.loadDept()
        this.operateUserShow = true
      },
      edit(data, index) {
        this.currentId = data.id_prikey
        this.loadDept()
        this.$post('user/getById', {
          id_prikey: this.currentId
        }).then(res => {
          if (res.code == 0) {
            this.operateUserFormData = res.data
            this.operateUserShow = true
          }
        })
      },
      dialogOperate(index) {
        if (index == 0) {
          const sendData = {}
          Object.assign(sendData, this.operateUserFormData)
          if (typeof sendData.deptId != 'string') {
            sendData.deptId = sendData.deptId[sendData.deptId.length - 1]
          }
          sendData.pass = Base64.encode(sendData.pass)
          let url = 'user/add'
          if (this.currentId) {
            sendData.id_prikey = this.currentId
            url = 'user/set'
          }
          this.$post(url, sendData).then(res => {
            util.axiosCb(res, () => {
              this.operateUserShow = false
              this.loadTable()
            })
          })
        }
      },
      dialogEnd() {
        this.$data.operateUserFormData = this.$options.data().operateUserFormData
      },
      del(data, index) {
        this.$post('user/remove', {
          id_prikey: data.id_prikey
        }).then(res => {
          util.axiosCb(res, this.loadTable())
        })
      },
      bindRole(data, index) {
        this.bindRoleData = data
        this.bindRoleShow = true
      },
      bindDept(data, index) {
        this.currentId = data.id_prikey
        this.bindDeptData = data
        this.bindDeptShow = true
      },
      bindDeptDialogOperate(index) {
        if (index == 0) {
          this.$post('user/setUserDept', {
            userId: this.currentId,
            depts: this.$refs.bindDept.checkedKeys
          }).then(res => {
            util.axiosCb(res, this.bindDeptShow = false)
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