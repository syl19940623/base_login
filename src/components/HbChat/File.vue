<template>
  <div class="file">
    <div class="chatFriend">
      <div class="chatSearch">
        <div class="search">
          <input type="text" placeholder="搜索">
          <i class="fa fa-search fa-fw"></i>
        </div>
      </div>
      <ul class="friendList hideScrollBar">
        <li v-for="item in list" :key="item.id">
          <i :class="item.icon"></i>{{item.name}}
        </li>
      </ul>
    </div>
    <div class="chatContent">
      <div class="chatToolbar">
        <h1 class="chatName">全部文件</h1>
        <ul class="toolbar">
          <li class="closeChat" @click="toggleChatSize">
            <i :class="['fa', 'fa-fw', maximize ? 'fa-window-restore' : 'fa-window-maximize']"></i>
          </li>
          <li class="closeChat" @click="$parent.toggleChat"><i class="fa fa-window-close-o fa-fw"></i></li>
        </ul>
      </div>
      <div class="chatList hideScrollBar">
        <div class="listRow" v-for="item in 10">
          <div class="img">
            <img src="icon/fileIcon/other.png" alt="">
          </div>
          <div class="txt">
            <div class="txtTitle">
              <h1>这是标题这是标题这是标题这是标题这是标题这是标题这是标题这是标题这是标题这是标题这是标题这是标题</h1>
              <span>张三三 | 李四四的聊天</span>
            </div>
            <div class="txtSubtitle">
              <span>2022-04-01</span>
              <span>23.2K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {util} from "../../utils/util";

  export default {
    name: "File",
    data() {
      return {
        maximize: false,
        list: [
          {
            id: 1,
            name: '全部文件',
            icon: 'fa fa-folder-o fa-fw'
          }
        ]
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
  .file{display: flex;flex: 1;
    .chatFriend{width: 240px;background: #394149;
      .chatSearch{padding: 15px;display: flex;justify-content: space-between;border-bottom: 1px solid #343C45;
        .search{position: relative;width: 100%;border-radius: 2px;overflow: hidden;
          input{width: 100%;height: 24px;background: #323B44;padding: 0 10px 0 27px;color: #fff;}
          i{position: absolute;top: 50%;left: 5px;transform: translateY(-50%);color: #757575;}
        }
      }
      .friendList{height: calc(100% - 55px);overflow-y: auto;
        li{padding: 15px;overflow: hidden;cursor: pointer;color: #fff;
          i{margin-right: 10px;}
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
      .chatList{height: calc(100% - 55px);overflow-y: auto;padding: 0 25px;
        .listRow{display: flex;justify-content: space-between;border-bottom: 1px solid #E7EBEB;padding: 15px;cursor: pointer;
          .img{width: 40px;height: 40px;overflow: hidden;
            img{width: 100%;height: 100%;}
          }
          .txt{flex: 1;margin-left: 10px;overflow: hidden;
            .txtTitle{float: left;width: calc(100% - 90px);height: 40px;display: flex;flex-direction: column;justify-content: space-between;
              h1{height: 19px;overflow: hidden;}
              span{font-size: 12px;color: #999;display: block;line-height: 19px;}
            }
            .txtSubtitle{width: 80px;height: 40px;float: right;display: flex;flex-direction: column;justify-content: space-between;
              span{font-size: 12px;color: #999;display: block;text-align: right;line-height: 19px;}
            }
          }
        }
        .listRow:hover{background: rgba(0, 0, 0, 0.1);}
      }
    }
  }
</style>