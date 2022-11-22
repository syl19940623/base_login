<template>
  <div class="hbForm">
    <el-form
      ref="hbFormRef"
      :size="form.size ?? 'medium'"
      :rules="form.rules"
      :model="formData"
      :disabled="form.disabled"
      :inline="form.inline"
      :label-position="form.labelPosition ?? 'right'"
      :label-width="form.labelWidth ?? '68px'"
      :show-message="form.showMessage"
      :inline-message="form.inlineMessage"
      :status-icon="form.statusIcon"
      :hide-required-asterisk="form.hideRequiredAsterisk ?? false">
      <template v-for="item in form.list">
        <el-form-item :label="item.label" :prop="item.prop" v-if="item.type === 'text'">
          <el-input
            type="text"
            v-model="formData[item.prop]"
            :size="item.size"
            :maxlength="item.maxlength"
            :show-word-limit="item.showWordLimit"
            :disabled="item.disabled"
            :clearable="item.clearable"
            :prefix-icon="item.prefixIcon"
            :suffix-icon="item.suffixIcon"
            :placeholder="item.placeholder ?? '请输入' + item.label">
          </el-input>
        </el-form-item>
        <el-form-item :label="item.label" :prop="item.prop" v-if="item.type === 'number'">
          <el-input-number
            v-model.number="formData[item.prop]"
            controls-position="right"
            :size="item.size"
            :disabled="item.disabled"
            :min="item.min"
            :max="item.max"
            :step="item.step"
            :step-strictly="item.stepStrictly"
            :precision="item.precision"
            :controls="item.controls ?? false"
            :placeholder="item.placeholder ?? '请输入' + item.label">
          </el-input-number>
        </el-form-item>
        <el-form-item :label="item.label" :prop="item.prop" v-if="item.type === 'password'">
          <el-input
            type="password"
            v-model="formData[item.prop]"
            :size="item.size"
            :disabled="item.disabled"
            :clearable="item.clearable"
            :prefix-icon="item.prefixIcon"
            :suffix-icon="item.suffixIcon"
            :show-password="item.showPassword"
            :placeholder="item.placeholder ?? '请输入' + item.label">
          </el-input>
        </el-form-item>
        <el-form-item :label="item.label" :prop="item.prop" v-if="item.type === 'textarea'">
          <el-input
            type="textarea"
            v-model="formData[item.prop]"
            :size="item.size"
            :rows="item.rows"
            :resize="item.resize"
            :autosize="item.autosize"
            :maxlength="item.maxlength"
            :show-word-limit="item.showWordLimit"
            :disabled="item.disabled"
            :clearable="item.clearable"
            :placeholder="item.placeholder ?? '请输入' + item.label">
          </el-input>
        </el-form-item>
        <el-form-item :label="item.label" :prop="item.prop" v-if="item.type === 'select'">
          <el-select
            v-model="formData[item.prop]"
            :size="item.size"
            :multiple="item.multiple"
            :disabled="item.disabled"
            :clearable="item.clearable"
            :filterable="item.filterable"
            :allow-create="item.allowCreate"
            :collapse-tags="item.collapseTags"
            :collapse-tags-tooltip="item.collapseTagsTooltip"
            :placeholder="item.placeholder ?? '请选择' + item.label">
            <template v-for="childItem in item.options">
              <el-option
                :label="childItem.label"
                :value="childItem.value"
                :disabled="childItem.disabled">
              </el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item :label="item.label" :prop="item.prop" v-if="item.type === 'radio'">
          <el-radio-group
            v-model="formData[item.prop]"
            :size="item.size"
            :text-color="item.textColor ?? '#fff'"
            :fill="item.fill ?? '#409EFF'"
            :disabled="item.disabled">
            <template v-for="childItem in item.list">
              <el-radio
                v-if="!item.radioButton"
                :label="childItem.value"
                :size="childItem.size"
                :border="childItem.border"
                :disabled="childItem.disabled">
                {{childItem.label}}
              </el-radio>
              <el-radio-button
                v-if="item.radioButton"
                :label="childItem.value"
                :size="childItem.size"
                :disabled="childItem.disabled">
                {{childItem.label}}
              </el-radio-button>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="item.label" :prop="item.prop" v-if="item.type === 'checkbox'">
          <el-checkbox-group
            v-model="formData[item.prop]"
            :size="item.size"
            :min="item.min"
            :max="item.max"
            :text-color="item.textColor ?? '#fff'"
            :fill="item.fill ?? '#409EFF'"
            :disabled="item.disabled"
            style="height: 40px;">
            <template v-for="childItem in item.list">
              <el-checkbox
                v-if="!item.checkboxButton"
                :border="childItem.border"
                :label="childItem.label"
                :checked="childItem.checked"
                :true-label="childItem.trueLabel"
                :false-label="childItem.falseLabel"
                :disabled="childItem.disabled">
              </el-checkbox>
              <el-checkbox-button
                v-if="item.checkboxButton"
                :label="childItem.label"
                :checked="childItem.checked"
                :true-label="childItem.trueLabel"
                :false-label="childItem.falseLabel"
                :disabled="childItem.disabled">
              </el-checkbox-button>
            </template>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="item.label" :prop="item.prop" v-if="item.type === 'switch'">
          <el-switch
            v-model="formData[item.prop]"
            :disabled="item.disabled"
            :loading="item.loading"
            :size="item.size"
            :width="item.width"
            :active-icon="item.activeIcon"
            :inactive-icon="item.inactiveIcon"
            :active-text="item.activeText"
            :inactive-text="item.inactiveText"
            :active-value="item.activeValue"
            :inactive-value="item.inactiveValue"
            :style="item.style">
          </el-switch>
        </el-form-item>
        <el-form-item :label="item.label" :prop="item.prop" v-if="item.type === 'cascader'">
          <el-cascader
            v-model="formData[item.prop]"
            :size="item.size"
            :props="item.props"
            :options="item.options"
            :disabled="item.disabled"
            :clearable="item.clearable"
            :collapse-tags="item.collapseTags"
            :collapse-tags-tooltip="item.collapseTagsTooltip"
            :separator="item.separator ?? '/'"
            :filterable="item.filterable"
            :show-all-levels="item.showAllLevels ?? true"
            :placeholder="item.placeholder ?? '请选择' + item.label">
          </el-cascader>
        </el-form-item>
        <el-form-item :label="item.label" :prop="item.prop" v-if="['year', 'month', 'date', 'datetime', 'week', 'daterange', 'datetimerange'].includes(item.type)">
          <el-date-picker
            v-model="formData[item.prop]"
            :type="item.type"
            :size="item.size"
            :disabled="item.disabled"
            :editable="item.editable"
            :clearable="item.clearable"
            :format="item.format"
            :prefix-icon="item.prefixIcon"
            :range-separator="item.rangeSeparator"
            :value-format="item.valueFormat ?? (item.type === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss')"
            :placeholder="item.placeholder ?? '请选择' + item.label"
            :start-placeholder="item.startPlaceholder ?? '请选择' + item.label + '开始时间'"
            :end-placeholder="item.endPlaceholder ?? '请选择' + item.label + '结束时间'">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="['primary', 'success', 'info', 'warning', 'danger', 'default'].includes(item.type)">
          <el-button
            :type="item.type"
            :size="item.size"
            :plain="item.plain"
            :round="item.round"
            :circle="item.circle"
            :icon="item.icon"
            :link="item.link"
            :color="item.color"
            :loading="item.loading"
            :disabled="item.disabled"
            @click="handleEvent(item.event)">
            {{item.text}}
          </el-button>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'HbForm',
    props: {
      form: Object,
      formData: Object
    },
    data() {
      return {
        formValidateResult: true
      }
    },
    methods: {
      formValidate() {
        this.formValidateResult = true
        this.$refs.hbFormRef.validate((valid, fields) => {
          this.formValidateResult = valid
        })
      },
      handleEvent(event) {
        this.$refs.hbFormRef.validate((valid, fields) => {
          this.$emit(event, valid, fields)
        })
      },
      hbFormReset() {
        this.$refs.hbFormRef.resetFields();
      }
    }
  }
</script>

<style lang="less" scoped>
  .hbForm{padding: 25px 15px;
    .el-input-number{width: 100%;
      :deep(.el-input__inner){text-align: left;}
    }
    .el-select{width: 100%;}
    :deep(.el-cascader){width: 100%;}
    .el-form--inline{
      .el-form-item{margin-right: 15px;margin-bottom: 12px;min-width: 192px;}
    }
  }
</style>