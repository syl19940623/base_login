<template>
  <div class="loginOut">
    <div class="loginExtend" v-if="loginVerify.navigationIsOpenFlag">
      <div class="extendMenu">
        <div class="extendMenuMain hideScrollBar">
          <div class="extendMenuRow" v-for="(item, index) in extendMenuList" :key="index">
            <div class="extendMenuTitle">
              <span>{{item.label}}</span>
            </div>
            <div class="extendMenuSubrow" v-for="(childItem, index) in item.children" :key="index">
              <div class="extendMenuSubtitle">{{childItem.label}}</div>
              <div class="extendMenuContent">
                <a @click="addLog(grandsonItem.value)" :href="grandsonItem.url" :style="{color: grandsonItem.showMode}" target="_blank" v-for="(grandsonItem, index) in childItem.children" :key="index">{{grandsonItem.label}}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="loginBox" :style="calcLoginBoxPosition()">
      <div class="loginLeft">
        <div class="hbLogo">
          <img src="@/assets/img/hblogo.png" alt="" />
          <h1>长治互邦软件</h1>
          <h2>更方便/更友好/更安全的互邦软件平台</h2>
        </div>
      </div>
      <div class="loginRight">
        <div class="changeLoginTypeOut">
          <img src="@/assets/img/accountLogin.png" @click="accountLogin = true"/>
        </div>
        <h1>欢迎登录互邦软件平台</h1>
        <div class="accountLoginOut" v-show="accountLogin">
          <form>
            <div class="formRow">
              <div class="formIcon">
                <i class="el-icon-user"></i>
              </div>
              <div class="form">
                <input type="text" placeholder="请输入登录账号" autocomplete="off" v-model="account" @keyup.enter="openVerify"/>
              </div>
            </div>
            <div class="formRow">
              <div class="formIcon">
                <i class="el-icon-lock"></i>
              </div>
              <div class="form">
                <input type="password" placeholder="请输入登录密码" autocomplete="off" v-model="password" @keyup.enter="openVerify"/>
              </div>
            </div>
            <div class="formRow" v-if="loginVerify.smsIsOpenFlag">
              <div class="formIcon">
                <i class="el-icon-postcard"></i>
              </div>
              <div class="form">
                <input type="text" placeholder="请输入短信验证码" autocomplete="off" v-model="smsCode" @keyup.enter="openVerify"/>
                <el-link @click="getSmsCode" :type="smsVerify.type" :disabled="smsVerify.disabled" style="position: absolute;top: 9px;right: 0;">{{smsVerify.text}}</el-link>
              </div>
            </div>
            <el-button @click="openVerify" type="primary" style="width: 100%;margin-top: 15px;" size="large">立即登录</el-button>
            <div class="otherOperate" style="padding-top: 15px;">
              <el-checkbox v-model="rememberAccount">记住账号</el-checkbox>
              <el-link href="forgetPassword">忘记密码</el-link>
            </div>
          </form>
        </div>
        <div class="qrCodeLoginOut" v-show="!accountLogin">
          <div class="qrCode" id="qrCode"></div>
        </div>
        <div class="otherLogin">
          <div class="otherLoginBox" @click="changeLoginType('wx')">
            <img src="@/assets/img/otherLogin/wx.png" alt="">
          </div>
          <div class="otherLoginBox" @click="changeLoginType('qywx')">
            <img src="@/assets/img/otherLogin/qywx.png" alt="">
          </div>
          <div class="otherLoginBox" @click="changeLoginType('dd')">
            <img src="@/assets/img/otherLogin/dd.png" alt="">
          </div>
        </div>
        <p class="browserTips" v-if="accountLogin">
          请使用IE10及以上版本、Edge、谷歌、火狐、360等浏览器访问
        </p>
      </div>
    </div>
    <SliderVerify 
      :show.sync="sliderVerify.verifyShow"
      :sliderBlockTop="sliderVerify.sliderBlockTop" 
      :sliderBg="sliderVerify.sliderBg" 
      :sliderCut="sliderVerify.sliderCut"
      @sliderRefresh="sliderRefresh"
      @sliderComplete="sliderComplete">
    </SliderVerify>
  </div>
</template>

