<template>
  <div class="echarts">
    <div :id="id"></div>
  </div>
</template>

<script>
  import * as echarts from 'echarts';

  export default {
    name: "Echarts",
    props: {
      id: {
        type: String,
        default: 'container'
      },
      option: {
        type: Object,
        default: {}
      },
      theme: {
        type: String,
        default: null
      },
      width: {
        type: String,
        default: "400"
      },
      height: {
        type: String,
        default: "400"
      }
    },
    watch: {
      option: {
        immediate: true,
        handler(val) {
          let myChart = echarts.init(document.getElementById(this.id), this.theme, {
            width: this.width,
            height: this.height
          })
          myChart.setOption(val);
        },
        deep: true
      }
    }
  }
</script>

<style scoped>

</style>