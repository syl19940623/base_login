<template>
  <div class="container">
    <div class="title">
      <div class="name">{{userData.name}}</div>
      <ul class="operateMenu">
        <li>
          <i class="el-icon-close"></i>
        </li>
      </ul>
    </div>
    <div class="content" ref="content">
      <template v-for="item in 30">
        <div class="contentLeft" v-if="item % 2 === 0">
          <div class="img">
            <img src="../../../assets/img/avatar.png" alt="">
          </div>
          <div class="txt">{{item}}</div>
        </div>
        <div class="contentRight" v-else>
          <div class="img">
            <img src="../../../assets/img/avatar.png" alt="">
          </div>
          <div class="txt">{{item}}</div>
        </div>
      </template>
    </div>
    <div class="toolbar">
      <ul class="toolbarLeft">
        <el-tooltip class="item" effect="dark" content="表情" placement="top-start">
          <li><i class="fa fa-smile-o fa-fw"></i></li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="发送文件" placement="top-start">
          <li><input type="file" @change="sendFile"><i class="fa fa-folder-o fa-fw"></i></li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="聊天记录" placement="top-start">
          <li><i class="fa fa-comment-o fa-fw"></i></li>
        </el-tooltip>
      </ul>
      <ul class="toolbarRight">
        <el-tooltip class="item" effect="dark" content="语音聊天" placement="top-start">
          <li><i class="fa fa-whatsapp fa-fw"></i></li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="视频聊天" placement="top-start">
          <li><i class="fa fa-instagram fa-fw"></i></li>
        </el-tooltip>
      </ul>
    </div>
    <div class="send">
      <div class="sendContent" contenteditable="true" ref="chatContent"></div>
      <div class="sendBtn">
        <el-button type="primary" size="small">发送 (Enter)</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ChatContent",
    props: {
      userData: Object
    },
    data() {
      return {
        content: []
      }
    },
    methods: {
      sendFile(event) {
        console.log(event)
      }
    },
    watch: {
      'userData.id': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.$post('123', {
              id: newVal
            }).then(res => {
              if (res.code === 0) {
                this.content = res.data
                this.$nextTick(() => {
                  this.$refs.content.scrollTo(0, this.$refs.content.scrollHeight)
                })
              }
            })
          } else {
            this.content = []
          }
        },
        immediate: true
      }
    }
  }
</script>

<style lang="less" scoped>
  .container{display: flex;flex-direction: column;width: 100%;height: 600px;
    .title{line-height: 55px;border-bottom: 1px solid #E7EBEB;overflow: hidden;
      .name{float: left;font-size: 18px;letter-spacing: 1px;color: #4F565D;padding-left: 15px;}
      .operateMenu{float: right;
        li{padding: 0 15px;cursor: pointer;font-size: 18px;
          &:hover{color: var(--danger);}
        }
      }
    }
    .content{flex: 1;overflow-y: auto;padding: 15px;
      .contentLeft{overflow: hidden;width: calc(100% - 50px);margin-bottom: 15px;float: left;
        .img{width: 40px;height: 40px;background: #fff;border-radius: 2px;overflow: hidden;float: left;cursor: pointer;}
        .txt{float: left;background: #fff;border-radius: 2px;padding: 8px;margin-left: 10px;position: relative;max-width: calc(100% - 50px);line-height: 24px;word-wrap: break-word;word-break: break-all;
          &::after{content: '';border-right: 6px solid #fff;border-top: 5px solid transparent;border-bottom: 5px solid transparent;position: absolute;top: 15px;left: -6px;}
        }
        .txt:hover{background: rgba(0,0,0,.1);
          &::after{content: '';border-right: 6px solid rgba(0,0,0,.1);border-top: 5px solid transparent;border-bottom: 5px solid transparent;position: absolute;top: 15px;left: -6px;}
        }
      }
      .contentRight{overflow: hidden;width: calc(100% - 50px);margin-bottom: 15px;float: right;
        .img{width: 40px;height: 40px;background: #fff;border-radius: 2px;overflow: hidden;float: right;cursor: pointer;}
        .txt{float: right;background: #409EFF;border-radius: 2px;padding: 8px;margin-right: 10px;position: relative;max-width: calc(100% - 50px);line-height: 24px;word-wrap: break-word;word-break: break-all;
          &::after{content: '';border-left: 6px solid #409EFF;border-top: 5px solid transparent;border-bottom: 5px solid transparent;position: absolute;top: 15px;right: -6px;}
        }
        .txt:hover{background: rgba(64,158,255,.7);
          &::after{content: '';border-left: 6px solid rgba(64,158,255,.7);border-top: 5px solid transparent;border-bottom: 5px solid transparent;position: absolute;top: 15px;right: -6px;}
        }
      }
    }
    .toolbar{height: 40px;line-height: 40px;border-top: 1px solid #E7EBEB;padding: 0 15px;
      .toolbarLeft{float: left;
        li{margin-right: 15px;}
      }
      .toolbarRight{float: right;
        li{margin-left: 15px;}
      }
      li{float: left;cursor: pointer;position: relative;
        i{font-size: 16px;}
        input{width: 100%;height: 100%;position: absolute;top: 0;left: 0;opacity: 0;cursor: pointer;font-size: 0;}
      }
    }
    .send{height: 120px;
      .sendContent{height: calc(100% - 62px);outline: none;padding: 0 15px;width: 100%;overflow-y: auto;word-wrap: break-word;word-break: break-all;line-height: 24px;}
      .sendBtn{padding: 15px;text-align: right;}
    }
  }
</style>