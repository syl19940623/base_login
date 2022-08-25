<template>
  <transition name="dialog-fade">
    <div id="selectIcon" v-if="show" :style="{position: 'fixed', top: (data.y -38) + 'px', right: '15px'}">
      <div class="selectIconTitle">
        <h1>选择图标</h1>
        <i class="el-icon-close" @click="selectIconClose"></i>
      </div>
      <div class="selectIconForm">
        <el-input placeholder="请输入图标关键字" clearable v-model="iconKw"></el-input>
      </div>
      <div class="selectIconContent hideScrollBar">
        <div class="selectIconBox" v-for="(item, index) in iconListData" :key="index" v-show="item.show" @click="selectIcon(item.class)">
          <el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
            <i :class="item.class"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import iconList from '@/assets/js/iconList.json';

  export default {
    name: "SelectIcon",
    props: {
      show: Boolean,
      data: Object
    },
    data() {
      return {
        iconList,
        iconListData: [],
        iconKw: ''
      }
    },
    methods: {
      selectIcon(className) {
        this.$emit('selectIcon', className, this.data.prop)
      },
      selectIconClose() {
        this.iconKw = ''
        this.$emit('update:show', false)
        // this.$emit('selectIconClose')
      }
    },
    mounted() {
      this.iconListData = this.iconList.data

      document.addEventListener('mouseup',(e) => {
        const element = document.getElementById('selectIcon')
        if (element && !element.contains(e.target)) {
          this.selectIconClose()
        }
      })
    },
    watch: {
      iconKw(val) {
        for (let v of this.iconListData) {
          if (v.name.indexOf(val) == -1 && v.class.indexOf(val) == -1) {
            v.show = false
          } else {
            v.show = true
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  #selectIcon{background: #fff;width: 535px;height: 465px;box-shadow: 0 2px 8px 2px rgba(0, 0, 0, .1);
    .selectIconTitle{overflow: hidden;padding: 0 15px;line-height: 45px;border-bottom: 1px solid #EBEEF5;
      h1{float: left;}
      i{float: right;line-height: 45px;cursor: pointer;font-size: 18px;}
    }
    .selectIconForm{padding: 15px 15px 0;}
    .selectIconContent{overflow: auto;padding: 15px;height: 360px;
      .selectIconBox{width: 50px;height: 50px;border: 1px solid #EBEEF5;margin-right: 15px;text-align: center;cursor: pointer;float: left;margin-bottom: 15px;
        i{line-height: 50px;font-size: 24px;}
      }
      .selectIconBox:nth-child(8n){margin-right: 0;}
      .selectIconBox:hover{box-shadow: 0 2px 8px 2px rgba(0, 0, 0, .1);}
    }
  }
</style>