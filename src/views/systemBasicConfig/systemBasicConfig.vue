<template>
  <div class="systemBasicConfig">
    <el-form size="medium" label-width="130px" label-position="left">
      <el-form-item label="密码错误锁定次数">
        <el-select v-model="formData.lockNum" placeholder="请选择密码错误锁定次数">
          <el-option label="3次" value="3"></el-option>
          <el-option label="5次" value="5"></el-option>
          <el-option label="8次" value="8"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="密码错误锁定时长">
        <el-select v-model="formData.lockTime" placeholder="请选择密码错误锁定时长">
          <el-option label="30分钟" value="30"></el-option>
          <el-option label="60分钟" value="60"></el-option>
          <el-option label="120分钟" value="120"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="密码强制更换天数">
        <el-select v-model="formData.loginDay" placeholder="请选择密码强制更换天数">
          <el-option label="30天" value="30"></el-option>
          <el-option label="60天" value="60"></el-option>
          <el-option label="90天" value="90"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开启强密码验证">
        <el-switch v-model="formData.isVerifyPassword"></el-switch>
      </el-form-item>
      <el-form-item label="密码复杂度" v-show="formData.isVerifyPassword">
        <el-select v-model="formData.passRegexId" placeholder="请选择密码复杂度">
          <el-option v-for="(item, index) in passwordComplexList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="网站备案信息">
        <el-input v-model="formData.icp" placeholder="请输入网站备案信息"></el-input>
      </el-form-item>
      <el-form-item label="公安备案信息">
        <el-input v-model="formData.security" placeholder="请输入公安备案信息"></el-input>
      </el-form-item>
      <el-form-item label="开启短信验证">
        <el-switch v-model="formData.smsIsOpenFlag"></el-switch>
      </el-form-item>
      <el-form-item label="开启快捷菜单">
        <el-switch v-model="formData.navigationIsOpenFlag"></el-switch>
      </el-form-item>
      <el-form-item label="开启全局水印">
        <el-switch v-model="formData.watermarkFlag"></el-switch>
      </el-form-item>
      <el-form-item label="网站版权信息">
        <el-input v-model="formData.copy" placeholder="请输入网站版权信息"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { util } from "@/utils/util";

  export default {
    name: "systemBasicConfig",
    data() {
      return {
        passwordComplexList: [],
        formData: {
          lockNum: '',
          lockTime: '',
          loginDay: '',
          isVerifyPassword: false,
          passRegexId: '',
          icp: '',
          security: '',
          smsIsOpenFlag: false,
          navigationIsOpenFlag: false,
          watermarkFlag: false,
          copy: ''
        }
      }
    },
    methods: {
      submitForm() {
        const sendData = {}, sendDataArr = []
        Object.assign(sendData, this.formData)
        Object.keys(sendData).forEach(key => {
          sendDataArr.push({
            name: key,
            val: sendData[key] == undefined ? '' : typeof sendData[key] == 'boolean' ? sendData[key].toString() : sendData[key]
          })
        })
        this.$post('systemBaseConfig/add', sendDataArr).then(res => {
          util.axiosCb(res)
        })
      },
      getPasswordComplex() {
        this.$post('simpleDictable/lists/002').then(res => {
          if (res.code == 0) {
            this.passwordComplexList = res.data
          }
        })
      },
      setFormData() {
        this.$post('systemBaseConfig/getAll').then(res => {
          if (res.code == 0) {
            for (let v of res.data) {
              this.formData[v.name] = (v.val == 'true' || v.val == 'false') ? eval(v.val) : v.val
            }
          }
        })
      }
    },
    mounted() {
      this.getPasswordComplex()
      this.setFormData()
    }
  }
</script>

<style lang="less" scoped>
  .systemBasicConfig{padding: 30px;
    .el-form-item{
      .el-select, .el-cascader, .el-date-editor.el-input{width: 100%;}
    }
  }
</style>