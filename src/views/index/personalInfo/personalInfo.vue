<template>
  <div class="personalInfo">
    <Dialog :show="show" title="个人信息" :btn="['关闭']" @dialogClose="dialogClose">
      <div slot="vNode">
        <el-form label-width="68px" style="padding: 25px 15px 1px;width: 400px;">
          <el-form-item v-for="(item, index) in form" :key="index" :label="item.label">
            <el-input :placeholder="'请输入' + item.label" v-model="formData[item.prop]" :disabled="item.disabled">
              <template slot="append">
                <div style="color: #409EFF;cursor: pointer;" @click="edit(index)" v-if="item.disabled">修改</div>
                <div style="color: #F56C6C;cursor: pointer;" @click="save(index)" v-else>保存</div>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import { util } from "@/utils/util";

  export default {
    name: "personalInfo",
    data() {
      return {
        show: false,
        form: [
          {
            label: '邮箱账号',
            disabled: true,
            prop: 'email'
          },
          {
            label: '手机号码',
            disabled: true,
            prop: 'mobile'
          }
        ],
        formData: {
          email: '',
          mobile: '',
          systemTheme: ''
        }
      }
    },
    methods: {
      edit(index) {
        this.form[index].disabled = false
      },
      save(index) {
        const key = this.form[index].prop
        const val = this.formData[key]
        const sendData = {
          [key]: val
        }
        this.$post('common/setOtherInfo', sendData).then(res => {
          util.axiosCb(res, () => {
            this.form[index].disabled = true
            this.formData[key] = val.slice(0, 3) + '***' + val.slice(-3)
            this.$store.commit('savePersonalInfo', {
              data: this.$store.state.personalInfo,
              extendData: {
                userOther: this.formData,
                webScoketId: this.$store.state.personalExtendInfo.webScoketId
              }
            })
          })
        })
      },
      dialogClose() {
        this.show = false
        this.$data.form = this.$options.data().form
        Object.assign(this.formData, this.$store.state.personalExtendInfo.userOther)
      }
    },
    created() {
      Object.assign(this.formData, this.$store.state.personalExtendInfo.userOther)
    }
  }
</script>

<style lang="less" scoped>

</style>