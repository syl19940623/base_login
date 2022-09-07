<template>
  <div class="formTemplate">
    <HbForm :hb-form="hbForm" :hb-form-data="hbFormData" @save="save"></HbForm>
  </div>
</template>

<script>
  import HbForm from "@/components/HbForm/HbForm";
  import { util } from "@/utils/util";

  export default {
    name: "FormTemplate",
    components: {
      HbForm
    },
    props: {
      data:  Object
    },
    data() {
      return {
        hbForm: {},
        hbFormData: {},
        currentId: ''
      }
    },
    methods: {
      save() {
        let url = this.data.templateConfig.addInterface
        const sendData = {}
        for (let v of this.data.formList) {
          if (v.type == 'switch') {
            sendData[v.prop] = this.hbFormData[v.prop] ? 0 : 1
          } else {
            sendData[v.prop] = this.hbFormData[v.prop]
          }
        }
        if (this.currentId) {
          sendData.id_prikey = this.currentId
          url = this.data.templateConfig.editInterface
        }
        this.$post(url, sendData).then(res => {
          util.axiosCb(res)
        })
      }
    },
    mounted() {
      this.$set(this.hbForm, 'labelPosition', this.data.formConfig.formAlign)
      this.$set(this.hbForm, 'size', this.data.formConfig.formSize)
      this.$set(this.hbForm, 'labelWidth', this.data.formConfig.labelWidth)
      this.$set(this.hbForm, 'list', this.data.formList)
      this.hbForm.list.push({
        type: 'primary',
        text: '保存',
        event: 'save'
      })

      this.$post(this.data.templateConfig.byIdInterface).then(res => {
        if (res.code == 0) {
          this.currentId = res.data.id_prikey
          for (let v of this.data.formList) {
            if (v.type == 'switch') {
              this.hbFormData[v.prop] = res.data[v.prop] == 0
            } else {
              this.hbFormData[v.prop] = res.data[v.prop]
            }
          }
        }
      })
    }
  }
</script>

<style lang="less" scoped>

</style>