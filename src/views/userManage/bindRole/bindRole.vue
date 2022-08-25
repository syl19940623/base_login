<template>
  <div class="bindUser">
    <el-transfer
      filterable
      filter-placeholder="请输入角色关键字"
      v-model="value"
      :titles="['未选角色', '已选角色']"
      :data="transferData"
      @change="change">
    </el-transfer>
  </div>
</template>

<script>
  export default {
    name: 'bindUser',
    props: {
      data: Object
    },
    data() {
      return {
        transferData: [],
        value: []
      }
    },
    methods: {
      change() {
        this.$post('user/setUserRoles', {
          userId: this.data.id_prikey,
          roles: this.value
        })
      }
    },
    mounted() {
      this.$post('user/getUserRoles', {
        userId: this.data.id_prikey
      }).then(res => {
        this.transferData = res.data
        this.value = res.extendData.userRoles
      })
    }
  }
</script>

<style lang="less" scoped>
  .bindUser{padding: 30px;}
  :deep(.el-transfer-panel){width: 250px;}
  :deep(.el-transfer-panel__body){height: 401px;}
</style>