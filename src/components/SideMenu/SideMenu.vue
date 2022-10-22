<template>
  <div class="sideMenu hideScrollBar">
    <el-menu
      ref="sideMenu"
      :collapse="collapse"
      :default-openeds="openKeys"
      :default-active="selectedKey"
      :unique-opened="true"
      class="el-menu-vertical-demo"
      active-text-color="#fff"
      background-color="#001529"
      text-color="#ffffffa6">
      <template v-for="item in sideMenuList">
        <el-submenu :index="item.id" v-if="item.type == '20'">
          <template #title>
            <i :class="item.treeIcon"></i>
            <span>{{item.name}}</span>
          </template>
          <template v-for="childItem in item.children">
            <el-submenu :index="childItem.id" v-if="childItem.type == '20'">
              <template #title><span>{{childItem.name}}</span></template>
              <template v-for="sonItem in childItem.children">
                <el-menu-item :index="sonItem.id" @click="sideMenuClick(sonItem)">{{sonItem.name}}</el-menu-item>
              </template>
            </el-submenu>
            <el-menu-item :index="childItem.id" v-if="childItem.type == '30'" @click="sideMenuClick(childItem)">{{childItem.name}}</el-menu-item>
          </template>
        </el-submenu>
        <el-menu-item :index="item.id" v-if="item.type == '30'" @click="sideMenuClick(item)">
          <i :class="item.treeIcon"></i>
          <template #title>{{item.name}}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: 'SideMenu',
    props: {
      collapse: Boolean,
      sideMenuList: Array,
      selectedKey: String
    },
    data() {
      return {
        openKeys: []
      }
    },
    methods: {
      sideMenuClick(item) {
        this.$emit('sideMenuClick', item)
      }
    },
    computed: {
      hasSideMenu() {
        return this.sideMenuList;
      }
    },
    watch: {
      hasSideMenu(newVal, oldVal) {
        if (newVal.length > 0) {
          this.openKeys = [newVal[0].id]
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .sideMenu{overflow-y: auto;transition: all .3s;background: #001529;
    .el-menu{height: calc(100vh - 64px);border-right: none;
      :deep(.is-opened){
        &>.el-submenu__title{
          span,i{color: #fff;}
        }
      }
      :deep(.el-submenu__title){background: transparent !important;}
      :deep(.el-menu--inline){background: rgba(0,0,0,.6) !important;
        .el-menu-item{padding: 0 20px 0 49px !important;background: transparent !important;}
        .el-submenu__title{background: transparent !important;padding: 0 20px 0 49px !important;}
      }
      :deep(.el-menu-item.is-active){background: rgba(0,33,64,.9) !important;}
      :deep(.el-menu-item){
        &:hover{color: #fff !important;background: rgba(0,33,64,.9) !important;}
      }
      .el-submenu .el-submenu{
        .el-menu-item{padding: 0 20px 0 69px !important;}
      }
      .fa{width: 24px;margin-right: 5px;}
    }
  }
</style>