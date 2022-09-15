<template>
  <div class="container">
    <div class="listOut">
      <div class="search">
        <i class="fa fa-search fa-fw"></i>
        <input type="text" placeholder="搜索">
      </div>
      <div class="list hideScrollBar">
        <div v-for="item in list" :key="item.id" :class="['listItem', item.id === activeId ? 'active' : '']" @click="userChange(item)">
          <div class="img">
            <img src="../../../assets/img/avatar.png" alt="">
          </div>
          <div class="txt">
            <div class="title">
              <div class="name ellipsis">史永亮</div>
              <div class="time">16:53</div>
            </div>
            <div class="subtitle ellipsis">这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容</div>
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

  export default {
    name: "ChatList",
    components: {
      ChatContent
    },
    data() {
      return {
        activeId: '',
        list: [
          {
            id: 1,
            name: '张三三',
            time: '16:53',
            content: '这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容'
          },
          {
            id: 2,
            name: '李四',
            time: '昨天',
            content: '昨天内容'
          }
        ],
        userData: {}
      }
    },
    methods: {
      userChange(data) {
        this.userData = data
        this.activeId = data.id
      }
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
          .img{width: 40px;height: 40px;border-radius: 2px;overflow: hidden;background: #fff;float: left;}
          .txt{width: calc(100% - 40px);float: left;padding-left: 10px;
            .title{overflow: hidden;margin-bottom: 2px;
              .name{color: #fff;width: calc(100% - 50px);float: left;}
              .time{color: #616C77;width: 50px;float: left;}
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