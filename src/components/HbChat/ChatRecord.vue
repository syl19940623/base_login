<template>
  <transition name="dialog-fade">
    <div id="chatRecordOut" v-if="show" @click.self="closeRecord">
      <div class="chatRecord">
        {{friendName}}
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "ChatRecord",
    props: {
      show: {
        type: Boolean,
        default: false
      },
      friendId: {
        type: String,
        default: ''
      },
      friendName: {
        type: String,
        default: ''
      }
    },
    methods: {
      closeRecord() {
        this.$emit('update:show', false)
      }
    },
    mounted() {

    }
  }
</script>

<style lang="less" scoped>
  #chatRecordOut{width: 100%;height: 100%;position: fixed;top: 0;left: 0;
    .chatRecord{width: 50%;height: 70%;background: #fff;box-shadow: 0 0 4px 2px rgba(0, 0, 0, .1);position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);}
  }
</style>