<script>
  import SliderVerify from '@/components/SliderVerify/SliderVerify.vue';
  import md5 from 'js-md5';
  import '@/assets/js/ddLogin.js';
  import '@/assets/js/wxLogin.js';

  export default {
    name: 'login',
    components: {
      SliderVerify
    },
    data() {
      return {
        accountLogin: true,
        account: '',
        password: '',
        rememberAccount: false,
        sliderVerify: {
          sliderBlockTop: 0,
          sliderBg: '',
          sliderCut: '',
          ranNum: '',
          verifyShow: false
        },
        smsCode: '',
        smsVerify: {
          text: '获取短信验证码',
          type: 'primary',
          disabled: false
        },
        extendMenuList: [],
        loginVerify: {
          smsIsOpenFlag: false,
          navigationIsOpenFlag: false
        }
      }
    },
    methods: {
      changeLoginType(type) {
        if (type == 'wx') {
          const obj = new WxLogin({
            self_redirect: true,
            id: "qrCode",
            appid: "wx1851214902ef11bb",
            scope: "snsapi_login",
            redirect_uri: encodeURIComponent("http://www.boyuan.com/api/a/wx_third_login/login_third_weixin.php?action=do"),
            state: "",
            style: "",
            href: "data:text/css;base64,LnRpdGxlLCAuaW5mbyB7DQoJZGlzcGxheTogbm9uZTsNCn0NCg0KLmltcG93ZXJCb3ggLnFyY29kZSB7DQoJd2lkdGg6IDI0MHB4Ow0KCW1hcmdpbjogMzBweCAwOw0KCWJvcmRlcjogbm9uZTsNCn0="
          });
        } else if (type == 'qywx') {
          // 企业微信
        } else if (type == 'dd') {
          const obj = DDLogin({
            id: "qrCode",
            goto: "https%3A%2F%2Foapi.dingtalk.com%2Fconnect%2Foauth2%2Fsns_authorize%3Fappid%3Ddingoabzckg9kyzm9b7dhj%26response_type%3Dcode%26scope%3Dsnsapi_login%26state%3DSTATE%26redirect_uri%3Dhttp%3A%2F%2F192.168.0.81:8114%2FgetDingDingThirdParty",
            style: "border:none;background-color:rgba(255,255,255,.1);",
            width: "300",
            height: "300"
          });
          function hanndleMessage(event) {
            const origin = event.origin;
            if (origin == "https://login.dingtalk.com") {
              const loginTmpCode = event.data;
              window.location.replace("https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=dingoabzckg9kyzm9b7dhj&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=http://192.168.0.81:8114/getDingDingThirdParty&loginTmpCode=" + loginTmpCode)
            }
          };
          if (typeof window.addEventListener != 'undefined') {
            window.addEventListener('message', hanndleMessage, false);
          } else if (typeof window.attachEvent != 'undefined') {
            window.attachEvent('onmessage', hanndleMessage);
          }
        }
        this.accountLogin = false
      },
      openVerify() {
        if (this.account == '') {
          this.$message.error('登录账号不能为空')
        } else if (this.password == '') {
          this.$message.error('登录密码不能为空')
        } else if (this.loginVerify.smsIsOpenFlag && this.smsCode == '') {
          this.$message.error('短信验证码不能为空')
        } else if (this.loginVerify.smsIsOpenFlag && this.smsCode.length != 6) {
          this.$message.error('短信验证码须是6位有效数字')
        } else {
          this.sliderRefresh()
        }
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
            const sendData = {
              name: this.account,
              pass: md5(this.password),
              imgCodeRandom: res.data
            }
            if (this.loginVerify.smsIsOpenFlag) {
              sendData.smsCode = this.smsCode
            }
            this.$post('login', sendData).then(res => {
              if (res.code == 0) {
                this.$store.commit('saveToken', res.data)
                if (this.rememberAccount) {
                  this.$store.commit('saveAccount', this.account)
                } else {
                  this.$store.commit('saveAccount', '')
                }
                this.$post('common/getUserPublicData').then(res => {
                  if (res.code == 0) {
                    this.$store.commit('savePersonalInfo', res)
                    setTimeout(() => {
                      this.$router.replace('index')
                    }, 1500)
                  }
                })
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error',
                  duration: 1500
                })
              }
            })
          }
        })
      },
      getSmsCode() {
        if (this.account) {
          let second = 60
          this.smsVerify.text = second + 's后重新获取'
          this.smsVerify.type = 'info'
          this.smsVerify.disabled = true
          const timer = setInterval(() => {
            second--
            this.smsVerify.text = second + 's后重新获取'
            if (second <= 0) {
              clearInterval(timer)
              this.smsVerify.text = '重新获取验证码'
              this.smsVerify.type = 'warning'
              this.smsVerify.disabled = false
            }
          }, 1000)
        } else {
          this.$message({
            message: '登录账号不能为空',
            type: 'error',
            duration: 1500
          })
        }
      },
      calcLoginBoxPosition() {
        const positionObj = {
          position: 'fixed',
          top: '50%',
          left: '50%'
        }
        if (this.loginVerify.navigationIsOpenFlag) {
          positionObj.left = 'calc(50% + 200px)'
        }
        return positionObj;
      },
      addLog(value) {
        this.$post('navigation/addLog', {
          id: value
        })
      }
    },
    mounted() {
      const accountVal = this.$store.state.account
      if (accountVal) {
        this.rememberAccount = true
        this.account = accountVal
      }
      this.$post('getPublicInfo').then(res => {
        if (res.code == 0) {
          this.loginVerify.smsIsOpenFlag = res.data.smsIsOpenFlag
          this.loginVerify.navigationIsOpenFlag = res.data.navigationIsOpenFlag
          this.$nextTick(() => {
            this.$post('navigation/getAll').then(res => {
              if (res.code == 0) {
                this.extendMenuList = res.data
              }
            })
          })
        }
      })
    }
  }
