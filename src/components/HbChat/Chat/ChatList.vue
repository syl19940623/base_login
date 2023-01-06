<template>
  <div class="container">
    <div class="listOut">
      <div class="search">
        <i class="fa fa-search fa-fw"></i>
        <input type="text" placeholder="搜索">
      </div>
      <div class="list hideScrollBar">
        <div v-for="item in list" :key="item.sendNo" :class="['listItem', item.sendNo === activeId ? 'active' : '']" @click="userChange(item)">
          <div class="img">
            <img src="../../../assets/img/avatar.png" alt="" v-if="item.avatar">
            <div class="txtImg" v-else>{{item.sendName.slice(-1)}}</div>
          </div>
          <div class="txt">
            <div class="title">
              <div class="name ellipsis">{{item.sendName}}</div>
              <div class="time">{{item.createDateFormat}}</div>
            </div>
            <div class="subtitle ellipsis">{{item.content}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <ChatContent :userData="userData" v-if="activeId"></ChatContent>
      <el-empty style="padding-top: 160px;" v-else></el-empty>
    </div>
  </div>
</template>

<script>
  import ChatContent from './ChatContent';
  import { util } from "@/utils/util";

  export default {
    name: "ChatList",
    components: {
      ChatContent
    },
    data() {
      return {
        activeId: '',
        list: [],
        userData: {}
      }
    },
    methods: {
      loadUser() {
        this.$post('chatContent/getMyChatInfo').then(res => {
          if (res.code === 0) {
            for (let v of res.data) {
              this.$set(v, 'createDateFormat', v.createDate)
            }
            this.list = res.data
          }
        })
      },
      userChange(data) {
        this.userData = data
        this.activeId = data.sendNo
      }
    },
    mounted() {
      this.loadUser()
    }
  }
</script>

<style lang="less" scoped>
  .container{display: flex;
    .listOut{width: 250px;background: #394149;
      .search{padding: 14.5px 10px;border-radius: 2px;overflow: hidden;position: relative;border-bottom: 1px solid #343C45;
        i{width: 26px;line-height: 26px;position: absolute;top: 15px;left: 10px;color: #6B7781;}
        input{width: 100%;height: 26px;padding: 0 10px 0 26px;background: #323B44;color: #6B7781;
          &::placeholder{color: #6B7781;}
        }
      }
      .list{height: 544px;overflow-y: auto;
        .listItem{padding: 10px;overflow: hidden;cursor: pointer;
          .img{width: 40px;height: 40px;border-radius: 2px;overflow: hidden;background: #fff;float: left;
            .txtImg{width: 40px;height: 40px;line-height: 40px;text-align: center;font-size: 18px;font-weight: bold;background: var(--primary);color: #fff;}
          }
          .txt{width: calc(100% - 40px);float: left;padding-left: 10px;
            .title{overflow: hidden;margin-bottom: 2px;
              .name{color: #fff;width: calc(100% - 50px);float: left;}
              .time{color: #616C77;width: 50px;float: left;font-size: 12px;line-height: 19px;}
            }
            .subtitle{color: #616C77;width: 100%;font-size: 12px;}
          }
          &:hover{background: #434B54;}
          &.active{background: #434B54;}
        }
      }
    }
    .content{flex: 1;overflow: hidden;}
  }
</style>