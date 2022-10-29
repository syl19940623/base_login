<template>
  <transition name="viewer-fade">
    <div class="sliderVerifyMask" v-if="show" @click="sliderClose">
      <div class="sliderVerify">
        <!-- 图片 -->
        <div class="sliderImg">
          <i class="refreshBtn el-icon-refresh-right" @click="sliderRefresh"></i>
          <img :src="sliderBg" alt="" class="sliderBg">
          <img :src="sliderCut" alt="" class="sliderCut" :style="{'position': 'absolute', 'top': sliderBlockTop + 'px', 'left': sliderRangeBlockLeft + 'px'}">
          <transition name="el-zoom-in-bottom">
            <div class="verifyTxt" v-show="showVerifyTxt">
              <p class="successTxt" v-if="verifyStatus">验证成功</p>
              <p class="failTxt" v-else>验证失败</p>
            </div>
          </transition>
        </div>
        <!-- 滑块 -->
        <div class="sliderRangeOut">
          <p class="sliderRangeTxt">拖动滑块完成拼图</p>
          <div class="sliderRange" :style="{'width': sliderRangeWidth + 'px'}">
            <div class="sliderRangeBlock" :style="{'position': 'absolute', 'top': '0', 'left': sliderRangeBlockLeft + 'px'}" @mousedown="sliderMove">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'SliderVerify',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      sliderBlockTop: {
        type: Number,
        default: 0
      },
      sliderBg: {
        type: String,
        default: ''
      },
      sliderCut: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        sliderRangeWidth: 50,
        sliderRangeBlockLeft: 0,
        showVerifyTxt: false,
        verifyStatus: false
      }
    },
    methods: {
      sliderClose(e) {
        if (e.target.className === 'sliderVerifyMask') {
          this.$emit('update:show', false)
          this.sliderReset()
        }
      },
      sliderRefresh() {
        this.sliderReset()
        this.$emit('sliderRefresh')
      },
      sliderMove(e) {
        let odiv = e.target;
        let disX = e.clientX - odiv.offsetLeft;
        document.onmousemove = (e) => {
          let left = e.clientX - disX;
          left = left <= 0 ? 0 : left <= 300 ? left : 300;
          this.sliderRangeWidth = 50 + left;
          this.sliderRangeBlockLeft = left;
        };
        document.onmouseup = (e) => {
          document.onmouseup = null;
          document.onmousemove = null;
          this.sliderComplete()
        };
      },
      sliderComplete() {
        this.$emit('sliderComplete', this.sliderRangeBlockLeft, bool => {
          this.showVerifyTxt = true
          this.verifyStatus = bool
          if (bool) {
            setTimeout(() => {
              this.$emit('update:show', false)
              this.sliderReset()
            }, 1000)
          } else {
            setTimeout(() => {
              this.sliderRefresh()
            }, 1000)
          }
        })
      },
      sliderReset() {
        this.sliderRangeWidth = 50
        this.sliderRangeBlockLeft = 0
        this.showVerifyTxt = false
        this.verifyStatus = false
      }
    },
    mounted() {
      document.onkeydown = (e) => {
        if (e.keyCode === 37) {
          this.sliderRangeWidth = this.sliderRangeWidth <= 50 ? 50 : this.sliderRangeWidth - 5
          this.sliderRangeBlockLeft = this.sliderRangeBlockLeft <= 0 ? 0 : this.sliderRangeBlockLeft - 5
        } else if (e.keyCode === 39) {
          this.sliderRangeWidth = this.sliderRangeWidth >= 300 ? 300 : this.sliderRangeWidth + 5
          this.sliderRangeBlockLeft = this.sliderRangeBlockLeft >= 300 ? 300 : this.sliderRangeBlockLeft + 5
        } else if (e.keyCode === 13 && this.show) {
          this.sliderComplete()
        }
      }
    }
  }
</script>

<style lang="less">
  .sliderVerifyMask{width: 100%;height: 100%;background: rgba(0, 0, 0, .7);position: fixed;top: 0;left: 0;
    .sliderVerify{padding: 20px;background: #fff;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);
      .sliderImg{width: 350px;height: 200px;position: relative;
        .refreshBtn{width: 40px;height: 40px;position: absolute;top: 0;right: 0;color: var(--success);text-align: center;line-height: 40px;cursor: pointer;font-size: 22px;transition: all .3s linear;}
        .refreshBtn:hover{transform: rotate(180deg);}
        img{width: 100%;height: 100%;display: block;user-select: none;}
        .sliderCut{width: 50px;height: 50px;}
        .verifyTxt{position: absolute;left: 0;bottom: 0;text-align: center;line-height: 30px;color: #fff;width: 100%;opacity: .8;
          .successTxt{background: var(--success);}
          .failTxt{background: var(--danger);}
        }
      }
      .sliderRangeOut{width: 100%;background: #EEF1F8;height: 50px;margin-top: 20px;position: relative;
        .sliderRangeTxt{color: #b7bcd1;line-height: 50px;text-align: center;user-select: none;}
        .sliderRange{height: 50px;position: absolute;top: 0;left: 0;background: rgba(106, 160, 255, .6);
          .sliderRangeBlock{width: 50px;height: 50px;text-align: center;background: #fff;box-shadow: 0 0 4px 2px rgba(0, 0, 0, .1);cursor: move;display: flex;justify-content: center;align-items: center;
            div{width: 0;height: 40%;transition: all .3s;border: 1px solid var(--primary);}
            div:nth-child(2){margin: 0 4px;}
          }
          .sliderRangeBlock:hover{
            div:nth-child(1){border: 4px solid transparent;height: 0;border-right-color: var(--primary);}
            div:nth-child(2){border-width: 3px;height: 0;border-radius: 3px;margin: 0 6px;border-right-color: var(--primary);}
            div:nth-child(3){border: 4px solid transparent;height: 0;border-left-color: var(--primary);}
          }
        }
      }
    }
  }
</style>