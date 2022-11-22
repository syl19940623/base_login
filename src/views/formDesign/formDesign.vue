<template>
  <transition name="dialog-fade">
    <div class="formDesign" v-if="show">
      <div class="title">
        <el-form :inline="true">
          <el-form-item size="medium">
            <el-select v-model="tableName">
              <el-option label="测试表-1" value="1"></el-option>
              <el-option label="测试表-2" value="2"></el-option>
              <el-option label="测试表-3" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-eleme" @click="save">保存模板</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" size="small" icon="el-icon-delete" @click="empty">清空模板</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" size="small" icon="el-icon-close" @click="close">关闭模板</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content">
        <div class="left">
          <draggable v-model="formElement" animation="300" v-bind="{group: {name: 'formList',pull: 'clone'},sort: false}" :clone="cloneFormElement">
            <transition-group>
              <div v-for="item in formElement" :key="item.type" class="elementRow">
                <div class="img"><img :src="require('../../assets/icon/' + item.type + '.png')" alt=""></div>
                <div class="name">{{item.label}}</div>
              </div>
            </transition-group>
          </draggable>
        </div>
        <div class="mid" ref="mid">
          <el-form :label-width="formConfig.labelWidth + 'px'" :size="formConfig.formSize" :label-position="formConfig.formAlign">
            <draggable v-model="formList" group="formList" animation="300" @add="dragAdd" :scroll="true">
              <transition-group style="width: 100%;height: calc(100vh - 100px);display: inline-block;">
                <div :class="['formRow', formActiveIndex == index ? 'active' : '']" v-for="(item, index) in formList" :key="item.type + index" @click="formRowClick(item.id, item.type, index)">
                  <el-form-item :label="item.label" :prop="item.prop" v-if="item.type == 'text'">
                    <el-input
                      v-model="item.formValue"
                      :clearable="item.clearable"
                      :placeholder="item.placeholder ? item.placeholder : '请输入' + item.label">
                    </el-input>
                  </el-form-item>
                  <el-form-item :label="item.label" :prop="item.prop" v-if="item.type == 'number'">
                    <el-input-number
                      v-model="item.formValue"
                      :min="item.min"
                      :max="item.max"
                      :precision="item.precision"
                      :controls="false"
                      :placeholder="item.placeholder ? item.placeholder : '请输入' + item.label">
                    </el-input-number>
                  </el-form-item>
                  <el-form-item :label="item.label" :prop="item.prop" v-if="item.type == 'password'">
                    <el-input
                      v-model="item.formValue"
                      :show-password="item.showPassword"
                      :placeholder="item.placeholder ? item.placeholder : '请输入' + item.label"
                      :clearable="item.clearable">
                    </el-input>
                  </el-form-item>
                  <el-form-item :label="item.label" :prop="item.prop" v-if="item.type == 'textarea'">
                    <el-input
                      v-model="item.formValue"
                      type="textarea"
                      :rows="item.rows"
                      :placeholder="item.placeholder ? item.placeholder : '请输入' + item.label">
                    </el-input>
                  </el-form-item>
                  <el-form-item :label="item.label" :prop="item.prop" v-if="item.type == 'select'">
                    <el-select
                      v-model="item.formValue"
                      collapse-tags
                      :clearable="item.clearable"
                      :allow-create="item.allowCreate"
                      :filterable="item.filterable"
                      :multiple="item.multiple"
                      :placeholder="item.placeholder ? item.placeholder : '请选择' + item.label">
                      <el-option
                        v-for="childItem in item.list"
                        :key="childItem.label + childItem.value"
                        :label="childItem.label"
                        :value="childItem.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="item.label" :prop="item.prop" v-if="item.type == 'radio'">
                    <el-radio-group v-model="item.formValue">
                      <el-radio
                        v-for="childItem in item.list"
                        :label="childItem.value"
                        :key="childItem.label + childItem.value">
                        {{childItem.label}}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="item.label" :prop="item.prop" v-if="item.type == 'checkbox'">
                    <el-checkbox-group v-model="item.formValue" style="height: 40px;">
                      <el-checkbox
                        v-for="childItem in item.list"
                        :key="childItem.label + childItem.value"
                        :label="childItem.label">
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item :label="item.label" :prop="item.prop" v-if="item.type == 'cascader'">
                    <el-cascader
                      v-model="item.formValue"
                      collapse-tags
                      :options="item.list"
                      :clearable="item.clearable"
                      :filterable="item.filterable"
                      :show-all-levels="item.showAllLevels"
                      :props="{'multiple': item.multiple}"
                      :placeholder="item.placeholder ? item.placeholder : '请选择' + item.label">
                    </el-cascader>
                  </el-form-item>
                  <el-form-item :label="item.label" :prop="item.prop" v-if="item.type == 'switch'">
                    <el-switch
                      v-model="item.formValue">
                    </el-switch>
                  </el-form-item>
                  <el-form-item :label="item.label" :prop="item.prop" v-if="['date', 'datetime'].includes(item.type)">
                    <el-date-picker
                      v-model="item.formValue"
                      align="center"
                      :value-format="item.type == 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"
                      :type="item.type"
                      :placeholder="item.placeholder ? item.placeholder : '请选择' + item.label"
                      :clearable="item.clearable">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item :label="item.label" :prop="item.prop" v-if="item.type == 'editor'">
                    <vue-tinymce v-model="item.formValue" :setting="setting"/>
                  </el-form-item>
                  <span class="delFormRow" @click.stop="delFormRow(index)"><i class="el-icon-delete"></i></span>
                </div>
              </transition-group>
            </draggable>
          </el-form>
        </div>
        <div class="right">
          <el-tabs>
            <el-tab-pane label="表单项配置">
              <el-form label-width="82px" size="medium" v-if="this.formActiveIndex != -1">
                <el-form-item label="字段名称">
                  <el-input placeholder="请输入字段名称" v-model="formList[formActiveIndex].prop"></el-input>
                </el-form-item>
                <el-form-item label="标签名称">
                  <el-input placeholder="请输入标签名称" v-model="formList[formActiveIndex].label"></el-input>
                </el-form-item>
                <el-form-item label="占位符" v-show="!['radio', 'checkbox', 'switch', 'editor'].includes(formList[formActiveIndex].type)">
                  <el-input placeholder="请输入占位符" v-model="formList[formActiveIndex].placeholder"></el-input>
                </el-form-item>
                <el-form-item label="默认值" v-show="formList[formActiveIndex].type != 'editor'">
                  <el-input placeholder="请输入默认值" v-model="formList[formActiveIndex].value"></el-input>
                </el-form-item>
                <el-form-item label="默认值" v-show="formList[formActiveIndex].type == 'switch'">
                  <el-switch v-model="formList[formActiveIndex].value"></el-switch>
                </el-form-item>
                <el-form-item label="可清空" v-show="['text', 'password', 'select', 'cascader', 'date', 'datetime'].includes(formList[formActiveIndex].type)">
                  <el-switch v-model="formList[formActiveIndex].clearable"></el-switch>
                </el-form-item>
                <el-form-item label="行数" v-show="formList[formActiveIndex].type == 'textarea'">
                  <el-input placeholder="请输入行数" v-model="formList[formActiveIndex].rows"></el-input>
                </el-form-item>
                <el-form-item label="最小值" v-show="formList[formActiveIndex].type == 'number'">
                  <el-input placeholder="请输入最小值" v-model="formList[formActiveIndex].min"></el-input>
                </el-form-item>
                <el-form-item label="最大值" v-show="formList[formActiveIndex].type == 'number'">
                  <el-input placeholder="请输入最大值" v-model="formList[formActiveIndex].max"></el-input>
                </el-form-item>
                <el-form-item label="数值精度" v-show="formList[formActiveIndex].type == 'number'">
                  <el-input placeholder="请输入数值精度" v-model="formList[formActiveIndex].precision"></el-input>
                </el-form-item>
                <el-form-item label="切换密码" v-show="formList[formActiveIndex].type == 'password'">
                  <el-switch v-model="formList[formActiveIndex].showPassword"></el-switch>
                </el-form-item>
                <el-form-item label="可搜索" v-show="['select', 'cascader'].includes(formList[formActiveIndex].type)">
                  <el-switch v-model="formList[formActiveIndex].filterable"></el-switch>
                </el-form-item>
                <el-form-item label="可多选" v-show="['select', 'cascader'].includes(formList[formActiveIndex].type)">
                  <el-switch v-model="formList[formActiveIndex].multiple"></el-switch>
                </el-form-item>
                <el-form-item label="可创建" v-show="formList[formActiveIndex].type == 'select' && formList[formActiveIndex].filterable">
                  <el-switch v-model="formList[formActiveIndex].allowCreate"></el-switch>
                </el-form-item>
                <el-form-item label="完整路径" v-show="formList[formActiveIndex].type == 'cascader'">
                  <el-switch v-model="formList[formActiveIndex].showAllLevels"></el-switch>
                </el-form-item>
                <el-form-item label="非空验证" v-show="formList[formActiveIndex].type != 'editor'">
                  <el-switch v-model="formList[formActiveIndex].required"></el-switch>
                </el-form-item>
                <el-form-item label="数据源" v-show="['select', 'radio', 'checkbox'].includes(formList[formActiveIndex].type)">
                  <el-radio v-model="formList[formActiveIndex].dataResource" label="fixed">固定数据源</el-radio>
                  <el-radio v-model="formList[formActiveIndex].dataResource" label="interface">接口数据源</el-radio>
                </el-form-item>
                <el-form-item class="dataResource" label="固定数据源" v-show="['select', 'radio', 'checkbox'].includes(formList[formActiveIndex].type) && formList[formActiveIndex].dataResource == 'fixed'">
                  <div class="fixedRow" v-for="(item, index) in formList[formActiveIndex].list" :key="index">
                    <div class="label"><el-input placeholder="请输入label" v-model="item.label"></el-input></div>
                    <div class="value"><el-input placeholder="请输入value" v-model="item.value"></el-input></div>
                    <div class="operate">
                      <el-link type="primary" :underline="false" @click="addFixedSource(formList[formActiveIndex].list, index)">添加</el-link>
                      <el-popconfirm title="是否确定删除该数据项？" @confirm="delFixedSource(formList[formActiveIndex].list, index)">
                        <el-link slot="reference" type="danger" :underline="false">删除</el-link>
                      </el-popconfirm>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="接口数据源" v-show="['select', 'radio', 'checkbox', 'cascader'].includes(formList[formActiveIndex].type) && formList[formActiveIndex].dataResource == 'interface'">
                  <el-input v-model="formList[formActiveIndex].interface" placeholder="请输入接口数据源表名"></el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="表单配置">
              <el-form label-width="82px" size="medium" v-if="this.formActiveIndex != -1">
                <el-form-item label="表单尺寸">
                  <el-select v-model="formConfig.formSize">
                    <el-option label="default" value="default"></el-option>
                    <el-option label="medium" value="medium"></el-option>
                    <el-option label="small" value="small"></el-option>
                    <el-option label="mini" value="mini"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="对齐方式">
                  <el-radio v-model="formConfig.formAlign" label="left">左对齐</el-radio>
                  <el-radio v-model="formConfig.formAlign" label="right">右对齐</el-radio>
                  <el-radio v-model="formConfig.formAlign" label="top">顶部对齐</el-radio>
                </el-form-item>
                <el-form-item label="标签宽度">
                  <el-input-number size="small" v-model="formConfig.labelWidth"></el-input-number>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="模板配置">
              <el-form label-width="96px" size="medium" v-if="this.formActiveIndex != -1">
                <el-form-item label="模板类型">
                  <el-radio v-model="templateConfig.templateType" label="FormTemplate">纯表单</el-radio>
                  <el-radio v-model="templateConfig.templateType" label="TreeTemplate">树表单</el-radio>
                  <el-radio v-model="templateConfig.templateType" label="TableTemplate">表格表单</el-radio>
                </el-form-item>
                <el-form-item label="添加接口">
                  <el-input v-model="templateConfig.addInterface" clearable></el-input>
                </el-form-item>
                <el-form-item label="修改接口">
                  <el-input v-model="templateConfig.editInterface" clearable></el-input>
                </el-form-item>
                <el-form-item label="删除接口" v-show="['TreeTemplate', 'TableTemplate'].includes(templateConfig.templateType)">
                  <el-input v-model="templateConfig.delInterface" clearable></el-input>
                </el-form-item>
                <el-form-item label="单条数据接口">
                  <el-input v-model="templateConfig.byIdInterface" clearable></el-input>
                </el-form-item>
                <el-form-item label="全部数据接口" v-show="['TreeTemplate', 'TableTemplate'].includes(templateConfig.templateType)">
                  <el-input v-model="templateConfig.dataInterface" clearable></el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import draggable from 'vuedraggable';
  import { util } from "@/utils/util";

  export default {
    name: "formDesign",
    components: {
      draggable
    },
    props: {
      show: Boolean
    },
    data() {
      return {
        setting: {
          menubar: true,
          plugins: "code charmap emoticons searchreplace link image media table lists advlist preview fullscreen quickbars",
          toolbar: "code undo redo bold italic underline strikethrough forecolor backcolor hr charmap emoticons searchreplace formatselect alignleft aligncenter alignright alignjustify link unlink numlist bullist image media table removeformat preview print fullscreen",
          height: 400,
          language: 'zh_CN',
          draggable_modal: true,
          elementpath: false,
          statusbar: false,
          branding: false,
          placeholder: '请输入内容...'
        },
        formList: [],
        formElement: [
          {
            type: 'text',
            label: '输入框',
            formValue: '',
            prop: 'text',
            placeholder: '',
            clearable: false,
            required: false
          },
          {
            type: 'number',
            label: '数字框',
            formValue: '',
            prop: 'number',
            placeholder: '',
            required: false,
            min: -Infinity,
            max: Infinity,
            precision: 0
          },
          {
            type: 'password',
            label: '密码框',
            formValue: '',
            prop: 'password',
            placeholder: '',
            clearable: false,
            required: false,
            showPassword: true
          },
          {
            type: 'textarea',
            label: '文本框',
            formValue: '',
            prop: 'textarea',
            placeholder: '',
            rows: 2,
            required: false
          },
          {
            type: 'select',
            label: '下拉选项',
            formValue: [],
            prop: 'select',
            placeholder: '',
            clearable: false,
            multiple: false,
            filterable: false,
            allowCreate: false,
            required: false,
            dataResource: 'fixed',
            interface: '',
            list: [
              {
                label: '选项1',
                value: 1
              },
              {
                label: '选项2',
                value: 2
              },
              {
                label: '选项3',
                value: 3
              }
            ]
          },
          {
            type: 'radio',
            label: '单选框',
            formValue: '',
            prop: 'radio',
            required: false,
            dataResource: 'fixed',
            interface: '',
            list: [
              {
                label: '单选1',
                value: 1
              },
              {
                label: '单选2',
                value: 2
              },
              {
                label: '单选3',
                value: 3
              }
            ]
          },
          {
            type: 'checkbox',
            label: '多选框',
            formValue: [],
            prop: 'checkbox',
            required: false,
            otherVerify: '',
            dataResource: 'fixed',
            interface: '',
            list: [
              {
                label: '多选1',
                value: 1
              },
              {
                label: '多选2',
                value: 2
              },
              {
                label: '多选3',
                value: 3
              }
            ]
          },
          {
            type: 'cascader',
            label: '级联',
            formValue: [],
            prop: 'cascader',
            placeholder: '',
            clearable: false,
            showAllLevels: true,
            filterable: false,
            multiple: false,
            required: false,
            otherVerify: '',
            dataResource: 'interface',
            interface: '',
            list: []
          },
          {
            type: 'switch',
            label: '开关',
            formValue: false,
            prop: 'switch',
            required: false
          },
          {
            type: 'date',
            label: '日期',
            formValue: '',
            prop: 'date',
            placeholder: '',
            clearable: false,
            required: false
          },
          {
            type: 'datetime',
            label: '日期时间',
            formValue: '',
            prop: 'datetime',
            placeholder: '',
            clearable: false,
            required: false,
          },
          {
            type: 'editor',
            label: '富文本',
            formValue: '',
            prop: 'editor'
          }
        ],
        formActiveIndex: -1,
        formConfig: {
          formSize: 'medium',
          formAlign: 'right',
          labelWidth: 80
        },
        templateConfig: {
          templateType: 'FormTemplate',
          addInterface: '',
          editInterface: '',
          delInterface: '',
          byIdInterface: '',
          dataInterface: ''
        },
        tableName: ''
      }
    },
    methods: {
      cloneFormElement(e) {
        return JSON.parse(JSON.stringify(e));
      },
      dragAdd(e) {
        this.formActiveIndex = e.newIndex
        const randomStr = (new Date().getTime() + '').slice(-5)
        this.formList[e.newIndex].id = 'id' + randomStr
        this.formList[e.newIndex].prop = this.formList[e.newIndex].prop + randomStr
      },
      formRowClick(id, type, index) {
        this.formActiveIndex = index
      },
      delFormRow(index) {
        this.formList.splice(index, 1)
        this.formActiveIndex = this.formActiveIndex == 0 ? (this.formList == '' ? -1 : 0) : this.formActiveIndex - 1
      },
      addFixedSource(data, index) {
        data.splice(index + 1, 0, {
          label: '',
          value: ''
        })
      },
      delFixedSource(data, index) {
        data.splice(index, 1)
      },
      empty() {
        this.formList = []
        this.formActiveIndex = -1
        this.$data.formConfig = this.$options.data().formConfig
        this.$data.templateConfig = this.$options.data().templateConfig
      },
      save() {
        const sendData = util.deepClone({
          formConfig: this.formConfig,
          formList: this.formList,
          templateConfig: this.templateConfig
        })
        for (let v of sendData.formList) {
          if (['select', 'cascader', 'radio', 'checkbox'].includes(v.type)) {
            if (v.dataResource == 'interface') {
              this.$post(v.interface).then(res => {
                if (res.code == 0) {
                  v[['select', 'cascader'].includes(v.type) ? 'options' : 'list'] = res.data
                  console.log(JSON.stringify(sendData))
                  // this.$post('', {
                  //   data: sendData
                  // }).then(res => {
                  //   if (res.code == 0) {
                  //     this.$emit('designSuccess', res.data)
                  //   }
                  // })
                }
              })
            }
          }
        }
      },
      close() {
        this.$emit('update:show', false)
        this.empty()
      }
    }
  }
