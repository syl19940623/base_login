<template>
  <transition name="dialog-fade">
    <div class="menuOut" v-show="menuShow">
      <div class="logoOut">
        <div class="logoMain">
          <img src="@/assets/img/loginLogo.png" alt=""/>
          <ul>
            <li>
              <h1 @click="logOut">返回登录</h1>
            </li>
          </ul>
        </div>
      </div>
      <div class="forgetPasswordOut">
        <div class="forgetPassword">
          <div class="title">云端软件平台 - 找回密码</div>
          <el-form style="width: 400px;" ref="oneForm" :model="oneFormData" :rules="oneFormRules" label-width="80px" label-position="left" v-if="step == 1">
            <el-form-item label="登录账号" prop="loginAccount">
              <el-input placeholder="请输入登录账号" v-model="oneFormData.loginAccount"></el-input>
            </el-form-item>
            <el-button @click="jumpToTwo" style="width: 100%;" type="primary">下一步</el-button>
          </el-form>
          <el-form style="width: 400px;" ref="twoForm" :model="twoFormData" :rules="twoFormRules" label-width="80px" label-position="left" v-else-if="step == 2">
            <el-form-item label="验证方式">
              <el-radio v-model="twoFormData.type" label="邮箱账号">邮箱账号</el-radio>
              <el-radio v-model="twoFormData.type" label="手机号码">手机号码</el-radio>
            </el-form-item>
            <el-form-item :label="twoFormData.type" prop="account">
              <el-input :placeholder="'请输入' + twoFormData.type" v-model="twoFormData.account"></el-input>
            </el-form-item>
            <el-button @click="jumpToThree" style="width: 100%;" type="primary">下一步</el-button>
          </el-form>
          <el-form style="width: 400px;" ref="threeForm" :model="threeFormData" :rules="threeFormRules" label-width="80px" label-position="left" v-else-if="step == 3">
            <el-form-item label="验证码" prop="verifyCode">
              <el-input placeholder="请输入验证码" v-model="threeFormData.verifyCode"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input type="password" placeholder="请输入新密码" v-model="threeFormData.newPassword"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="surePassword">
              <el-input type="password" placeholder="请输入确认密码" v-model="threeFormData.surePassword"></el-input>
            </el-form-item>
            <el-button @click="updatePassword" style="width: 100%;" type="danger">确定修改</el-button>
          </el-form>
        </div>
      </div>
      <div class="footerOut">
        <div class="footerMain">
          <h1>技术支持: 长治市互邦软件工程有限公司</h1>
        </div>
      </div>
      <SliderVerify
        ref="sliderVerifyOut"
        :show.sync="sliderVerify.verifyShow"
        :sliderBlockTop="sliderVerify.sliderBlockTop"
        :sliderBg="sliderVerify.sliderBg"
        :sliderCut="sliderVerify.sliderCut"
        @sliderRefresh="sliderRefresh"
        @sliderComplete="sliderComplete"
      />
    </div>
  </transition>
</template>

