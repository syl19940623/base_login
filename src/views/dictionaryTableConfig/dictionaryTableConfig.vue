<template>
  <div class="dictionaryTableConfig">
    <div class="topOut">
      <el-form size="small" :inline="true">
        <el-form-item>
          <el-button type="warning" @click="config">字典表设置详情</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="midOut">
      <div class="leftOut">
        <HbTable
          ref="leftTable"
          table-height="full-64"
          :tableData="leftTableData"
          @rowClick="rowClick">
        </HbTable>
      </div>
      <div class="rightOut">
        <HbTable
          ref="rightTable"
          table-height="full-64"
          :bar="true"
          :table-data="rightTableData"
          @edit="edit"
          @del="del">
        </HbTable>
      </div>
    </div>
    <Dialog :show.sync="show" :btn="['保存', '取消']" width="500px" @dialogOperate="dialogOperate">
      <div slot="vNode" style="padding: 15px;">
        <el-form label-position="right" label-width="70px">
          <el-form-item label="项目">
            <el-input placeholder="请输入项目" v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="拼音">
            <el-input placeholder="请输入拼音" v-model="formData.spell"></el-input>
          </el-form-item>
          <el-form-item label="属性">
            <el-input placeholder="请输入属性" v-model="formData.attr"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input placeholder="请输入备注" v-model="formData.remark"></el-input>
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
    name: "dictionaryTableConfig",
    components: {
      HbTable,
      Dialog
    },
    data() {
      return {
        leftTableData: {
          defaultCurrentRow: 0,
          headData: [
            {
              prop: 'id',
              label: '代码'
            },
            {
              prop: 'name',
              label: '项目'
            }
          ],
          bodyData: []
        },
        rightTableData: {
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
            }
          ],
          headData: [
            {
              prop: 'id',
              label: '代码'
            },
            {
              prop: 'name',
              label: '项目'
            },
            {
              prop: 'spell',
              label: '拼音'
            },
            {
              prop: 'attr',
              label: '属性'
            },
            {
              prop: 'remark',
              label: '备注'
            }
          ],
          bodyData: []
        },
        currentTableId: '',
        show: false,
        formData: {
          name: '',
          spell: '',
          attr: '',
          remark: ''
        },
        operateFlag: ''
      }
    },
    methods: {
      loadLeftTable() {
        this.$post('simpleDictable/config/getAll').then(res => {
          if (res.code == 0) {
            this.leftTableData.bodyData = res.data
            if (res.data.length > 0) {
              this.currentTableId = res.data[0].id
              this.loadRightTable()
            }
          }
        })
      },
      loadRightTable() {
        this.$post('simpleDictable/lists/' + this.currentTableId).then(res => {
          if (res.code == 0) {
            this.rightTableData.bodyData = res.data
          }
        })
      },
      config() {
        window.parent.postMessage({
          data: {
            name: '字典表设置详情',
            url: 'dictionaryTableConfigDetail'
          }
        },'*')
      },
      add() {
        this.operateFlag = 'add'
        this.$data.formData = this.$options.data().formData
        this.show = true
      },
      rowClick(data) {
        this.leftTableData.defaultCurrentRow = -1
        this.currentTableId = data.id
        this.loadRightTable()
      },
      edit(data) {
        this.$post('simpleDictable/getById/' + this.currentTableId, {
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
        this.$post('simpleDictable/remove/' + this.currentTableId, {
          id: data.id
        }).then(res => {
          util.axiosCb(res, this.loadRightTable())
        })
      },
      dialogOperate(index) {
        if (index == 0) {
          let url = ''
          if (this.operateFlag == 'add') {
            url = 'simpleDictable/add/' + this.currentTableId
          } else if (this.operateFlag == 'edit') {
            url = 'simpleDictable/set/' + this.currentTableId
          }
          this.$post(url, this.formData).then(res => {
            util.axiosCb(res, () => {
              this.show = false
              this.loadRightTable()
            })
          })
        }
      }
    },
    mounted() {
      this.loadLeftTable()
    }
  }
</script>

<style lang="less" scoped>
  .dictionaryTableConfig{
    .topOut{padding: 15px;border-bottom: 1px solid #EBEEF5;}
    .midOut{height: calc(100vh - 64px);
      .leftOut{width: 300px;float: left;border-right: 1px solid #EBEEF5;height: 100%;overflow: auto;}
      .rightOut{width: calc(100% - 300px);height: 100%;float: left;}
    }
  }
</style>

<style lang="less">
  .topOut .el-form-item{margin-bottom: 0;}
  .rightOut .el-select{width: 100%;}
</style>