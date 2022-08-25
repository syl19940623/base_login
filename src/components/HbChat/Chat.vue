<template>
  <div class="chat">
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
        <li v-for="item in friendList" :key="item.sendNo" @click="friendChange(item.sendNo, item.sendName)" :class="item.sendNo == friendId ? 'active' : ''">
          <div class="img">
            <img v-if="item.avatar" src="../../assets/img/hblogo.png" alt="">
            <h1 v-else>{{item.sendName.slice(-1)}}</h1>
          </div>
          <div class="txt">
            <div>
              <h1 class="ellipsis">{{item.sendName}}</h1>
              <span>{{item.createDateFormat}}</span>
            </div>
            <h2 class="ellipsis" v-html="contentConvert(item.content)"></h2>
          </div>
        </li>
      </ul>
    </div>
    <div class="chatContent">
      <div class="chatToolbar">
        <h1 class="chatName">{{friendName}}</h1>
        <ul class="toolbar">
          <li class="closeChat" @click="toggleChatSize">
            <i :class="['fa', 'fa-fw', maximize ? 'fa-window-restore' : 'fa-window-maximize']"></i>
          </li>
          <li class="closeChat" @click="$parent.toggleChat"><i class="fa fa-window-close-o fa-fw"></i></li>
        </ul>
      </div>
      <div v-show="friendId != ''" class="chatList hideScrollBar" ref="chatList">
        <div class="clear" ref="chatListContainer">
          <template v-for="item in chatList">
            <div v-if="item.acceptNo != friendId" class="chatLeft" :key="item.id">
              <div class="img">
                <img src="../../assets/img/hblogo.png" alt="">
              </div>
              <div class="txt" v-html="item.content"></div>
            </div>
            <div v-if="item.acceptNo == friendId" class="chatRight" :key="item.id">
              <div class="img">
                <img src="../../assets/img/hblogo.png" alt="">
              </div>
              <div class="txt" v-html="item.content"></div>
            </div>
          </template>
        </div>
      </div>
      <div v-show="friendId != ''" class="sendChat">
        <div class="sendMenu">
          <ul>
            <el-tooltip class="item" effect="dark" content="表情" placement="bottom-start">
              <li @click="toggleEmoji"><i class="fa fa-smile-o fa-fw"></i></li>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="发送文件" placement="bottom-start">
              <li style="position: relative;"><input type="file" @change="sendFile('', $event)"><i class="fa fa-folder-o fa-fw"></i></li>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="聊天记录" placement="bottom-start">
              <li @click="recordShow = true"><i class="fa fa-comment-o fa-fw"></i></li>
            </el-tooltip>
          </ul>
          <ul>
            <el-tooltip class="item" effect="dark" content="语音聊天" placement="bottom-start">
              <li><i class="fa fa-whatsapp fa-fw"></i></li>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="视频聊天" placement="bottom-start">
              <li><i class="fa fa-instagram fa-fw"></i></li>
            </el-tooltip>
          </ul>
        </div>
        <div class="sendContent" contenteditable="true" ref="chatContent" @keydown="handleKeydown"></div>
        <div class="sendBtn">
          <el-button type="primary" size="small" @click="sendChatContent">发送 (Enter)</el-button>
        </div>
      </div>
    </div>

    <!-- 表情 -->
    <Emoji :show.sync="emojiShow" :position="emojiPosition" @sendEmoji="sendEmoji"></Emoji>

    <!-- 聊天记录 -->
    <ChatRecord :show.sync="recordShow" :friendId="friendId" :friendName="friendName"></ChatRecord>
  </div>
</template>

