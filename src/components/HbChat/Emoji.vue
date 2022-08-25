<template>
  <div class="emoji" id="emoji" v-show="show" :style="{'top': (position.y - 120) + 'px', 'left': position.x + 'px'}">
    <div class="emojiBox" v-for="item in emojiList">
      <img :src="item.path" :title="item.name" :alt="item.name" @click="sendEmoji(item.name, item.path)">
    </div>
  </div>
</template>

<script>
  import emoji from '../../../public/emoji/emoji.json';

  export default {
    name: "Emoji",
    props: {
      show: {
        type: Boolean,
        default: false
      },
      position: {
        type: Object,
        default() {
          return {
            x: 0,
            y: 0
          }
        }
      }
    },
    data() {
      return {
        emojiList: []
      }
    },
    methods: {
      sendEmoji(name, path) {
        this.$emit('sendEmoji', name, path)
      }
    },
    mounted() {
      this.emojiList = emoji.data

      document.addEventListener('mouseup',(e) => {
        const element = document.getElementById('emoji')
        if (element && !element.contains(e.target)) {
          this.$emit('update:show', false)
        }
      })
    }
  }
</script>

<style lang="less" scoped>
  .emoji{position: fixed;width: 330px;background: #fff;box-shadow: 0 0 4px 2px rgba(0, 0, 0, .1);border-radius: 2px;overflow: hidden;padding: 5px;
    .emojiBox{width: 40px;height: 40px;float: left;padding: 5px;cursor: pointer;border-radius: 2px;
      img{width: 100%;}
    }
    .emojiBox:hover{background: #D9DEDE;}
  }
</style>