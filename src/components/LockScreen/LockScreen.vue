<template>
  <transition name="dialog-fade">
    <div class="lockScreenMask" v-if="show">
      <div class="lockScreen">
        <div class="date">北京时间 : {{dateData.date}} {{dateData.week}}</div>
        <div class="time">
          <div class="hour">{{dateData.hour}}</div>
          <div class="point">:</div>
          <div class="minute">{{dateData.minute}}</div>
          <div class="point">:</div>
          <div class="second">{{dateData.second}}</div>
        </div>
        <div class="unlock" @click="unlockScreen"><i class="el-icon-unlock"></i> 点击解锁</div>
      </div>
    </div>
  </transition>
</template>

<script>
  import md5 from 'js-md5';
  import { util } from "@/utils/util";

  export default {
    name: 'LockScreen',
    props: {
      show: Boolean
    },
    data() {
      return {
        dateData: {
          date: '1921-01-01',
          week: '星期六',
          hour: '00',
          minute: '00',
          second: '00',
          weekArr: ['日', '一', '二', '三', '四', '五', '六']
        }
      }
    },
    methods: {
      formatNum(num) {
        return num < 10 ? '0' + num : num
      },
      getDateTime() {
        const now = new Date()
        this.dateData.date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
        this.dateData.week = '星期' + this.dateData.weekArr[now.getDay()]
        this.dateData.hour = this.formatNum(now.getHours())
        this.dateData.minute = this.formatNum(now.getMinutes())
        this.dateData.second = this.formatNum(now.getSeconds())
      },
      unlockScreen() {
        this.$prompt('请输入解锁密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          this.$post('common/unLock', {
            pass: md5(value)
          }).then(res => {
            util.axiosCb(res, () => {
              this.$emit('update:show', false)
              this.$store.commit('updateLockScreen', false)
            })
          })
        }).catch(() => {});
      }
    },
    mounted() {
      this.getDateTime()
      setInterval(() => {
        this.getDateTime()
      }, 1000)
    }
  }
</script>

<style lang="less" scoped>
  .lockScreenMask{width: 100%;height: 100%;overflow: hidden;position: fixed;top: 0;left: 0;background: #000;z-index: 1999;cursor: default;
    .lockScreen{color: #fff;width: 950px;position: fixed;top: 40%;left: 50%;transform: translate(-50%, -50%);
      .date{font-size: 18px;font-weight: bold;}
      .time{overflow: hidden;margin: 50px 0 80px;
        div{float: left;text-align: center;line-height: 300px;}
        div:not(.point){width: 250px;height: 300px;background: #141313;font-size: 120px;}
        .point{width: 100px;font-size: 60px;}
      }
      .unlock{text-align: center;font-size: 18px;cursor: pointer;font-weight: bold;}
    }
  }
</style>