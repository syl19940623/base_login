<template>
  <div class="container">
    <div class="left">
      <div class="logo" :style="{width: collapse ? '64px' : '256px', padding: collapse ? '11px 8px' : '11px 0 11px 20px'}">
        <img src="@/assets/img/hblogo.png" alt="" class="logoIcon">
        <h1 class="logoName">{{systemName}}</h1>
      </div>
      <SideMenu :collapse="collapse" :selectedKey="selectedKey" :sideMenuList="sideMenuList" @sideMenuClick="sideMenuClick"></SideMenu>
    </div>
    <div class="right">
      <div class="topNav">
        <ul class="leftNav">
          <li @click="collapse = !collapse">
            <i class="el-icon-s-fold" v-if="!collapse"></i>
            <i class="el-icon-s-unfold" v-else></i>
          </li>
        </ul>
        <ul class="rightNav">
          <li @click="changeSystemShow = true">
            <i class="el-icon-s-operation"></i>
          </li>
          <li @click="lockScreen">
            <i class="el-icon-lock"></i>
          </li>
          <li @click="toggleFullscreen">
            <i class="el-icon-full-screen"></i>
          </li>
          <li>
            <i class="el-icon-bell"></i>
          </li>
          <li>
            <el-dropdown @command="personalMenu">
              <span class="el-dropdown-link">
                欢迎您: {{showName}}<i class="fa fa-angle-down fa-fw"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
                  <el-dropdown-item divided command="personalInfo">个人信息</el-dropdown-item>
                  <el-dropdown-item divided command="logOut">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </li>
        </ul>
      </div>
      <div class="crumb">
        <Crumb
          :crumbList="crumbList"
          :collapse="collapse"
          :crumbActiveIndex="crumbActiveIndex"
          @closeCurrentCrumb="closeCurrentCrumb"
          @crumbChange="crumbChange"
          @handleCrumbMenu="handleCrumbMenu">
        </Crumb>
      </div>
      <div class="content">
        <div class="iframeContainer">
          <iframe
            v-for="(item, index) in crumbList"
            v-show="crumbActiveIndex === index"
            :key="item.id"
            :src="item.urlAddress"
            frameborder="0">
          </iframe>
        </div>
      </div>
    </div>
    <LockScreen :show.sync="lockScreenShow"></LockScreen>
    <ChangeSystem :show.sync="changeSystemShow" @changeSubSystem="changeSubSystem"></ChangeSystem>
    <Watermark :show="watermarkShow"></Watermark>
    <Dialog
      title="修改密码"
      width="450px"
      :btn="!forceUpdatePassword ? ['保存', '取消'] : ['保存']"
      :show.sync="updatePasswordShow"
      :show-close="false"
      @dialogOperate="updatePasswordDialogOperate">
      <template slot="vNode">
        <HbForm ref="updatePasswordRef" :form="updatePasswordForm" :form-data="updatePasswordFormData"></HbForm>
      </template>
    </Dialog>
    <PersonalInfo ref="personalInfoRef"></PersonalInfo>
    <!-- <HbChat></HbChat> -->
  </div>
</template>