</script>

<style lang="less">
  .formDesign{overflow: hidden;position: fixed;top: 0;left: 0;background: #fff;width: 100vw;height: 100vh;
    .title{padding: 15px;border-bottom: 1px solid #f1f1f1;
      .el-form-item{margin-bottom: 0;
        .el-form-item__content{line-height: 34px;}
      }
    }
    .content{
      .left{width: 240px;float: left;height: calc(100vh - 67px);padding: 15px;overflow-y: auto;}
      .mid{width: calc(100% - 640px);height: calc(100vh - 67px);float: left;padding: 15px;border-left: 1px solid #f1f1f1;border-right: 1px solid #f1f1f1;overflow-y: auto;
        .formRow{width: 100%;margin-bottom: 10px;border: 1px solid transparent;position: relative;
          .el-form-item{margin-bottom: 0;}
          .el-checkbox-group{height: 100% !important;}
          .el-input-number{width: 100%;
            input{text-align: left;}
          }
          .tox-tinymce{border-radius: 4px;}
          .delFormRow{position: absolute;width: 30px;height: 20px;background: #409eff;bottom: 0;right: 0;text-align: center;cursor: pointer;display: none;
            i{line-height: 20px;color: #fff;font-size: 12px;}
          }
        }
        .active{border: 1px solid #409EFF;}
        .formRow:hover{border: 1px solid #409EFF;
          .delFormRow{display: block;}
        }
        .el-select, .el-cascader, .el-date-editor.el-input{width: 100%;}
        .el-form--label-top{
          .el-form-item__label{line-height: normal;}
        }
        .tox-tinymce{border-radius: 4px;}
      }
      .right{width: 400px;height: calc(100vh - 67px);float: right;padding: 8px 15px 15px;overflow-y: auto;
        .fixedRow{display: flex;justify-content: space-between;margin-bottom: 10px;
          .label,.value{width: 135px;}
          .operate{
            a:first-child{margin-right: 10px;}
          }
        }
        .dataResource{
          .el-form-item__content{margin-left: 0 !important;margin-top: 40px;}
        }
      }
      .elementRow{background: #F1F2F3;margin-bottom: 15px;overflow: hidden;padding: 8px 15px;cursor: move;
        .img{float: left;width: 20px;height: 20px;
          img{width: 100%;}
        }
        .name{float: left;font-size: 12px;line-height: 20px;margin-left: 10px;}
      }
    }
  }
  .el-popconfirm__main{padding: 12px 0;}
</style>