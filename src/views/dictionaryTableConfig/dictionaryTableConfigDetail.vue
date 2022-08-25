<template>
  <div>
    <HbTable
      ref="basicTable"
      :toolbar="true"
      :bar="true"
      :tableData="tableData">
      <div slot="toolbar">
        <el-form size="small">
          <el-form-item>
            <el-button type="primary" @click="add">新增</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template slot="bar" slot-scope="scope">
        <el-link type="primary" @click="edit(scope.data)">编辑</el-link>
        <el-popconfirm title="您确定要删除该数据吗？" @confirm="del(scope.data)">
          <el-link slot="reference" type="danger">删除</el-link>
        </el-popconfirm>
      </template>
    </HbTable>

    <Dialog :show.sync="show" :btn="['保存', '取消']" width="500px" @dialogOperate="dialogOperate">
      <div slot="vNode" style="padding: 15px;">
        <el-form label-position="right" label-width="70px">
          <el-form-item label="项目">
            <el-input placeholder="请输入项目" v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="表名">
            <el-input placeholder="请输入表名" v-model="formData.tableName"></el-input>
          </el-form-item>
          <el-form-item label="编码级次">
            <el-input placeholder="请输入编码级次" v-model="formData.attr"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import HbTable from "@/components/HbTable/HbTable";
  import Dialog from "@/components/Dialog/Dialog";
  import { util } from "@/utils/util";

  export default {
    name: "DictionaryTableConfigDetail",
    components: {
      HbTable,
      Dialog
    },
    data() {
      return {
        tableData: {
          headData: [
            {
              prop: 'name',
              label: '项目'
            },
            {
              prop: 'tableName',
              label: '表名'
            },
            {
              prop: 'attr',
              label: '编码级次'
            },
            {
              prop: 'path',
              label: '请求地址'
            }
          ],
          bodyData: []
        },
        show: false,
        formData: {
          name: '',
          attr: '',
          tableName: ''
        },
        operateFlag: ''
      }
    },
    methods: {
      loadTable() {
        this.$post('simpleDictable/config/getAll').then(res => {
          if (res.code == 0) {
            this.tableData.bodyData = res.data
          }
        })
      },
      add() {
        this.operateFlag = 'add'
        this.$data.formData = this.$options.data().formData
        this.show = true
      },
      edit(data) {
        this.$post('simpleDictable/config/getById', {
          id: data.id
        }).then(res => {
          if (res.code == 0) {
            this.add()
            this.operateFlag = 'edit'
            this.formData = res.data
          }
        })
      },
      del(data) {
        this.$post('simpleDictable/config/remove', {
          id: data.id
        }).then(res => {
          util.axiosCb(res, this.loadTable())
        })
      },
      dialogOperate(index) {
        if (index == 0) {
          let url = ''
          if (this.operateFlag == 'add') {
            url = 'simpleDictable/config/add'
          } else if (this.operateFlag == 'edit') {
            url = 'simpleDictable/config/set'
          }
          this.$post(url, this.formData).then(res => {
            util.axiosCb(res, () => {
              this.show = false
              this.loadTable()
            })
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