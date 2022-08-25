<template>
  <div class="hbTemplate">
    <component :is="currentComponent" :data="templateData"></component>
  </div>
</template>

<script>
  import FormTemplate from "@/components/HbTemplates/FormTemplate";
  import TableTemplate from "@/components/HbTemplates/TableTemplate";
  import TreeTemplate from "@/components/HbTemplates/TreeTemplate";

  export default {
    name: "hbTemplate",
    components: {
      FormTemplate,
      TableTemplate,
      TreeTemplate
    },
    data() {
      return {
        currentComponent: '',
        templateData: {}
      }
    },
    mounted() {
      let data = {"formConfig":{"formSize":"medium","formAlign":"right","labelWidth":80},"formList":[{"type":"select","label":"数据日期","formValue":"","prop":"dataDate","placeholder":"请选择数据日期","clearable":false,"multiple":false,"filterable":true,"allowCreate":false,"required":false,"dataResource":"interface","interface":"log/getLogDateList","list":[{"label":"选项1","value":1},{"label":"选项2","value":2},{"label":"选项3","value":3}],"id":"id33332","options":[{"label":"2022-08","value":"0"},{"label":"2022-07","value":"1"},{"label":"2022-06","value":"2"},{"label":"2022-05","value":"3"},{"label":"2022-04","value":"4"},{"label":"2022-03","value":"5"}]}],"templateConfig":{"templateType":"FormTemplate","addInterface":"","editInterface":"","delInterface":"","byIdInterface":"","dataInterface":""}}
      data.formConfig.labelWidth = data.formConfig.labelWidth + 'px'
      this.currentComponent = data.templateConfig.templateType
      this.templateData = data
    }
  }
</script>

<style lang="less" scoped>

</style>