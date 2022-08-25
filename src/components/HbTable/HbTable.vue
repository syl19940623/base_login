<template>
  <div class="hbTableOut">
    <!-- 搜索条件 -->
    <div class="toolbar" ref="toolbarRef" v-if="toolbar">
      <div v-if="tableData.toolbarList">
        <ul>
          <template v-for="item in tableData.toolbarList">
            <li v-if="item.type == 'text'">
              <el-input
                size="medium"
                v-model="tableData.toolbarData[item.prop]"
                :disabled="item.disabled"
                :clearable="item.clearable"
                :placeholder="'请输入' + item.label">
              </el-input>
            </li>
            <li v-if="item.type == 'select'">
              <el-select
                size="medium"
                v-model="tableData.toolbarData[item.prop]"
                :disabled="item.disabled"
                :clearable="item.clearable"
                :filterable="item.filterable"
                :placeholder="'请输入' + item.label">
                <template v-for="childItem in item.options">
                  <el-option
                    :label="childItem.label"
                    :value="childItem.value"
                  />
                </template>
              </el-select>
            </li>
            <li v-if="item.type == 'cascader'">
              <el-cascader
                size="medium"
                v-model="tableData.toolbarData[item.prop]"
                :props="item.props"
                :options="item.options"
                :disabled="item.disabled"
                :clearable="item.clearable"
                :collapse-tags="true"
                :collapse-tags-tooltip="true"
                :separator="item.separator ?? '/'"
                :filterable="item.filterable"
                :show-all-levels="item.showAllLevels ?? true"
                :placeholder="'请选择' + item.label">
              </el-cascader>
            </li>
            <li v-if="['year', 'month', 'date', 'datetime', 'week', 'daterange', 'datetimerange'].includes(item.type)">
              <el-date-picker
                size="medium"
                v-model="tableData.toolbarData[item.prop]"
                :type="item.type"
                :disabled="item.disabled"
                :editable="item.editable"
                :clearable="item.clearable"
                :range-separator="item.rangeSeparator"
                :value-format="item.valueFormat ?? (item.type == 'date' ?? 'yyyy-MM-dd HH:mm:ss')"
                :placeholder="'请选择' + item.label"
                :start-placeholder="'请选择' + item.label + '开始时间'"
                :end-placeholder="'请选择' + item.label + '结束时间'">
              </el-date-picker>
            </li>
            <li v-if="['primary', 'success', 'info', 'warning', 'danger', 'default'].includes(item.type)">
              <el-button
                size="small"
                :type="item.type"
                :icon="item.icon"
                :disabled="item.disabled"
                @click="handleToolbarEvent(item.event)">
                {{item.text}}
              </el-button>
            </li>
          </template>
        </ul>
      </div>
      <slot name="toolbar" v-else></slot>
    </div>
    <!-- 表格 -->
    <div class="hbTable">
      <el-table
        ref="hbTableRef"
        :size="size"
        :border="border"
        :row-key="rowKey"
        :data="tableData.bodyData"
        :highlight-current-row="true"
        :height="calcTableHeightResult"
        :row-class-name="rowClassName"
        v-loading="tableData.loading"
        @row-click="rowClick">
        <!-- 第一列 -->
        <el-table-column
          v-if="firstColumnType == 'index'"
          label="序号"
          width="60"
          fixed="left"
          :align="align"
          :header-align="align"
          :type="firstColumnType">
          <template slot-scope="scope" v-if="firstColumnType == 'index'">
            <span>{{(pageNum - 1) * pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="['selection', 'expand'].includes(firstColumnType)"
          width="60"
          fixed="left"
          :align="align"
          :header-align="align"
          :type="firstColumnType">
        </el-table-column>
        <!-- 中间 -->
        <template v-for="item in tableData.headData">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :sortable="item.sortable"
            :formatter="item.format"
            :align="item.align ?? align"
            :header-align="item.align ?? align"
            :show-overflow-tooltip="true">
          </el-table-column>
        </template>
        <!-- 最后一列 -->
        <el-table-column
          v-if="bar"
          label="操作"
          ref="barRef"
          :width="barWidth"
          :align="align"
          :header-align="align">
          <template slot-scope="scope">
            <template v-for="item in tableData.barList">
              <el-popconfirm :title="item.confirmText ?? '您确定要删除本条数据吗？'" @confirm="handleBarEvent(item.event, scope.row, scope.$index)" v-if="item.confirm">
                <el-link :type="item.type" slot="reference">
                  {{item.text}}
                </el-link>
              </el-popconfirm>
              <el-link
                v-else
                :type="item.type"
                @click="handleBarEvent(item.event, scope.row, scope.$index)">
                {{item.text}}
              </el-link>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page" ref="pageRef" v-if="page">
      <el-pagination
        :currentPage="pageNum"
        :page-size="pageSize"
        :page-sizes="pageSizeArr"
        :total="tableData.count"
        :layout="pageLayout"
        @size-change="pageSizeChange"
        @current-change="pageNumChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HbTable',
    props: {
      toolbar: {
        type: Boolean,
        default: false
      },
      bar: {
        type: Boolean,
        default: false
      },
      page: {
        type: Boolean,
        default: false
      },
      pageLayout: {
        type: String,
        default: 'total, sizes, prev, pager, next, jumper'
      },
      border: {
        type: Boolean,
        default: true
      },
      align: {
        type: String,
        default: 'center'
      },
      size: {
        type: String,
        default: 'small'
      },
      rowKey: {
        type: String,
        default: 'id_prikey'
      },
      tableHeight: {
        type: String,
        default: 'full'
      },
      firstColumnType: String,
      tableData: Object
    },
    data() {
      return {
        pageNum: 1,
        pageSize: 20,
        pageSizeArr: [10, 20, 30, 50, 100],
        calcTableHeightResult: null,
        barWidth: 0
      }
    },
    methods: {
      rowClassName({row, rowIndex}) {
        if (rowIndex === this.tableData.defaultCurrentRow) {
          return 'current-row';
        }
        return '';
      },
      handleToolbarEvent(event) {
        if (event === 'search') {
          this.pageNum = 1
        }
        this.$emit(event)
      },
      rowClick(row, column, event) {
        this.$emit('rowClick', row, column, event)
      },
      pageSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.$emit('loadTable', this.pageNum, this.pageSize)
      },
      pageNumChange(pageNum) {
        this.pageNum = pageNum
        this.$emit('loadTable', this.pageNum, this.pageSize)
      },
      handleBarEvent(event, data, index) {
        this.$emit(event, data, index)
      }
    },
    mounted() {
      if (this.tableHeight.indexOf('full') != -1) {
        const toolbarHeight = this.toolbar ? this.$refs.toolbarRef.clientHeight + 1 : 0
        const pageHeight = this.page ? this.$refs.pageRef.clientHeight : 0
        const totalHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        let calcTableHeight = totalHeight - toolbarHeight - pageHeight - 30
        if (this.tableHeight.indexOf('-') != -1) {
          calcTableHeight = calcTableHeight - this.tableHeight.split('-')[1]
        }
        this.calcTableHeightResult = calcTableHeight
      } else {
        this.calcTableHeightResult = this.tableHeight
      }

      if (this.bar && this.tableData.barList) {
        const len = this.tableData.barList.length
        this.barWidth = len * 48 + (len - 1) * 15 + 30
      }
    }
  }
</script>

<style lang="less" scoped>
  .hbTableOut{
    .toolbar{padding: 15px 15px 0;border-bottom: 1px solid var(--border-color);
      ul{overflow: hidden;
        li{max-width: 192px;float: left;margin-right: 15px;margin-bottom: 15px;
          .el-button{margin-top: 2px;}
        }
      }
    }
    .hbTable{padding: 15px;
      .el-table{font-size: 12px;
        :deep(thead .cell){color: rgba(0, 0, 0, 0.65);}
        :deep(th.el-table__cell){background: #FAFAFA;height: 36px;}
        :deep(.el-checkbox){vertical-align: text-top;}
        :deep(.current-row td.el-table__cell){background: rgba(0,33,64,.1);}
        .el-link+.el-link,.el-link+span,span+.el-link,span+span{margin-left: 15px;}
        .el-link{font-size: 12px;}
      }
    }
    .page{padding: 0 15px 15px;}
  }
</style>

<style lang="less">
  .el-popconfirm__main{margin: 12px 0;}
</style>