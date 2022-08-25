<template>
  <div class="watermark" v-if="show">
    <ul v-for="item in 5" :key="item">
      <li v-for="liItem in 10" v-html="watermarkContent"></li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'Watermark',
    props: {
      show: Boolean
    },
    data() {
      return {
        watermarkContent: ''
      }
    },
    mounted() {
      const personalInfo = this.$store.state.personalInfo
      this.watermarkContent = personalInfo.showName + '&nbsp;&nbsp;&nbsp;&nbsp;' + personalInfo.deptName
    }
  }
</script>

<style lang="less" scoped>
  .watermark{width: 100vw;height: 100vh;overflow: hidden;position: fixed;top: 0;left: 0;z-index: 999999;display: flex;pointer-events: none;
    ul{flex: 1;
      li{line-height: 100px;transform: rotate(-30deg);color: rgba(0, 0, 0, .15);margin-bottom: 100px;text-align: center;}
    }
  }
</style>