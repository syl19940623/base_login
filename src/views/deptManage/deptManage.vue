<template>
  <div class="deptManage">
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
    name: 'deptManage',
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
              prop: 'code',
              label: '部门编号'
            },
            {
              type: 'text',
              prop: 'name',
              label: '部门名称'
            },
            {
              type: 'select',
              prop: 'type',
              label: '部门类型',
              filterable: true,
              options: [
                {
                  label: '集团',
                  value: '1'
                },
                {
                  label: '公司',
                  value: '2'
                },
                {
                  label: '部门',
                  value: '3'
                }
              ]
            },
            {
              type: 'select',
              prop: 'deptHeader',
              label: '部门领导',
              filterable: true,
              options: [
                {
                  label: '张三',
                  value: '1'
                },
                {
                  label: '李四',
                  value: '2'
                }
              ]
            },
            {
              type: 'switch',
              prop: 'isUse',
              label: '是否启用'
            },
            {
              type: 'text',
              prop: 'deptAddress',
              label: '部门地址'
            },
            {
              type: 'text',
              prop: 'deptMobile',
              label: '部门电话'
            },
            {
              type: 'text',
              prop: 'deptFax',
              label: '部门传真'
            },
            {
              type: 'text',
              prop: 'postCode',
              label: '邮政编码'
            },
            {
              type: 'number',
              prop: 'sort',
              label: '排序顺序'
            }
          ]
        },
        formData: {
          code: '',
          name: '',
          type: '',
          deptHeader: '',
          isUse: true,
          deptAddress: '',
          deptMobile: '',
          deptFax: '',
          postCode: '',
          sort: ''
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
        this.$post('dept/getTreeChildrenData').then(res => {
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
        this.formData.name = '新建节点'
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
          this.$post('dept/remove', {
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
        sendData.isUse = sendData.isUse ? 0 : 1
        let url = ''
        if (this.flag == 'addSame') {
          url = 'dept/add'
          sendData.pId = this.treeData == '' ? '' : this.currentNode.pId
        } else if (this.flag == 'addNext') {
          url = 'dept/add'
          sendData.pId = this.currentNode.value
        } else if (this.flag == 'edit') {
          url = 'dept/set'
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
        this.$post('dept/getById', {
          id: value
        }).then(res => {
          if (res.code == 0) {
            Object.keys(this.formData).forEach(key => {
              this.formData[key] = typeof this.formData[key] === 'boolean' ? res.data[key] === 0 : res.data[key]
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
  .deptManage{
    .toolbar{padding: 15px;border-bottom: 1px solid var(--border-color);
      :deep(.el-form-item){margin-bottom: 0;}
    }
    .main{height: calc(100vh - 64px);
      .tree{width: 300px;float: left;border-right: 1px solid var(--border-color);height: 100%;overflow: auto;}
      .form{width: calc(100% - 300px);float: left;overflow: auto;}
    }
  }
</style>