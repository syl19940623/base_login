<template>
  <div class="crumbOut">
    <el-scrollbar ref="scrollbarRef" :style="crumbWidth">
      <span v-for="(item, index) in calcCrumbList" :key="index" :class="{'crumbActive' : crumbActiveIndex == index}" @contextmenu.prevent.stop="showCrumbMenu(index, $event)" @click="crumbChange(index, item)">
        {{item.name}}
        <i v-if="index != 0" @click.stop="closeCurrentCrumb(index)">×</i>
      </span>
      <transition name="dialog-fade">
        <div class="crumbMenuMask" v-show="crumbMenuShow" @click="crumbMenuShow = false">
          <div class="crumbMenu" :style="{top: top + 'px', left: left + 'px'}">
            <div class="transition-box">
              <div class="crumbMenuItem" @click="handleCrumbMenu('current')">关闭当前菜单</div>
              <div class="crumbMenuItem" @click="handleCrumbMenu('other')">关闭其他菜单</div>
              <div class="crumbMenuItem" @click="handleCrumbMenu('all')">关闭全部菜单</div>
            </div>
          </div>
        </div>
      </transition>
    </el-scrollbar>
  </div>
</template>

<script>
  export default {
    name: 'Crumb',
    props: ['crumbList', 'crumbActiveIndex', 'collapse'],
    data() {
      return {
        crumbMenuIndex: '',
        crumbMenuShow: false,
        left: 0,
        top: 0
      }
    },
    methods: {
      crumbChange(index, item) {
        this.$emit('crumbChange', index, item)
      },
      closeCurrentCrumb(index) {
        this.$emit('closeCurrentCrumb', index)
      },
      showCrumbMenu(index, e) {
        this.crumbMenuIndex = index
        this.crumbMenuShow = true
        this.left = e.pageX + 15
        this.top = e.pageY + 10
      },
      handleCrumbMenu(type) {
        this.$emit('handleCrumbMenu', type, this.crumbMenuIndex)
      }
    },
    computed: {
      crumbWidth() {
        if (this.collapse) {
          return {
            width: 'calc(100vw - 80px)'
          }
        } else {
          return {
            width: 'calc(100vw - 256px)'
          }
        }
      },
      calcCrumbList() {
        return JSON.parse(JSON.stringify(this.crumbList))
      }
    },
    watch: {
      calcCrumbList(newVal, oldVal) {
        const isPush = newVal.length > oldVal.length
        this.$nextTick(() => {
          if (isPush) {
            const scrollWidth = this.$refs.scrollbarRef.wrap.scrollWidth
            this.$refs.scrollbarRef.wrap.scrollTo({ behavior: "smooth", top: 0, left:  scrollWidth})
          }
          this.$refs.scrollbarRef.update();
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .crumbOut{background: #fff;height: 45px;display: flex;overflow-x: auto;overflow-y: hidden;scroll-behavior: smooth;
    :deep(.el-scrollbar__wrap){height: 45px;overflow: hidden;white-space: nowrap;margin-right: 0 !important;}
    :deep(.el-scrollbar__bar){bottom: 0;}
    span{display: inline-block;padding: 0 35px;line-height: 45px;cursor: pointer;position: relative;white-space: nowrap;user-select: none;
      i{color: #666;position: absolute;top: 46%;right: 12px;transform: translateY(-50%);opacity: 0;font-size: 18px;}
    }
    span::before{content: '';width: 1px;height: 40%;background: var(--border-color);position: absolute;top: 50%;right: 0;transform: translateY(-50%);}
    span:hover{color: var(--primary);
      i{color: var(--primary);opacity: 1;}
    }
    span:hover::after{content: '';width: 20%;height: 2px;background: var(--primary);position: absolute;left: 50%;bottom: 0;transform: translateX(-50%);}
    .crumbActive{color: var(--primary);}
    .crumbActive::after {content: '';width: 20%;height: 2px;background: var(--primary);position: absolute;left: 50%;bottom: 0;transform: translateX(-50%);}
    .crumbMenuMask{width: 100%;height: 100%;position: fixed;top: 0;left: 0;z-index: 999;
      .crumbMenu{width: 140px;background: #fff;position: fixed;top: 0;left: 0;box-shadow: 0 0 4px 2px rgba(0, 0, 0, .1);
        .crumbMenuItem{line-height: 45px;border-bottom: 1px solid #F2F6FC;text-align: center;cursor: pointer;}
        .crumbMenuItem:last-child{border-bottom: none;}
        .crumbMenuItem:hover{color: var(--primary);}
      }
    }
  }
  ul::-webkit-scrollbar{height: 0;}
  ul:hover{
    &::-webkit-scrollbar{height: 3px;}
    &::-webkit-scrollbar-track{background: #EBEEF5;}
    &::-webkit-scrollbar-thumb{background: #C0C4CC;}
  }
</style>>