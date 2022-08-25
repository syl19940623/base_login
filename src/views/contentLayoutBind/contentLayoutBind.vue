<template>
  <div class="container">
    <template v-for="(item, index) in rowList">
      <div class="row" :key="index" :style="{'height': item.height + 'px'}">
        <div class="rowContent">
          <template v-for="(childItem, childIndex) in item.column">
            <div class="rowBox" :key="index + childIndex" :style="{'width': 'calc((100% - ' + (item.column - 1) * 15 + 'px) / ' + item.column + ')'}">
              <a class="contentConfigBtn" @click="contentConfig(index + '-' + childIndex)">内容设置</a>
            </div>
          </template>
        </div>
      </div>
    </template>
    <Dialog :show.sync="show" title="内容设置" width="320px" height="500px" :btn="['绑定', '取消']" @dialogOperate="dialogOperate">
      <div slot="vNode">
        <HbTree
          ref="hbTree"
          :data="treeData"
          :default-expand-all="true"
          :check="{enable: true, chkStyle: 'radio', radioType: 'all'}">
        </HbTree>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import Dialog from "@/components/Dialog/Dialog";
  import HbTree from "@/components/HbTree/HbTree";

  export default {
    name: "ContentLayoutBind",
    components: {
      Dialog,
      HbTree
    },
    data() {
      return {
        rowList: [
          {
            column: 4,
            height: 120
          },
          {
            column: 2,
            height: 240
          },
          {
            column: 1,
            height: 360
          }
        ],
        show: false,
        treeData: [
          {
            label: '节点-1',
            value: '001',
            children: [
              {
                label: '节点-1-1',
                value: '001001',
                children: [
                  {
                    label: '节点-1-1-1',
                    value: '001001001'
                  },
                  {
                    label: '节点-1-1-2',
                    value: '001001002'
                  }
                ]
              },
              {
                label: '节点-1-2',
                value: '001002'
              }
            ]
          },
          {
            label: '节点-2',
            value: '002'
          },
          {
            label: '节点-3',
            value: '003'
          }
        ]
      }
    },
    methods: {
      contentConfig(index) {
        this.show = true;
      },
      dialogOperate(index) {
        if (index === 0) {
          console.log(this.$refs.hbTree.getCheckedNodes()[0].value)
          this.show = false;
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .container{padding: 15px;
    .row{margin-bottom: 15px;
      .rowContent{width: 100%;height: 100%;
        .rowBox{background: #409EFF;height: 100%;float: left;margin-right: 15px;border-radius: 2px;cursor: pointer;position: relative;overflow: hidden;
          .contentConfigBtn{position: absolute;top: -30px;right: 0;padding: 0 15px;line-height: 30px;transition: all .3s;color: #fff;
            &:hover{text-decoration: underline;}
          }
        }
        .rowBox:last-child{margin-right: 0;}
        .rowBox:hover{
          .contentConfigBtn{top: 0;}
        }
      }
    }
    .row:last-child{margin-bottom: 0;}
  }
</style>