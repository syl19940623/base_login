<template>
  <div v-if="show" class="msg">
    <h1>{{title}}</h1>
    <p>{{msg}}</p>
  </div>
</template>

<script>
  export default {
    name: 'Msg',
    data() {
      return {
        show: false,
        title: '',
        msg: ''
      }
    },
    methods: {
      error(title = '提示', msg = '提示内容', time = 1500) {
        this.title = title
        this.msg = msg
        this.show = true
        setTimeout(() => {
          this.show = false
        }, time)
      }
    }
  }
</script>

<style lang="less" scoped>
  .msg{width: 400px;height: 200px;background: red;position: fixed;top: 250px;left: 50%;transform: translateY(-50%);padding: 24px;
    h1{font-size: 24px;font-weight: bold;}
    p{color: yellow;margin-top: 16px;}
  }
</style>