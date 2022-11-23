<template>
	<div class="passwordManage">
		<HbTable
			ref="hbTable"
			:tableData="tableData"
			:toolbar="true"
			:page="true"
			:bar="true"
			:loading="tableData.loading"
			firstColumnType="index"
			@loadTable="loadTable"
      @search="loadTable"
      @initPassword="initPassword"
      @openLock="openLock"
      @resetPassword="resetPassword">
    </HbTable>

		<Dialog :show.sync="show" :content="content" :btn="['关闭']"></Dialog>
	</div>
</template>

<script>
  import { util } from "@/utils/util";

  export default {
		name: 'passwordManage',
		data() {
			return {
				tableData: {
					loading: true,
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
              text: '初始化密码',
              event: 'initPassword'
            }
          ],
          toolbarData: {},
          barList: [
            {
              type: 'warning',
              text: '解除锁定',
              event: 'openLock',
              confirm: true,
              confirmText: '您确定要解除锁定吗？'
            },
            {
              type: 'danger',
              text: '重置密码',
              event: 'resetPassword',
              confirm: true,
              confirmText: '是否确定重置为随机密码？'
            }
          ],
					headData: [
						{
							prop: 'name',
							label: '用户名称',
						},
						{
							prop: 'showName',
							label: '用户描述',
						},
						{
							prop: 'deptName',
							label: '所在部门',
						},
						{
							prop: 'disabled',
							label: '用户状态',
							format: function (data) {
								if (data.disabled == 0) {
									return '启用'
								} else {
									return '停用'
								}
							},
						},
					],
					bodyData: [],
					count: 0,
				},
				show: false,
				content: ''
			}
		},
		methods: {
			loadTable() {
				const sendData = this.tableData.toolbarData
				sendData.page = this.$refs.hbTable.pageNum
				sendData.limit = this.$refs.hbTable.pageSize
				this.$post('user/getPaging', sendData).then((res) => {
					if (res.code == 0) {
						this.tableData.loading = false
						this.tableData.bodyData = res.data
						this.tableData.count = res.count
					}
				})
			},
			initPassword() {
				this.$confirm('此操作会将所有空密码替换成随机密码，是否确定初始化密码？', '提示', {
					type: 'warning'
				}).then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          this.$post('user/initPass').then(res => {
            loading.close()
            if (res.code == 0) {
              this.content = '初始化密码成功，初始后的密码为' + res.data
              this.show = true
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {})
			},
			openLock(data) {
				this.$post('user/unLock', {
					id_prikey: data.id_prikey
				}).then(res => {
          util.axiosCb(res)
				})
			},
			resetPassword(data) {
				this.$post('user/resetPass', {
					id_prikey: data.id_prikey
				}).then(res => {
					if (res.code == 0) {
						this.content = '重置密码成功，重置后的密码为' + res.data
						this.show = true
					} else {
						this.$message.error(res.msg)
					}
				})
			},
		},
		mounted() {
			this.loadTable()
		}
	}
</script>

<style lang="less" scoped></style>
