<template>
  <div class="dingTalkInfoConfig">
    <div class="topOut">
      <el-form size="medium" :inline="true">
        <el-form-item>
          <el-select label="公司名称" v-model="deptId">
            <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="midOut">
      <el-form label-position="left" label-width="120px">
        <el-form-item label="钉钉CorpId">
          <el-input placeholder="请输入钉钉CorpId" v-model="infoConfig.ddCorpId"></el-input>
        </el-form-item>
        <el-form-item label="钉钉AgentId">
          <el-input placeholder="请输入钉钉AgentId" v-model="infoConfig.ddAgentId"></el-input>
        </el-form-item>
        <el-form-item label="钉钉AppKey">
          <el-input placeholder="请输入钉钉AppKey" v-model="infoConfig.ddAppKey"></el-input>
        </el-form-item>
        <el-form-item label="钉钉AppSecret">
          <el-input type="password" placeholder="请输入钉钉AppSecret" show-password v-model="infoConfig.ddAppSecret"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveInfoConfig">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "dingTalkInfoConfig",
    data() {
      return {
        deptList: [],
        deptId: '',
        infoConfig: {
          ddCorpId: '',
          ddAgentId: '',
          ddAppKey: '',
          ddAppSecret: ''
        },
        infoConfigEmpty: {}
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
      loadInfoConfig() {
        Object.assign(this.infoConfig, this.infoConfigEmpty)
        this.$post('dingTalk/getConfigById', {
          deptCode: this.deptId
        }).then(res => {
          if (res.code == 0) {
            this.infoConfig = res.data
          }
        })
      },
      saveInfoConfig() {
        let sendData = this.infoConfig
        sendData.deptCode = this.deptId
        this.$post('dingTalk/setConfig', sendData).then(res => {
          this.$message(res.msg)
        })
      }
    },
    watch: {
      deptId(newVal, oldVal) {
        if (newVal != oldVal) {
          this.loadInfoConfig()
        }
      }
    },
    mounted() {
      Object.assign(this.infoConfigEmpty, this.infoConfig)
      this.loadCompanyList()
    }
  }
</script>

<style lang="less" scoped>
  .topOut{padding: 15px 15px 0;border-bottom: 1px solid #EBEEF5;
    .el-form-item{margin-bottom: 15px;}
  }
  .midOut{padding: 30px;}
</style>