<script>
  import ChangeSystem from './changeSystem/changeSystem';
  import PersonalInfo from './personalInfo/personalInfo';
  import { util } from "@/utils/util";
  import Bus from "@/utils/eventBus";
  import md5 from "js-md5";
  import { Base64 } from 'js-base64';

  export default {
    name: 'HbChat',
    components: {
      ChangeSystem,
      PersonalInfo
    },
    data() {
      const validateNewPass = (rule, value, callback) => {
        if (this.updatePasswordFormData.surePass && value != this.updatePasswordFormData.surePass) {
          callback('新密码与确认密码不一致')
        }
      }
      const validateSurePass = (rule, value, callback) => {
        if (this.updatePasswordFormData.newPass && value != this.updatePasswordFormData.newPass) {
          callback('新密码与确认密码不一致')
        }
      }
      return {
        collapse: false,
        sideMenuList: [],
        crumbList: [
          {
            id: '000',
            name: '首页',
            urlAddress: 'welcome'
          }
        ],
        crumbActiveIndex: 0,
        selectedKey: '',
        isFullscreen: false,
        lockScreenShow: false,
        changeSystemShow: false,
        showName: '',
        watermarkShow: false,
        forceUpdatePassword: false,
        updatePasswordShow: false,
        updatePasswordForm: {
          labelWidth: '81px',
          list: [
            {
              type: 'password',
              prop: 'oldPass',
              label: '旧密码'
            },
            {
              type: 'password',
              prop: 'newPass',
              label: '新密码'
            },
            {
              type: 'password',
              prop: 'surePass',
              label: '确认密码'
            }
          ],
          rules: {
            oldPass: [
              { required: true, message: '请输入旧密码', trigger: 'blur' }
            ],
            newPass: [
              { required: true, message: '请输入新密码', trigger: 'blur' },
              { validator: validateNewPass, trigger: 'blur' }
            ],
            surePass: [
              { required: true, message: '请输入确认密码', trigger: 'blur' },
              { validator: validateSurePass, trigger: 'blur' }
            ]
          }
        },
        updatePasswordFormData: {},
        socket: null,
        systemName: '',
        currentProjectUrl: '',
        currentProjectName: ''
      }
    },
    methods: {
      loadSideMenu(menuId) {
        this.$post('common/getMyNextMenu', {
          menuId
        }).then(res => {
          if (res.code == 0 && res.data.length > 0) {
            if (menuId) {
              util.getObjectArrayByKey(this.sideMenuList, 'id', menuId).children = res.data
            } else {
              this.sideMenuList = res.data
            }
            for (let v of res.data) {
              this.$set(v, 'children', [])
              if (v.type == '20') {
                this.loadSideMenu(v.id)
              }
            }
          }
        })
      },
      sideMenuClick(item) {
        let pushFlag = true
        for (let i in this.crumbList) {
          if (this.crumbList[i].id == item.id) {
            pushFlag = false
            this.crumbActiveIndex = parseInt(i)
          }
        }
        if (pushFlag) {
          item.urlAddress = item.urlAddress.indexOf('http') == -1 ? this.currentProjectUrl + this.currentProjectName + item.urlAddress : item.urlAddress
          this.crumbList.push(item)
          this.crumbActiveIndex = this.crumbList.length - 1
        }
      },
      closeCurrentCrumb(index) {
        if (index == this.crumbActiveIndex) {
          this.crumbActiveIndex = index == (this.crumbList.length - 1) ? index - 1 : index
        } else if (this.crumbActiveIndex > index) {
          this.crumbActiveIndex--
        }
        this.crumbList.splice(index, 1)
        this.selectedKey = this.crumbList[this.crumbActiveIndex].id
      },
      crumbChange(index, item) {
        this.crumbActiveIndex = index
        this.selectedKey = item.id
      },
      handleCrumbMenu(type, index) {
        if (type == 'current' && index != 0) {
          this.closeCurrentCrumb(index)
        } else if (type == 'other') {
          const newCrumbList = []
          if (index != 0) {
            newCrumbList.push(this.crumbList[0])
          }
          newCrumbList.push(this.crumbList[index])
          this.crumbList = newCrumbList
          this.crumbActiveIndex = index == 0 ? index : 1
          this.selectedKey = this.crumbList[this.crumbActiveIndex].id
        } else if (type == 'all') {
          this.crumbList = [this.crumbList[0]]
          this.crumbActiveIndex = 0
          this.selectedKey = ''
        }
      },
      changeSubSystem(data) {
        this.systemName = data.currentSystemName
        this.currentProjectUrl = data.currentProjectUrl
        this.currentProjectName = data.currentProjectName
        this.crumbActiveIndex = 0
        this.crumbList.splice(1, this.crumbList.length - 1)
        this.changeSystemShow = false
        this.loadSideMenu('')
      },
      lockScreen() {
        this.$store.commit('updateLockScreen', true)
        this.lockScreenShow = true
      },
      toggleFullscreen() {
        if (this.isFullscreen) {
          document.exitFullscreen()
        } else {
          document.documentElement.requestFullscreen()
        }
        this.isFullscreen = !this.isFullscreen
      },
      personalMenu(command) {
        if (command == 'updatePassword') {
          this.updatePasswordShow = true
        } else if (command == 'personalInfo') {
          this.$refs.personalInfoRef.show = true
        } else if (command == 'logOut') {
          this.$router.replace('login')
          this.$store.commit('saveToken', '')
          this.$store.commit('savePersonalInfo', {
            data: '',
            extendData: ''
          })
        }
      },
      updatePasswordDialogOperate(index) {
        if (index == 0) {
          this.$refs.updatePasswordRef.formValidate()
          if (this.$refs.updatePasswordRef.formValidateResult) {
            this.$post('common/setMyPass', {
              oldPass: md5(this.updatePasswordFormData.oldPass),
              newPass: Base64.encode(this.updatePasswordFormData.newPass),
              newPassConfirm: Base64.encode(this.updatePasswordFormData.surePass)
            }).then(res => {
              util.axiosCb(res, () => {
                this.updatePasswordShow = false
                this.$data.updatePasswordFormData = this.$options.data().updatePasswordFormData
              })
            })
          }
        } else {
          this.$data.updatePasswordFormData = this.$options.data().updatePasswordFormData
        }
      },
      socketInit() {
        if (typeof(WebSocket) !== 'undefined') {
          const webSocketId = this.$store.state.personalExtendInfo.webScoketId
          // 实例化socket
          this.socket = new WebSocket('ws://192.168.0.12/userMessageSocket/' + webSocketId)
          // 监听socket连接
          this.socket.onopen = this.socketOpen
          // 监听socket错误信息
          this.socket.onerror = this.socketError
          // 监听socket发送消息
          this.socket.send = this.socketSend
          // 监听socket消息
          this.socket.onmessage = this.socketReceive
          // 监听socket关闭
          this.socket.onclose = this.socketClose
        }
      },
      socketOpen() {},
      socketError() {},
      socketSend() {},
      socketReceive(data) {
        if (data.data === '退出') {
          this.$alert('您的账号已在其它电脑登录，请重新登录！', '温馨提示')
          this.$router.replace('/login')
          this.$store.commit('saveToken', '')
          this.$store.commit('savePersonalInfo', {
            data: '',
            extendData: ''
          })
        }
      },
      socketClose() {
        this.socket.close()
      }
    },
    created() {
      this.$post('common/getLoginSystemInfo').then(res => {
        if (res.code == 0) {
          this.showName = this.$store.state.personalInfo.showName
          this.watermarkShow = this.$store.state.personalInfo.watermarkFlag
          this.forceUpdatePassword = this.$store.state.personalInfo.userPassFlag

          if (this.$store.state.lockScreen) {
            this.lockScreenShow = true
          }

          // 存储角色按钮权限
          this.$store.commit('saveRoleBtns', res.data.roleButtons)

          // 加载当前系统信息
          this.currentProjectUrl = res.data.currentProjectUrl
          this.currentProjectName = res.data.currentProjectName
          if (res.data.jumpMode == 'frame') {
            this.systemName = res.data.currentSystemName
            this.loadSideMenu('')
          } else {
            // 跳转其它系统
          }
        }
      })
    },
    mounted() {
      Bus.$on('tokenFail', target => {
        // this.socketClose()
      });

      // this.socketInit()

      // 新建Tab页
      window.addEventListener('message',e => {
        if (e.source != window.parent) {
          this.sideMenuClick({
            id: new Date().getTime(),
            name: e.data.data.name,
            urlAddress: e.data.data.url
          })
        }
      },false);

      // 将接口注册为全局接口
      window.getToken = () => {
        this.$post('common/getServerDate')
        return this.$store.state.token
      }
    },
    beforeRouteEnter(to, from, next) {
      if (from.path === '/login') {
        next()
      } else {
        top.location.href = '/login'
      }
    },
    beforeRouteLeave(to, from ,next) {
      if (to.path === '/login') {
        // this.socketClose()
      }
      next()
    }
  }
</script>

<style lang="less" scoped>
  .container{display: flex;overflow: hidden;
    .left{background: #002140;
      .logo{height: 64px;overflow: hidden;background: #002140;transition: all .3s;
        img{width: 42px;float: left;}
        h1{line-height: 40px;float: left;font-size: 20px;color: #fff;font-weight: bold;margin-left: 5px;letter-spacing: 1px;}
      }
      .sideMenu{height: calc(100vh - 64px);}
    }
    .right{flex: 1;
      .topNav{height: 65px;background: #fff;border-bottom: 1px solid var(--border-color);
        .leftNav{float: left;}
        .rightNav{float: right;
          :deep(.el-dropdown){display: block;}
        }
        li{float: left;line-height: 64px;cursor: pointer;padding: 0 15px;font-size: 18px;
          i{line-height: 60px;}
        }
        li:hover{background: var(--bg);}
      }
      .crumb{height: 45px;}
      .content{height: calc(100% - 110px);padding: 10px;background: var(--bg);
        .iframeContainer{background: #fff;height: calc(100vh - 130px);box-shadow: 0 0 8px 2px rgba(0,0,0,.05);
          iframe{width: 100%;height: 100%;}
        }
      }
    }
  }
</style>