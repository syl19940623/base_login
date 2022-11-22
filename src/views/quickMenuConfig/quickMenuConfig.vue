<template>
  <div class="quickMenuConfig">
    <div class="toolbar">
      <el-form :inline="true" size="small">
        <el-form-item v-for="(item, index) in treeBtn" :key="index" v-show="judgeTreeBtn(item.event)">
          <el-button :type="item.type" @click="handleTreeBtnEvent(item.event)" :disabled="item.disabled">{{item.name}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main">
      <div class="tree">
        <HbTree
          ref="hbTree"
          urlKey="href"
          :data="treeData"
          @onClick="onclick">
        </HbTree>
      </div>
      <div class="form">
        <HbForm :form="form" :form-data="formData"></HbForm>
      </div>
    </div>
  </div>
</template>

<script>
  import HbTree from "@/components/HbTree/HbTree";
  import HbForm from "@/components/HbForm/HbForm";
  import { util } from "@/utils/util";

  export default {
    name: 'quickMenuConfig',
    components: {
      HbTree,
      HbForm
    },
    data() {
      return {
        treeBtn: [
          {
            name: '新增同级',
            type: 'primary',
            event: 'addSame',
            disabled: false
          },
          {
            name: '新增下级',
            type: 'primary',
            event: 'addNext',
            disabled: false
          },
          {
            name: '修改',
            type: 'primary',
            event: 'edit',
            disabled: false
          },
          {
            name: '删除',
            type: 'danger',
            event: 'del',
            disabled: false
          },
          {
            name: '保存',
            type: 'primary',
            event: 'save',
            disabled: true
          },
          {
            name: '取消',
            type: 'danger',
            event: 'cancel',
            disabled: true
          }
        ],
        treeData: [],
        form: {
          disabled: true,
          list: [
            {
              type: 'text',
              prop: 'label',
              label: '标签名称'
            },
            {
              type: 'text',
              prop: 'url',
              label: 'URL地址'
            },
            {
              type: 'select',
              prop: 'showMode',
              label: '标签颜色',
              options: [
                {
                  label: '黑色',
                  value: '#000000'
                },
                {
                  label: '蓝色',
                  value: '#409EFF'
                },
                {
                  label: '绿色',
                  value: '#67C23A'
                },
                {
                  label: '橙色',
                  value: '#E6A23C'
                },
                {
                  label: '红色',
                  value: '#F56C6C'
                }
              ]
            }
          ]
        },
        formData: {
          label: '',
          url: '',
          showMode: ''
        },
        flag: 'cancel',
        oldNode: {},
        currentNode: {}
      }
    },
    methods: {
      judgeTreeBtn(event) {
        let bool = true
        if (this.treeData == '' && ['addNext', 'edit', 'del'].includes(event)) {
          bool = false
        }
        return bool;
      },
      loadTree(value) {
        this.$post('navigation/getAll').then(res => {
          if (res.code == 0) {
            this.treeData = res.data
            this.$nextTick(() => {
              if (value) {
                this.currentNode = this.$refs.hbTree.getNodeByParam('value', value)
                this.$refs.hbTree.selectNode(this.currentNode);
                this.loadCurrentNodeData(value)
              } else {
                if (this.treeData) {
                  const firstSelectedNode = this.$refs.hbTree.getNodeByParam('value', this.treeData[0].value);
                  this.$refs.hbTree.selectNode(firstSelectedNode);
                  this.$refs.hbTree.expandNode(firstSelectedNode, true)
                  this.loadCurrentNodeData(firstSelectedNode.value)
                  this.currentNode = firstSelectedNode
                }
              }
            })
          }
        })
      },
      changeTreeBtn() {
        for (let v of this.treeBtn) {
          v.disabled = !v.disabled
        }
      },
      handleTreeBtnEvent(event) {
        if (this.treeData == '') {
          this[event]()
        } else {
          if (Object.keys(this.currentNode).length === 0) {
            this.$message({
              message: '请先选择一个树节点',
              type: 'error',
              duration: 1500
            });
          } else {
            this[event]()
          }
        }
        if (event != 'save') {
          this.flag = event
        }
      },
      addDefaultNode(type) {
        Object.assign(this.oldNode, this.currentNode)
        const defaultNode = {
          value: 'new',
          label: '新建节点',
          pId: this.currentNode.pId
        };
        let parentNode = null
        if (type == 'addSame') {
          parentNode = this.$refs.hbTree.getNodeByParam('value', this.currentNode.pId, null);
        } else if (type == 'addNext') {
          parentNode = this.currentNode
        }
        this.$refs.hbTree.addNodes(parentNode, defaultNode);
        const newNode = this.$refs.hbTree.getNodeByParam('value', 'new', null);
        this.$refs.hbTree.selectNode(newNode);
      },
      removeDefaultNode() {
        const removeNode = this.$refs.hbTree.getNodeByParam("value", "new", null);
        if (removeNode) {
          this.$refs.hbTree.removeNode(removeNode);
          this.$refs.hbTree.selectNode(this.oldNode);
        }
      },
      addSame() {
        this.changeTreeBtn()
        this.form.disabled = false
        this.$data.formData = this.$options.data().formData
        this.addDefaultNode('addSame')
      },
      addNext() {
        this.changeTreeBtn()
        this.form.disabled = false
        this.$data.formData = this.$options.data().formData
        this.addDefaultNode('addNext')
      },
      edit() {
        this.changeTreeBtn()
        this.form.disabled = false
      },
      del() {
        this.$confirm('是否确定删除本节点?', '提示', {
          type: 'warning'
        }).then(() => {
          this.form.disabled = true
          this.$post('navigation/remove', {
            id: this.currentNode.value
          }).then(res => {
            util.axiosCb(res, () => {
              this.$refs.hbTree.removeNode(this.currentNode);
              const father = this.$refs.hbTree.getNodeByParam('value', this.currentNode.pId, null);
              if (father) {
                if (father.children) {
                  this.currentNode = father.children[0]
                  this.$refs.hbTree.selectNode(father.children[0]);
                } else {
                  this.currentNode = father
                  this.$refs.hbTree.selectNode(father);
                }
                this.loadCurrentNodeData(this.currentNode.value)
              } else {
                this.currentNode = {}
                this.$data.formData = this.$options.data().formData
              }
            })
          })
        }).catch(() => {});
      },
      save() {
        this.form.disabled = true
        const sendData = {}
        Object.assign(sendData, this.formData)
        let url = ''
        if (this.flag == 'addSame') {
          url = 'navigation/add'
          sendData.pId = this.treeData == '' ? '' : this.currentNode.pId
        } else if (this.flag == 'addNext') {
          url = 'navigation/add'
          sendData.pId = this.currentNode.value
        } else if (this.flag == 'edit') {
          url = 'navigation/set'
          sendData.id = this.currentNode.value
        }
        this.$post(url, sendData).then(res => {
          util.axiosCb(res, () => {
            this.changeTreeBtn()
            let currentValue = this.currentNode.value
            if (this.flag == 'edit') {
              this.currentNode = this.$refs.hbTree.getNodeByParam('value', currentValue)
              this.currentNode.label = sendData.name
              this.$refs.hbTree.updateNode(this.currentNode)
              this.loadCurrentNodeData(currentValue)
            } else {
              // 新增同级、下级节点
              currentValue = res.data
              this.removeDefaultNode()
              this.loadTree(currentValue)
            }
          })
        })
      },
      cancel() {
        this.changeTreeBtn()
        this.form.disabled = true
        if (['addSame', 'addNext'].includes(this.flag)) {
          this.removeDefaultNode()
          Object.assign(this.currentNode, this.oldNode)
        }
        this.$refs.hbTree.selectNode(this.currentNode);
        this.loadCurrentNodeData(this.currentNode.value)
      },
      onclick(event, treeId, treeNode) {
        this.currentNode = treeNode
        this.loadCurrentNodeData(treeNode.value)
      },
      loadCurrentNodeData(value) {
        this.$post('navigation/getById', {
          id: value
        }).then(res => {
          if (res.code == 0) {
            Object.keys(this.formData).forEach(key => {
              this.formData[key] = res.data[key]
            })
          }
        })
      }
    },
    mounted() {
      this.loadTree()
    }
  }
</script>

<style lang="less" scoped>
  .quickMenuConfig{
    .toolbar{padding: 15px;border-bottom: 1px solid var(--border-color);
      :deep(.el-form-item){margin-bottom: 0;}
    }
    .main{height: calc(100vh - 64px);
      .tree{width: 300px;float: left;border-right: 1px solid var(--border-color);height: 100%;overflow: auto;}
      .form{width: calc(100% - 300px);float: left;overflow: auto;}
    }
  }
</style>