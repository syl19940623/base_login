<template>
  <div class="container">
    <template v-for="(item, index) in rowList">
      <div class="row" :key="index" :style="{'height': item.height + 'px'}">
        <div class="rowContent">
          <template v-for="(childItem, childIndex) in item.column">
            <div class="rowBox" :key="index + '-' + childIndex" :style="{'width': 'calc((100% - ' + (item.column - 1) * 15 + 'px) / ' + item.column + ')'}"></div>
          </template>
        </div>
        <div class="rowForm">
          <el-form :inline="true" size="medium">
            <el-form-item>
              <el-input placeholder="请输入列数" v-model.number="item.column"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="请输入高度" v-model.number="item.height"></el-input>
            </el-form-item>
            <el-form-item v-if="index === 0">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="addRow"></el-button>
            </el-form-item>
            <el-form-item v-else>
              <el-button type="danger" icon="el-icon-minus" size="small" @click="delRow(index)"></el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>
    <div class="saveBtn" @click="saveLayout">保存布局</div>
  </div>
</template>

<script>
  export default {
    name: "layoutConfig",
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
        ]
      }
    },
    methods: {
      addRow() {
        this.rowList.push({
          column: 2,
          height: 120
        })
      },
      delRow(index) {
        this.rowList.splice(index, 1);
      },
      saveLayout() {
        console.log(this.rowList);
      }
    }
  }
</script>

<style lang="less" scoped>
  .container{padding: 15px;
    .row{margin-bottom: 15px;
      .rowContent{width: calc(100% - 283px);height: 100%;float: left;
        .rowBox{background: #409EFF;height: 100%;float: left;margin-right: 15px;border-radius: 2px;}
        .rowBox:last-child{margin-right: 0;}
      }
      .rowForm{width: 283px;float: left;padding-left: 15px;
        :deep(.el-form-item){width: 102px;margin-bottom: 0;}
        :deep(.el-form-item:last-child){width: auto;margin-right: 0;}
        :deep(.el-form-item--medium .el-form-item__content){line-height: 34px;}
      }
    }
    .row:last-child{margin-bottom: 0;}
    .saveBtn{width: 90px;height: 40px;position: fixed;bottom: 15px;right: 15px;box-shadow: 0 0 6px 2px rgba(0, 0, 0, .2);border-radius: 2px;background: #409EFF;color: #fff;text-align: center;line-height: 40px;cursor: pointer;}
  }
</style>