<template>
  <transition name="dialog-fade">
    <div class="mask" v-show="show" @click="changeSystemClose">
      <div class="changeSystem">
        <ul class="searchOut">
          <li>
            <el-input placeholder="请输入系统名称" size="medium" v-model="systemKw"></el-input>
          </li>
          <li>
            <el-button type="primary" size="small" @click="searchSystem">搜索</el-button>
          </li>
        </ul>
        <div class="systemOut">
          <div :class="['systemRow', setClass(item.id)]" v-for="(item, index) in mySystem" :key="index">
            <div class="systemType">{{item.name}}</div>
            <div class="systemContent">
              <div class="systemBox" v-for="(childItem, index) in item.list" :key="index" @click="changeSubSystem(childItem.id)">
                <div class="systemIcon">
                  <i :class="setSystemIcon(childItem.treeIcon)"></i>
                </div>
                <h1 class="systemName">{{childItem.name}}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { util } from "@/utils/util";

  export default {
    name: "changeSystem",
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        systemKw: '',
        mySystem: [],
        iconList: ['el-icon-eleme', 'el-icon-setting', 'el-icon-star-off', 'el-icon-goods', 'el-icon-help', 'el-icon-camera', 'el-icon-bell', 'el-icon-date', 'el-icon-data-line']
      }
    },
    methods: {
      searchSystem() {
        this.loadMySystem(this.systemKw)
      },
      changeSubSystem(id) {
        this.$post('common/getLoginSystemInfo', {
          id: id
        }).then(res => {
          this.$emit('changeSubSystem', res.data)
        })
      },
      setSystemIcon(icon) {
        if (icon == '') {
          const iconIndex = util.randomInteger(0, this.iconList.length - 1)
          icon = this.iconList[iconIndex]
        }
        return icon;
      },
      setClass(id) {
        let className = ''
        if (id == '001') {
          className = 'moneyClass'
        } else if (id == '002') {
          className = 'talkClass'
        } else if (id == '003') {
          className = 'workClass'
        } else if (id == '004') {
          className = 'fileClass'
        } else if (id == '005') {
          className = 'systemClass'
        }
        return className;
      },
      loadMySystem(kw) {
        let sendData = {}
        if (kw != '') {
          sendData.name = kw
        }
        this.$post('common/getMySubsystem', sendData).then(res => {
          if (res.code == 0) {
            this.mySystem = res.data
          }
        })
      },
      changeSystemClose(e) {
        if (e.target.className == 'mask') {
          this.$emit('update:show', false)
        }
      }
    },
    mounted() {
      this.loadMySystem()
    }
  }
</script>

<style lang="less" scoped>
  .mask{width: 100%;height: 100%;position: fixed;top: 0;left: 0;
    .changeSystem{width: 60%;height: 500px;background: #fff;position: fixed;top: 57px;right: 270px;box-shadow: 0 2px 8px 2px rgba(0, 0, 0, .1);
      .searchOut{padding: 15px;overflow: hidden;border-bottom: 1px solid #EBEEF5;
        li{float: left;margin-right: 15px;line-height: 34px;}
      }
      .systemOut{padding: 25px 15px;
        .systemRow{overflow: hidden;margin-bottom: 15px;
          .systemType{width: 48px;float: left;padding-left: 10px;position: relative;line-height: 36px;font-size: 18px;font-weight: bold}
          .systemType::after{content: '';position: absolute;top: 52%;left: 0;transform: translateY(-50%);width: 3px;height: 52%;}
          .systemContent{width: calc(100% - 48px);float: left;overflow: hidden;
            .systemBox{width: calc(100% / 10);cursor: pointer;float: left;margin-bottom: 15px;
              .systemIcon{width: 36px;height: 36px;text-align: center;border-radius: 3px;margin: 0 auto;
                i{line-height: 36px;color: #fff;font-size: 18px;}
              }
              .systemName{text-align: center;margin-top: 5px;font-size: 12px;}
            }
            .systemBox:hover{
              .systemName{text-decoration: underline;}
            }
          }
        }
        .moneyClass{
          .systemType::after{background: #F5B15A;}
          .systemIcon{background: #F5B15A;}
        }
        .talkClass{
          .systemType::after{background: #7676F0;}
          .systemIcon{background: #7676F0;}
        }
        .workClass{
          .systemType::after{background: #36BCB6;}
          .systemIcon{background: #36BCB6;}
        }
        .fileClass{
          .systemType::after{background: #F58754;}
          .systemIcon{background: #F58754;}
        }
        .systemClass{
          .systemType::after{background: #409EFF;}
          .systemIcon{background: #409eff;}
        }
      }
    }
  }
</style>