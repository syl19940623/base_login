<template>
  <div class="friend">
    <div class="chatFriend">
      <div class="chatSearch">
        <div class="search">
          <input type="text" placeholder="搜索">
          <i class="fa fa-search fa-fw"></i>
        </div>
        <el-tooltip class="item" effect="dark" content="发起群聊" placement="right">
          <span class="add">
            <i class="fa fa-plus fa-fw"></i>
          </span>
        </el-tooltip>
      </div>
      <ul class="friendList hideScrollBar">
        <li v-for="item in 10" :key="item">
          <div class="img">
            <img src="../../assets/img/hblogo.png" alt="">
          </div>
          <div class="txt">
            <div>
              <h1 class="ellipsis">史永亮</h1>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="chatContent">
      <div class="chatToolbar">
        <h1 class="chatName">通讯录</h1>
        <ul class="toolbar">
          <li class="closeChat" @click="toggleChatSize">
            <i :class="['fa', 'fa-fw', maximize ? 'fa-window-restore' : 'fa-window-maximize']"></i>
          </li>
          <li class="closeChat" @click="$parent.toggleChat"><i class="fa fa-window-close-o fa-fw"></i></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import {util} from "../../utils/util";

  export default {
    name: "Friend",
    data() {
      return {
        maximize: false
      }
    },
    methods: {
      toggleChatSize() {
        if (this.maximize) {
          util.exitFullscreen()
        } else {
          util.fullScreen(document.getElementById('chatContainer'))
        }
        this.maximize = !this.maximize
      }
    }
  }
</script>

<style lang="less" scoped>
  .friend{display: flex;flex: 1;
    .chatFriend{width: 240px;background: #394149;
      .chatSearch{padding: 15px;display: flex;justify-content: space-between;border-bottom: 1px solid #343C45;
        .search{position: relative;width: 171px;border-radius: 2px;overflow: hidden;
          input{width: 100%;height: 24px;background: #323B44;padding: 0 10px 0 27px;color: #fff;}
          i{position: absolute;top: 50%;left: 5px;transform: translateY(-50%);color: #757575;}
        }
        .add{width: 24px;height: 24px;background: #323B44;border-radius: 2px;text-align: center;cursor: pointer;
          i{color: #757575;line-height: 24px;}
        }
      }
      .friendList{height: calc(100% - 55px);overflow-y: auto;
        li{padding: 15px;overflow: hidden;cursor: pointer;
          .img{width: 36px;height: 36px;border-radius: 2px;overflow: hidden;float: left;background: #fff;
            img{width: 100%;}
          }
          .txt{width: calc(100% - 36px);padding-left: 10px;float: left;
            div{overflow: hidden;
              h1{color: #fff;line-height: 36px;}
            }
          }
        }
        li:hover{background: #434B54;}
      }
    }
    .chatContent{flex: 1;
      .chatToolbar{padding: 15px 25px;border-bottom: 1px solid #E7EBEB;overflow: hidden;
        .chatName{line-height: 24px;font-size: 18px;font-weight: bold;letter-spacing: 2px;float: left;}
        .toolbar{float: right;overflow: hidden;
          li{width: 24px;text-align: center;cursor: pointer;border-radius: 2px;float: left;margin-left: 10px;
            i{line-height: 24px;}
          }
          .closeChat:hover{background: #F56C6C;
            i{color: #fff;}
          }
        }
      }
    }
  }
</style>