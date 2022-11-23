<template>
  <transition name="dialog-fade">
    <div class="dialogMask" v-if="show">
      <div class="dialog" :style="{width: width, height: height}">
        <div class="dialogTop">
          <h1>{{title}}</h1>
          <i class="el-icon-close" v-if="showClose" @click="dialogClose"></i>
        </div>
        <div class="dialogMid" :style="dialogMidHeight">
          <div v-if="content" class="dialogContent">
            {{content}}
          </div>
          <slot v-else name="vNode"></slot>
        </div>
        <div class="dialogBot" v-if="btn.length > 0">
          <div class="dialogBotBtn" v-for="(item, index) in btn" :key="index">
            <el-button :type="index == 0 ? 'primary' : ''" size="small" @click="dialogOperate(index)">{{item}}</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'Dialog',
    props: {
      show: Boolean,
      showClose: {
        type: Boolean,
        default: true
      },
      width: {
        type: String,
        default: 'auto'
      },
      height: {
        type: String,
        default: 'auto'
      },
      btn: {
        type: Array,
        default: () => {
          return ['确定']
        }
      },
      title: {
        type: String,
        default: '提示'
      },
      content: String
    },
    methods: {
      dialogClose() {
        this.$emit('update:show', false)
        this.$emit('dialogClose')
      },
      dialogOperate(index) {
        if (index == this.btn.length - 1) {
          this.dialogClose()
        } else {
          this.$emit('dialogOperate', index)
        }
      }
    },
    computed: {
      dialogMidHeight() {
        if (this.height === 'auto') {
          return {
            height: 'auto'
          }
        } else {
          const totalHeight = this.height.indexOf('%') != -1 ? '100%' : this.height
          const topBotHeight = this.btn.length == 0 ? '61px' : '108px'
          return {
            height: 'calc(' + totalHeight + ' - ' + topBotHeight + ')'
          }
        }
      }
    },
    watch: {
      show(newVal, oldVal) {
        if (!newVal) {
          this.$emit('dialogEnd')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .dialogMask{width: 100%;height: 100%;background: rgba(0,0,0,.5);position: fixed;top: 0;left: 0;z-index: 1994;
    .dialog{background: #fff;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);min-width: 300px;min-height: 180px;border-radius: 4px;
      .dialogTop{overflow: hidden;line-height: 47px;padding: 0 15px;border-bottom: 1px solid var(--border-color);background: #fff;height: 48px;
        h1{float: left;color: rgba(0,0,0,.85);}
        i{float: right;line-height: 48px;font-size: 16px;font-weight: bold;cursor: pointer;display: block;
          &:hover{color: var(--primary);}
        }
      }
      .dialogMid{overflow-y: auto;min-height: 70px;
        .dialogContent{padding: 25px 15px 0;}
      }
      .dialogBot{overflow: hidden;padding: 15px;
        .dialogBotBtn{float: right;margin-left: 15px;}
      }
    }
  }
</style>