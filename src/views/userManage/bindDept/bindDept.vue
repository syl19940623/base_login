<template>
  <div class="bindDept">
    <HbTree ref="hbTree" :check="{enable: true,chkboxType: {'Y': 'p','N': 'p'}}" :data="deptData" :default-expand-all="true" :search="true" @onCheck="onCheck"></HbTree>
  </div>
</template>

<script>
  export default {
    name: "bindDept",
    props: ['data'],
    data() {
      return {
        deptData: [],
        checkedKeys: []
      }
    },
    methods: {
      loadDept() {
        this.$post('dept/getTreeChildrenData').then(res => {
          if (res.code == 0) {
            this.deptData = res.data
            this.$nextTick(() => {
              this.loadBindDept()
            })
          }
        })
      },
      loadBindDept() {
        this.$post('user/getUserDepts', {
          userId: this.data.id_prikey
        }).then(res => {
          if (res.code == 0) {
            this.checkedKeys = res.data
            for (let v of res.data) {
              const treeNode = this.$refs.hbTree.getNodeByParam('value', v)
              this.$refs.hbTree.checkNode(treeNode, true, true)
            }
          }
        })
      },
      onCheck(event, treeId, treeNode) {
        const valueArr = []
        const checkedValueArr = this.getChildren(valueArr, treeNode);
        for (let v of checkedValueArr) {
          const node = this.$refs.hbTree.getNodeByParam("value", v, null);
          this.$refs.hbTree.checkNode(node, treeNode.checked, treeNode.checked);
        }
        this.getCheckedNodes()
      },
      getChildren(valueArr, treeNode) {
        valueArr.push(treeNode.value);
        if (treeNode.isParent) {
          for (const obj in treeNode.children) {
            this.getChildren(valueArr, treeNode.children[obj]);
          }
        }
        return valueArr;
      },
      getCheckedNodes() {
        let totalCheckedKeys = []
        const allCheckedNodes = this.$refs.hbTree.getCheckedNodes(true)
        for (let v of allCheckedNodes) {
          if (!this.$refs.hbTree.getCheckStatus(v).half) {
            totalCheckedKeys.push(v.value)
          }
        }
        this.checkedKeys = totalCheckedKeys
      }
    },
    mounted() {
      this.loadDept()
    }
  }
</script>

<style lang="less" scoped>

</style>