<script>
  import SliderVerify from "@/components/SliderVerify/SliderVerify";
  import { Base64 } from 'js-base64';
  import { util } from '@/utils/util.js';
  import md5 from "js-md5";

  export default {
    name: "forgetPassword",
    components: {
      SliderVerify
    },
    data() {
      const validateLoginAccount = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('登录账号不能为空'));
        } else {
          callback();
        }
      };
      const validateAccount = (rule, value, callback) => {
        const type = this.twoFormData.type
        if (value == '') {
          callback(new Error(type + '不能为空'));
        } else if (type == '手机号码' && !util.checkPhone(value)) {
          callback(new Error('手机号码格式错误'));
        } else if (type == '邮箱账号' && !util.checkMail(value)) {
          callback(new Error('邮箱账号格式错误'));
        } else {
          callback();
        }
      };
      const validateVerifyCode = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('验证码不能为空'));
        } else {
          callback();
        }
      };
      const validateNewPassword = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('新密码不能为空'));
        } else {
          callback();
        }
      };
      const validateSurePassword = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('确认密码不能为空'));
        } else if (value != this.threeFormData.newPassword) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      return {
        sliderVerify: {
          sliderBlockTop: 0,
          sliderBg: '',
          sliderCut: '',
          ranNum: '',
          verifyShow: false
        },
        menuShow: false,
        step: 1,
        oneFormData: {
          loginAccount: '',
          loginAccountId: '',
          accountRandom: ''
        },
        oneFormRules: {
          loginAccount: [
            { validator: validateLoginAccount, trigger: 'blur' }
          ]
        },
        twoFormData: {
          type: '邮箱账号',
          account: ''
        },
        twoFormRules: {
          account: [
            { validator: validateAccount, trigger: 'blur' }
          ]
        },
        threeFormData: {
          verifyCode: '',
          newPassword: '',
          surePassword: '',
        },
        threeFormRules: {
          verifyCode: [
            { validator: validateVerifyCode, trigger: 'blur' }
          ],
          newPassword: [
            { validator: validateNewPassword, trigger: 'blur' }
          ],
          surePassword: [
            { validator: validateSurePassword, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      logOut() {
        this.$router.go(-1);
      },
      sliderRefresh() {
        this.$post('getSliderImg').then(res => {
          if (res.code == 0) {
            this.sliderVerify.ranNum = res.data.ranNum
            this.sliderVerify.sliderBlockTop = res.data.y
            this.sliderVerify.sliderBg = 'data:image/png;base64,' + res.data.shadeImage
            this.sliderVerify.sliderCut = 'data:image/png;base64,' + res.data.cutoutImage
            this.sliderVerify.verifyShow = true
          }
        })
      },
      sliderComplete(left, callback) {
        this.$post('verSliderImg', {
          x: left,
          y: this.sliderVerify.sliderBlockTop,
          ranNum: this.sliderVerify.ranNum
        }).then(res => {
          callback(res.code == 0)
          if (res.code == 0) {
            this.oneFormData.accountRandom = res.data
            this.$post('retrieveAccount', {
              name: this.oneFormData.loginAccount,
              imgCodeRandom: this.oneFormData.accountRandom
            }).then(res => {
              if (res.code == 0) {
                setTimeout(() => {
                  this.oneFormData.loginAccountId = res.data
                  const loading = this.$loading({
                    lock: true,
                    text: '正在跳转至下一步',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                  });
                  setTimeout(() => {
                    this.step = 2
                    loading.close();
                  }, 1500);
                }, 1500)
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error',
                  duaring: 1500
                });
              }
            })
          }
        })
      },
      jumpToTwo() {
        this.$refs['oneForm'].validate((valid) => {
          if (valid) {
            this.sliderRefresh()
          } else {
            return false;
          }
        });
      },
      jumpToThree() {
        this.$refs['twoForm'].validate((valid) => {
          if (valid) {
            this.$post('sendAccountCode', {
              account: this.oneFormData.loginAccountId,
              type: this.twoFormData.type,
              verValue: this.twoFormData.account
            }).then(res => {
              if (res.code == 0) {
                const loading = this.$loading({
                  lock: true,
                  text: '正在跳转至下一步',
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                });
                setTimeout(() => {
                  this.step = 3
                  loading.close();
                }, 1500);
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error',
                  duaring: 1000
                });
              }
            })
          } else {
            return false;
          }
        });
      },
      updatePassword() {
        this.$refs['threeForm'].validate((valid) => {
          if (valid) {
            this.$post('setAccountPass', {
              account: this.oneFormData.loginAccountId,
              code: this.threeFormData.verifyCode,
              pass: Base64.encode(this.threeFormData.newPassword),
              passConfirm: Base64.encode(this.threeFormData.surePassword)
            }).then(res => {
              if (res.code == 0) {
                this.$message({
                  message: '密码修改成功',
                  type: 'success',
                  duaring: 1000,
                  onClose: () => {
                    this.$router.replace({ path: '/login' })
                  }
                });
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error',
                  duaring: 1000
                });
              }
            })
          } else {
            return false;
          }
        });
      }
    },
    mounted() {
      this.menuShow = true
    }
  };
</script>

<style lang="less">
  body{background: #EDF1F7;}
</style>

<style lang="less" scoped>
  .menuOut{
    .logoOut{background: #fff;box-shadow: 0 0 40px -10px rgb(64, 158, 255, .01);
      .logoMain{width: 1200px;margin: 0 auto;padding: 15px 0;overflow: hidden;
        img{height: 40px;display: block;float: left;}
        ul{float: right;
          li{float: left;padding: 0 30px;box-sizing: border-box;
            h1{font-size: 18px;font-weight: bolder;line-height: 40px;color: #333;cursor: pointer;}
          }
        }
      }
    }
    .forgetPasswordOut{width: 100%;height: calc(100vh - 130px);position: relative;
      .forgetPassword{position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);background: #fff;padding: 80px 100px;box-shadow: 0 0 4px 2px rgba(64, 158, 255, .1);
        .title{font-size: 22px;font-weight: bold;text-align: center;letter-spacing: 1px;margin-bottom: 50px;}
      }
    }
    .footerOut{width: 100%;background: #000;position: fixed;bottom: 0;left: 0;
      .footerMain{width: 1200px;margin: 0 auto;
        h1{text-align: center;color: #fff;line-height: 60px;}
      }
    }
  }
</style>