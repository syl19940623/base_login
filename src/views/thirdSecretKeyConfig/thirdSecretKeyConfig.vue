<template>
  <div class="thirdSecretKeyConfig">
    <el-table
      :data="tableData"
      border
      size="small"
      style="width: 100%;">
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="menuName"
        label="菜单名称">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="appId"
        label="账号">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="secret"
        label="密钥">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="num"
        label="次数">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-link type="primary" @click="create(scope.row)" v-if="scope.row.appId == undefined">生成</el-link>
          <el-popconfirm title="您确定要重置密钥吗？" @confirm="reset(scope.row)" v-if="scope.row.appId != undefined">
            <el-link slot="reference" type="warning">重置</el-link>
          </el-popconfirm>
          <el-popconfirm title="您确定要清空密钥吗？" @confirm="empty(scope.row)" v-if="scope.row.appId != undefined">
            <el-link slot="reference" type="danger">清空</el-link>
          </el-popconfirm>
          <el-link type="success" @click="copy(scope.row)" v-if="scope.row.appId != undefined">复制</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { util } from "@/utils/util";

  export default {
    name: "ThirdSecretKeyConfig",
    data() {
      return {
        tableData: []
      }
    },
    methods: {
      loadTable() {
        this.$post('thirdparty/getThirdpartyKeyMenuInfo').then(res => {
          if (res.code == 0) {
            this.tableData = res.data
          }
        })
      },
      create(data) {
        this.$post('thirdparty/genThirdpartyKey', {
          menuId: data.menuId
        }).then(res => {
          util.axiosCb(res, this.loadTable())
        })
      },
      reset(data) {
        this.$post('thirdparty/emptyThirdpartyTokenNum', {
          menuId: data.menuId
        }).then(res => {
          if (res.code == 0) {
            this.create(data)
          }
        })
      },
      empty(data) {
        this.$post('thirdparty/emptyThirdpartyTokenNum', {
          menuId: data.menuId
        }).then(res => {
          util.axiosCb(res, this.loadTable())
        })
      },
      copy(data) {
        const str = '菜单ID：' + data.menuId + '\n菜单名称：' + data.menuName + '\n账号：' + data.appId + '\n密钥：' + data.secret
        util.copyStr(str)
      }
    },
    mounted() {
      this.loadTable()
    }
  }
</script>

<style lang="less">
  .thirdSecretKeyConfig{padding: 15px;
    .table{padding: 15px;
      .el-table__body tr.current-row>td.el-table__cell{background-color: rgba(99, 176, 255, .2);}
    }
    .el-table thead{color: rgba(0, 0, 0, .65);}
    .el-table th.el-table__cell{background: #FAFAFA;}
    .el-link+.el-link,.el-link+span,span+.el-link,span+span{margin-left: 15px;}
    .el-table--small{
      .el-link{font-size: 12px;}
    }
  }
  .el-popconfirm__main{margin: 14px 0;}
</style>