</script>

<style lang="less" scoped>
  .loginOut{width: 100vw;height: 100vh;background: url("../../assets/img/loginBg.jpg") no-repeat;background-size: 100% 100%;
    .loginBox{width: 720px;height: 450px;transform: translate(-50%, -50%);overflow: hidden;border-radius: 5px;
      .loginLeft{width: 50%;height: 100%;float: left;background: rgba(0, 0, 0, .4);position: relative;
        .hbLogo{position: absolute;top: 50%;left: 0;width: 100%;transform: translateY(-50%);
          img{width: 100px;display: block;margin: 0 auto;}
          h1{font-size: 32px;text-align: center;color: #fff;}
          h2{text-align: center;color: #fff;margin-top: 40px;letter-spacing: 1px;}
        }
      }
      .loginRight{width: 50%;height: 100%;float: left;background: #fff;padding: 50px 30px;position: relative;
        .changeLoginTypeOut{position: absolute;top: 3px;right: 7px;cursor: pointer;
          img{width: 60px;opacity: .8;transition: all .3s;}
          img:hover{opacity: 1;}
        }
        h1{font-size: 22px;font-weight: bold;text-align: center;letter-spacing: 1px;}
        .accountLoginOut{
          form{margin: 30px 0 15px;
            .formRow{margin-bottom: 15px;overflow: hidden;border-bottom: 1px solid var(--border-color);position: relative;
              .formIcon{width: 40px;height: 40px;float: left;text-align: center;line-height: 40px;
                i{font-size: 18px;}
              }
              .form{width: calc(100% - 40px);float: left;
                input{height: 40px;}
                img{width: 100px;position: absolute;top: 0;right: 0;cursor: pointer;}
              }
            }
            .otherOperate{overflow: hidden;
              .el-link{text-decoration: none;margin-top: 6.5px;float: right;}
            }
          }
        }
        .qrCodeLoginOut{width: 300px;height: 310px;margin-top: -10px;
          .qrCode{height: 300px;overflow: hidden;}
        }
        .otherLogin{display: flex;justify-content: space-around;width: 200px;margin: 0 auto 20px;
          .otherLoginBox{width: 40px;height: 40px;border-radius: 50%;background: #fff;box-shadow: 0 0 16px 1px rgba(0, 0, 0, .15);cursor: pointer;padding: 8px;transition: all .3s linear;
            img{width: 100%;}
          }
          .otherLoginBox:hover{margin-top: -5px;}
        }
        .browserTips{font-size: 12px;color: #999;text-align: center;}
      }
    }
    .loginExtend{width: 400px;position: fixed;top: 0;left: 0;
      .extendMenu{width: 100%;height: 100%;
        .extendMenuMain{background: rgba(255, 255, 255, .8);width: 100%;height: 100vh;overflow-y: auto;padding: 15px;
          .extendMenuRow{margin-bottom: 10px;
            .extendMenuTitle{padding-bottom: 5px;border-bottom: 1px solid #d5d5d5;position: relative;margin-bottom: 5px;
              span{display: inline-block;background: #017F6D;color: #fff;width: 80px;line-height: 30px;text-align: center;}
            }
            .extendMenuTitle::after{content: '';width: 80px;height: 3px;background: #EF9402;position: absolute;bottom: 0;left: 0;}
            .extendMenuSubrow{display: flex;
              .extendMenuSubtitle{width: 80px;text-align: center;line-height: 30px;font-weight: bold;}
              .extendMenuContent{flex: 1;
                a{line-height: 30px;color: var(--text-color);float: left;margin-right: 10px;}
                a:hover{text-decoration: underline;}
              }
            }
          }
        }
      }
    }
  }
</style>
