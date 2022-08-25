<template>
  <div class="hbChat">
    <div class="toggleChat" @click="toggleChat">
      <img src="../../assets/img/hblogo.png" alt="">
    </div>
    <transition name="dialog-fade">
      <div class="chatContainer" id="chatContainer" v-show="show">
        <div class="chatMenu">
          <div class="myAvatar">
            <img src="../../assets/img/hblogo.png" alt="">
          </div>
          <div class="chatMenuContainer">
            <ul>
              <template v-for="item in chatMenuList">
                <el-tooltip class="item" effect="dark" :content="item.name" :key="item.id" placement="right">
                  <li @click="tabChange(item.component)" :class="currentComponent == item.component ? 'active' : ''"><i :class="item.icon"></i></li>
                </el-tooltip>
              </template>
            </ul>
            <ul>
              <el-tooltip class="item" effect="dark" content="设置" placement="right">
                <li><i class="fa fa-bars fa-fw"></i></li>
              </el-tooltip>
            </ul>
          </div>
        </div>
        <keep-alive>
          <component :is="currentComponent"></component>
        </keep-alive>
      </div>
    </transition>
  </div>
</template>

<script>
  import Chat from "./Chat";
  import Friend from "./Friend";
  import Collect from "./Collect";
  import File from "./File";

  export default {
    name: "HbChat",
    components: {
      Chat,
      Friend,
      Collect,
      File
    },
    data() {
      return {
        show: false,
        chatMenuList: [
          {
            id: 1,name: '聊天',icon: 'fa fa-comment-o fa-fw',component: 'Chat'
          },
          {
            id: 2,name: '通讯录',icon: 'fa fa-user-o fa-fw',component: 'Friend'
          },
          {
            id: 3,name: '收藏',icon: 'fa fa-star-o fa-fw',component: 'Collect'
          },
          {
            id: 4,name: '聊天文件',icon: 'fa fa-folder-o fa-fw',component: 'File'
          }
        ],
        currentComponent: 'Chat'
      }
    },
    methods: {
      toggleChat() {
        this.show = !this.show
      },
      tabChange(component) {
        this.currentComponent = component
      }
    }
  }
</script>

<style lang="less" scoped>
  .hbChat{
    .toggleChat{position: fixed;bottom: 30px;right: 30px;z-index: 1949;width: 50px;height: 50px;padding: 8px;background: #fff;border-radius: 50%;box-shadow: 0 0 8px 4px rgba(0, 33, 64, .2);cursor: pointer;
      img{width: 100%;}
    }
    .chatContainer{position: fixed;bottom: 80px;right: 80px;width: 860px;height: 600px;background: #F2F7F7;box-shadow: 0 0 4px 2px rgba(0, 0, 0, .1);display: flex;z-index: 1949;
      .chatMenu{width: 60px;background: #323B44;border-right: 1px solid #474E55;
        .myAvatar{width: 60px;height: 70px;padding: 15px 10px;
          img{width: 100%;background: #fff;border-radius: 2px;}
        }
        .chatMenuContainer{display: flex;flex-direction: column;justify-content: space-between;height: calc(100% - 70px);
          ul{
            li{line-height: 40px;text-align: center;cursor: pointer;border-left: 3px solid transparent;
              i{color: rgba(255, 255, 255, .6);font-size: 17px;}
            }
            li:hover{
              i{color: #409eff;}
            }
            .active{border-left: 3px solid #409eff;background: #394149;
              i{color: #409eff;}
            }
          }
        }
      }
    }
  }
</style>