<script>
  import {util} from "../../utils/util";
  import Emoji from "./Emoji";
  import ChatRecord from "./ChatRecord";

  export default {
    name: "Chat",
    components: {
      Emoji,
      ChatRecord
    },
    data() {
      return {
        maximize: false,
        emojiShow: false,
        emojiPosition: {
          x: 0,
          y: 0
        },
        chatList: [],
        page: 1,
        friendList: [],
        friendId: '',
        friendName: '',
        chatListDom: null,
        recordShow: false
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
      },
      toggleEmoji(event) {
        this.emojiPosition.x = event.x
        this.emojiPosition.y = event.y
        this.emojiShow = !this.emojiShow
      },
      sendEmoji(name, path) {
        this.emojiShow = false
        const emoji = '<img width="24px" height="24px" title="' + name + '" src="' + path + '"/>'
        const oldTxt = this.$refs.chatContent.innerHTML
        this.$refs.chatContent.innerHTML = oldTxt + emoji
      },
      sendFile(file, event) {
        let currentFile = ''
        if (file) {
          currentFile = file
        } else {
          currentFile = event.target.files[0]
        }
        if (currentFile) {
          const fileNameArr = currentFile.name.split('.')
          const fileSuffix = fileNameArr[fileNameArr.length - 1]
          const hasFileIcon = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'txt', 'rar', 'zip']
          let formData = new FormData()
          formData.append('file', currentFile)
          this.$post('uploadMinioFile', formData, {
            'Content-Type': 'multipart/form-data'
          }).then(res => {
            if (currentFile.type.split('/')[0] == 'image') {
              const img = '<img type="img" title="' + currentFile.name + '" src="' + res.data.path + '" width="200px"/>'
              const oldTxt = this.$refs.chatContent.innerHTML
              this.$refs.chatContent.innerHTML = oldTxt + img
            } else {
              let fileIcon = ''
              if (hasFileIcon.includes(fileSuffix.toLowerCase())) {
                fileIcon = fileSuffix.toLowerCase()
              } else {
                fileIcon = 'other'
              }
              const file = '<img type="file" title="' + currentFile.name + '" src="icon/fileIcon/' + fileIcon + '.png" width="40px"/>'
              const oldTxt = this.$refs.chatContent.innerHTML
              this.$refs.chatContent.innerHTML = oldTxt + file
            }
          })
        }
      },
      scrollBottom() {
        this.$nextTick(()=>{
          let box = this.$el.querySelector(".chatList")
          box.scrollTop = box.scrollHeight
        })
      },
      sendChatContent() {
        if (this.$refs.chatContent.innerHTML != '') {
          const str = this.$refs.chatContent.innerHTML
          const reg = /<img type=|px">/g
          let indexArr = []
          do {
            const arr = reg.exec(str)
            if (arr != null) {
              indexArr.push(arr.index, reg.lastIndex)
            } else {
              break;
            }
          } while(true);
          let printStr = ''
          if (indexArr != '') {
            if (indexArr[0] != 0) {
              printStr += str.slice(0, indexArr[0]) + ';'
            }
            for (let i = 0; i < indexArr.length; i += 4) {
              printStr += str.slice(indexArr[i], indexArr[i + 1]) + str.slice(indexArr[i + 1], indexArr[i + 2]) + str.slice(indexArr[i + 2], indexArr[i + 3]) + ';'
              if (indexArr[i + 4] && indexArr[i + 3] != indexArr[i + 4]) {
                printStr += str.slice(indexArr[i + 3], indexArr[i + 4]) + ';'
              }
            }
            if (indexArr[indexArr.length - 1] != str.length) {
              printStr += str.slice(indexArr[indexArr.length - 1]) + ';'
            }
            printStr = printStr.slice(0, -1)
          } else {
            printStr = str
          }
          const printStrArr = printStr.split(';')
          for (let v of printStrArr) {
            this.$post('chatContent/addChatInfo', {
              acceptNo: this.friendId,
              content: v.search('type="file"') != -1 ? v + this.getImgAttr(v, 'title') : v,
              type: v.search('type="img"') != -1 ? 'img' : (v.search('type="file"') != -1 ? 'file' : 'text')
            }).then(res => {
              if (res.code == 0) {
                this.page = 1
                this.loadChatList()
                this.loadFriendList()
              }
            })
          }
          this.$refs.chatContent.innerHTML = ''
          this.scrollBottom()
        }
      },
      getImgAttr(label, attr) {
        let tempDiv = document.createElement('div')
        tempDiv.innerHTML = label
        document.body.appendChild(tempDiv)
        const tempLabel = tempDiv.getElementsByTagName('img')[0]
        const attrVal = tempLabel.getAttribute(attr)
        const tempParent = tempDiv.parentElement
        tempParent.removeChild(tempDiv)
        return attrVal;
      },
      handleKeydown(event) {
        if (event.keyCode == 13) {
          this.sendChatContent();
          event.preventDefault();
          return false
        }
      },
      loadFriendList() {
        this.$post('chatContent/getMyChatInfo').then(res => {
          if (res.code == 0) {
            for (let v of res.data) {
              this.$set(v, 'createDateFormat', util.timeAgo(v.createDate))
            }
            this.friendList = res.data
          }
        })
      },
      friendChange(sendNo, sendName) {
        this.friendId = sendNo
        this.friendName = sendName
        this.page = 1
        this.loadChatList()
      },
      loadChatList() {
        this.$post('chatContent/getPagingChatInfo', {
          acceptNo: this.friendId,
          page: this.page,
          limit: 10
        }).then(res => {
          if (res.code == 0) {
            if (this.page == 1) {
              this.chatList = res.data
              this.$nextTick(() => {
                setTimeout(() => {
                  this.scrollBottom()
                }, 10)
              })
            } else {
              this.chatList = res.data.concat(this.chatList)
              let oldHeight = this.$refs.chatListContainer.clientHeight
              this.$nextTick(() => {
                let newHeight = this.$refs.chatListContainer.clientHeight
                this.chatListDom.scrollTop = newHeight - oldHeight - 50
                oldHeight = newHeight
              })
            }
          }
        })
      }
    },
    computed: {
      contentConvert() {
        return function (val) {
          return val.search('type="img"') != -1 ? '[图片]' : (val.search('type="file"') != -1 ? '[文件]' : val);
        }
      }
    },
    mounted() {
      this.loadFriendList()
      document.querySelector('.sendContent').addEventListener('paste', (e) => {
        for (let v of e.clipboardData.items) {
          if(v.kind == 'file'){
            let blob = v.getAsFile()
            this.sendFile(blob)
          }
        }
      })
      this.chatListDom = this.$refs.chatList
      this.chatListDom.onscroll = (e) => {
        if (this.chatListDom.scrollTop == 0) {
          this.page++
          this.loadChatList()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .chat{display: flex;flex: 1;
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
          .img{width: 40px;height: 40px;border-radius: 2px;overflow: hidden;float: left;
            img{width: 100%;background: #fff;}
            h1{text-align: center;line-height: 40px;background: #409eff;color: #fff;font-size: 22px;font-weight: bold;}
          }
          .txt{width: calc(100% - 40px);padding-left: 10px;float: left;
            div{overflow: hidden;
              h1{color: #fff;float: left;width: calc(100% - 72px);}
              span{float: right;font-size: 12px;color: rgba(255, 255, 255, .6);line-height: 19px;}
            }
            h2{font-size: 12px;color: rgba(255, 255, 255, .6);margin-top: 3px;
              ::v-deep img{width: 12px;height: 12px;}
            }
          }
        }
        li:hover{background: #434B54;}
        .active{background: #434B54;}
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
      .chatList{height: calc(100% - 215px);overflow-y: auto;padding: 15px 25px;
        .chatLeft{overflow: hidden;width: calc(100% - 50px);margin-bottom: 15px;float: left;
          .img{width: 40px;height: 40px;background: #fff;border-radius: 2px;overflow: hidden;float: left;cursor: pointer;
            img{width: 100%;}
          }
          .txt{float: left;background: #fff;border-radius: 2px;padding: 8px;margin-left: 10px;position: relative;max-width: calc(100% - 50px);line-height: 24px;word-wrap: break-word;word-break: break-all;
            &::after{content: '';border-right: 6px solid #fff;border-top: 5px solid transparent;border-bottom: 5px solid transparent;position: absolute;top: 15px;left: -6px;}
          }
          .txt:hover{background: rgba(0, 0, 0, .1);
            &::after{content: '';border-right: 6px solid rgba(0, 0, 0, .1);border-top: 5px solid transparent;border-bottom: 5px solid transparent;position: absolute;top: 15px;left: -6px;}
          }
        }
        .chatRight{overflow: hidden;width: calc(100% - 50px);margin-bottom: 15px;float: right;
          .img{width: 40px;height: 40px;background: #fff;border-radius: 2px;overflow: hidden;float: right;cursor: pointer;
            img{width: 100%;}
          }
          .txt{float: right;background: #409EFF;border-radius: 2px;padding: 8px;margin-right: 10px;position: relative;max-width: calc(100% - 50px);line-height: 24px;word-wrap: break-word;word-break: break-all;
            &::after{content: '';border-left: 6px solid #409EFF;border-top: 5px solid transparent;border-bottom: 5px solid transparent;position: absolute;top: 15px;right: -6px;}
          }
          .txt:hover{background: rgba(64, 158, 255, .7);
            &::after{content: '';border-left: 6px solid rgba(64, 158, 255, .7);border-top: 5px solid transparent;border-bottom: 5px solid transparent;position: absolute;top: 15px;right: -6px;}
          }
        }
      }
      .sendChat{background: #fff;height: 160px;
        .sendMenu{height: 40px;overflow: hidden;display: flex;justify-content: space-between;padding: 0 25px;
          ul{overflow: hidden;
            li{float: left;margin-right: 15px;cursor: pointer;
              input{width: 100%;height: 100%;position: absolute;top: 0;left: 0;opacity: 0;cursor: pointer;font-size: 0;}
              i{line-height: 40px;font-size: 17px;}
            }
            li:last-child{margin-right: 0;}
          }
        }
        .sendContent{height: calc(100% - 102px);outline: none;padding: 0 25px;width: 100%;overflow-y: auto;word-wrap: break-word;word-break: break-all;line-height: 24px;}
        .sendBtn{padding: 15px 25px;text-align: right;}
      }
    }
  }
</style>