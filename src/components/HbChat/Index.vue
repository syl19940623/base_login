<template>
  <div class="container">
    <div class="hbChatBtn" @click="show = !show">
      <img src="../../assets/img/hblogo.png" alt="">
    </div>
    <transition name="dialog-fade">
      <div class="hbChatContainer" v-if="show">
      <div class="menu">
        <div class="avatar">
          <img src="../../assets/img/avatar.png" alt="">
        </div>
        <div class="menuMain">
          <div class="menuTop">
            <div v-for="item in menuList" :key="item.type" :class="['menuItem', activeMenu === item.type ? 'active' : '']" @click="changeMenu(item.type)">
              <i :class="'fa fa-' + item.icon + ' fa-fw'"></i>
            </div>
          </div>
          <div class="menuBot">
            <div class="menuItem">
              <i class="fa fa-cog fa-fw"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <component :is="listComponent"></component>
      </div>
    </div>
    </transition>
  </div>
</template>

<script>
  import ChatList from './Chat/ChatList';
  import UserList from './User/UserList';
  import CollectList from './Collect/CollectList';
  import FileList from './File/FileList';

  export default {
    name: "Index",
    components: {
      ChatList,
      UserList,
      CollectList,
      FileList
    },
    data() {
      return {
        show: false,
        menuList: [
          {
            type: 'chat',
            icon: 'comments'
          },
          {
            type: 'user',
            icon: 'user'
          },
          {
            type: 'collect',
            icon: 'star'
          },
          {
            type: 'file',
            icon: 'folder'
          }
        ],
        activeMenu: 'chat',
        listComponent: 'ChatList'
      }
    },
    methods: {
      changeMenu(type) {
        const typeCapital = type.replace(/^[a-z]/g, L => L.toUpperCase())
        this.activeMenu = type
        this.listComponent = typeCapital + 'List'
      }
    }
  }
</script>

<style lang="less" scoped>
  .container{
    .hbChatBtn{position: fixed;bottom: 35px;right: 35px;width: 60px;height: 60px;border-radius: 50%;z-index: 9999;background: #fff;padding: 10px;box-shadow: 0 0 16px 1px rgba(0,33,64,.3);cursor: pointer;}
    .hbChatContainer{width: 840px;height: 600px;background: #F2F7F7;box-shadow: 0 0 16px 1px rgba(0,33,64,.3);position: fixed;bottom: 100px;right: 100px;display: flex;
      .menu{width: 56px;height: 100%;background: #323B44;
        .avatar{width: 56px;height: 56px;overflow: hidden;padding: 8px;
          img{background: #fff;border-radius: 2px;}
        }
        .menuMain{display: flex;justify-content: space-between;flex-direction: column;height: calc(100% - 56px);
          .menuItem{text-align: center;line-height: 45px;color: #99A8B4;font-size: 16px;border-left: 3px solid transparent;border-right: 3px solid transparent;cursor: pointer;
            &:hover{background: #394149;color: #fff;border-left: 3px solid #56D48B;}
            &.active{background: #394149;color: #fff;border-left: 3px solid #56D48B;}
          }
        }
      }
      .main{flex: 1;border-left: 1px solid #474E55;}
    }
  }
</style>