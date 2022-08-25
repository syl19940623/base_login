<template>
  <div class="dingTalkSameOrganization">
    <div class="topOut">
      <el-form :inline="true" size="medium">
        <el-form-item>
          <el-select label="公司名称" v-model="deptId">
            <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="same" size="small">同步</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="midOut">
      <div class="leftOut">
        <HbTree
          ref="hbTree"
          idKey="deptId"
          pIdKey="parentId"
          nameKey="name"
          :data="treeData"
          :default-expand-all="true"
          @onClick="onclick">
        </HbTree>
      </div>
      <div class="rightOut">
        <HbTable ref="basicTable" :table-data="tableData" tableHeight="full-67"></HbTable>
      </div>
    </div>
  </div>
</template>

<script>
  import HbTree from "@/components/HbTree/HbTree";
  import HbTable from "@/components/HbTable/HbTable";

  export default {
    name: "DingTalkSameOrganization",
    components: {
      HbTree,
      HbTable
    },
    data() {
      return {
        deptList: [],
        deptId: '',
        treeData: [],
        tableData: {
          loading: true,
          headData: [
            {
              prop: 'name',
              label: '姓名'
            },
            {
              prop: 'jobNumber',
              label: '柜员号'
            },
            {
              prop: 'title',
              label: '岗位'
            },
            {
              prop: 'mobile',
              label: '手机号'
            },
            {
              prop: 'userid',
              label: '钉钉id'
            }
          ],
          bodyData: [],
          count: 0
        }
      }
    },
    methods: {
      loadCompanyList() {
        this.$post('common/getMyManagementDept').then(res => {
          if (res.code == 0) {
            this.deptList = res.data
            if (res.data.length > 0) {
              this.deptId = res.data[0].value
            }
          }
        })
      },
      same() {
        const loading = this.$loading({
          lock: true,
          text: '正在数据同步',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$post('dingTalk/synchronous', {
          deptCode: this.deptId
        }).then(res => {
          loading.close();
          this.$message({
            message: res.msg,
            type: 'info',
            duration: 1000,
            onClose: () => {
              if (res.code == 0) {
                this.loadTree()
              }
            }
          })
        })
      },
      loadTree() {
        this.$post('dingTalk/getDeptAll', {
          deptCode: this.deptId
        }).then(res => {
          if (res.code == 0) {
            this.treeData = res.data
            this.$nextTick(() => {
              if (this.treeData != '') {
                const firstSelectedNode = this.$refs.hbTree.getNodeByParam('deptId', this.treeData[0].deptId);
                this.$refs.hbTree.selectNode(firstSelectedNode);
                this.loadCurrentNodeData(firstSelectedNode.deptId)
              }
            })
          }
        })
      },
      onclick(event, treeId, treeNode) {
        this.loadCurrentNodeData(treeNode.deptId)
      },
      loadCurrentNodeData(value) {
        this.$post('dingTalk/getUserAll', {
          deptCode: this.deptId,
          deptId: value
        }).then(res => {
          if (res.code == 0) {
            this.tableData.loading = false
            this.tableData.bodyData = res.data
          }
        })
      }
    },
    watch: {
      deptId(newVal, oldVal) {
        if (newVal != oldVal) {
          this.loadTree()
        }
      }
    },
    mounted() {
      this.loadCompanyList()
    }
  }
</script>

<style lang="less" scoped>
  .dingTalkSameOrganization{
    .topOut{padding: 15px;border-bottom: 1px solid #EBEEF5;}
    .midOut{height: calc(100vh - 67px);
      .leftOut{width: 300px;float: left;border-right: 1px solid #EBEEF5;height: 100%;overflow: auto;}
      .rightOut{width: calc(100% - 300px);float: left;}
    }
  }
</style>

<style lang="less">
  .topOut .el-form-item{margin-bottom: 0;}
</style>