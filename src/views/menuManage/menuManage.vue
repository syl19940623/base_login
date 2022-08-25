<template>
  <div class="menuManageOut">
    <div class="topOut">
      <el-form :inline="true" size="small">
        <el-form-item v-for="(item, index) in menuBtn" :key="index">
          <el-button :type="item.type" @click="handleEvent(item.event)" :disabled="item.disabled">{{item.name}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="midOut">
      <div class="leftOut">
        <HbTree
          ref="hbTree"
          :data="treeData"
          :edit="hbTreeEdit"
          @beforeDrop="beforeDrop"
          @onDrop="onDrop"
          @onClick="onclick"
          @onRightClick="onRightClick">
        </HbTree>
      </div>
      <div class="rightOut">
        <el-form label-width="82px" v-if="[0, 10, 11].includes(formType)">
          <el-form-item label="菜单名称">
            <el-input placeholder="请输入菜单名称" v-model="formOne.name" :disabled="treeFormDisabled"></el-input>
          </el-form-item>
          <el-form-item label="菜单分类">
            <el-select v-model="formOne.systemType" placeholder="请选择菜单分类" :disabled="treeFormDisabled">
              <el-option
                v-for="item in formOneMenuCategory"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单图标">
            <el-input v-model="formOne.treeIcon" placeholder="请选择菜单图标" :disabled="treeFormDisabled" readonly>
              <template v-if="formOne.treeIcon" slot="prepend"><i :class="formOne.treeIcon"></i></template>
              <template slot="append">
                <el-button @click="uploadFormOneIcon('formOne.treeIcon', $event)">选择图标</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="菜单类型">
            <el-select v-model="formOne.type" placeholder="请选择菜单类型" :disabled="treeFormDisabled">
              <el-option
                v-for="item in formOneMenuType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请求地址">
            <el-input v-model="formOne.urlAddress" placeholder="请输入请求地址" :disabled="treeFormDisabled"></el-input>
          </el-form-item>
          <el-form-item label="工程名称">
            <el-input v-model="formOne.systemName" placeholder="请输入工程名称" :disabled="treeFormDisabled"></el-input>
          </el-form-item>
          <el-form-item label="本公司系统">
            <el-switch v-model="formOne.hbsoftSystemFlag" :disabled="treeFormDisabled"></el-switch>
          </el-form-item>
          <el-form-item label="数据库名称">
            <el-input v-model="formOne.databaseName" placeholder="请输入数据库名称" :disabled="treeFormDisabled"></el-input>
          </el-form-item>
          <el-form-item label="系统简介">
            <el-input v-model="formOne.remarks" type="textarea" :rows="5" placeholder="请输入系统简介" :disabled="treeFormDisabled"></el-input>
          </el-form-item>
        </el-form>
        <el-form label-width="68px" v-else>
          <el-form-item label="菜单名称">
            <el-input placeholder="请输入菜单名称" v-model="formTwo.name" :disabled="treeFormDisabled"></el-input>
          </el-form-item>
          <el-form-item label="菜单图标">
            <el-input placeholder="请选择菜单图标" readonly v-model="formTwo.treeIcon" :disabled="treeFormDisabled">
              <template v-if="formTwo.treeIcon" slot="prepend"><i :class="formTwo.treeIcon"></i></template>
              <template slot="append">
                <el-button @click="uploadFormTwoIcon('formTwo.treeIcon', $event)">选择图标</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="菜单类型">
            <el-select v-model="formTwo.type" placeholder="请选择菜单类型" @change="formTwoMenuTypeChange" :disabled="treeFormDisabled">
              <el-option
                v-for="item in formTwoMenuType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="流程图片" v-show="formType == 20">
            <el-input placeholder="请选择流程图片" readonly v-model="formTwo.flowChart" :disabled="treeFormDisabled">
              <template slot="append">
                <el-upload
                  action=""
                  accept="image/*"
                  :multiple="false"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="uploadFormTwoFlow">
                  <el-button slot="trigger" size="small">选择图片</el-button>
                </el-upload>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="请求地址" v-show="formType == 30">
            <el-input placeholder="请输入请求地址" v-model="formTwo.urlAddress" :disabled="treeFormDisabled"></el-input>
          </el-form-item>
          <el-form-item label="模板id" v-show="formType == 32" class="templateId">
            <el-input placeholder="请输入模板id" v-model="formTwo.templateId" :disabled="treeFormDisabled" readonly></el-input>
            <el-link type="primary" :underline="false" @click="jumpToFormDesign(formTwo.name)">去设置</el-link>
          </el-form-item>
          <el-form-item label="按钮标识" v-show="formType == 90">
            <el-input placeholder="请输入按钮标识" v-model="formTwo.perFlag" :disabled="treeFormDisabled"></el-input>
          </el-form-item>
        </el-form>
        <!-- 选择图标 -->
        <selectIcon ref="selectIconOut" :show.sync="selectIconShow" :data="selectIconData" @selectIcon="selectIcon"/>
        <!-- 树右键菜单 -->
        <treeMenu :show.sync="treeMenuShow" :data="treeMenuData" @importSuccess="importSuccess"></treeMenu>
        <!-- 表单设计 -->
        <formDesign :show.sync="formDesignShow" @designSuccess="designSuccess"></formDesign>
      </div>
    </div>
  </div>
</template>

<script>
  import HbTree from "@/components/HbTree/HbTree";
  import selectIcon from "./selectIcon/selectIcon";
  import treeMenu from "./treeMenu/treeMenu";
  import formDesign from '../formDesign/formDesign';

  export default {
    name: 'menuManage',
    components: {
      HbTree,
      selectIcon,
      treeMenu,
      formDesign
    },
    data() {
      return {
        menuBtn: [
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
        formOneMenuCategory: [
          {
            label: '理财',
            value: '001'
          },
          {
            label: '通讯',
            value: '002'
          },
          {
            label: '办公',
            value: '003'
          },
          {
            label: '档案',
            value: '004'
          },
          {
            label: '系统',
            value: '005'
          }
        ],
        formOneMenuType: [
          {
            label: '系统',
            value: 10
          },
          {
            label: '系统(扩展菜单)',
            value: 11
          }
        ],
        formTwoMenuType: [
          {
            label: '菜单组',
            value: 20
          },
          {
            label: '扩展菜单组',
            value: 21
          },
          {
            label: '菜单模块',
            value: 30
          },
          {
            label: '快捷报表',
            value: 31
          },
          {
            label: '页面模板',
            value: 32
          },
          {
            label: '功能按钮',
            value: 90
          }
        ],
        formOne: {
          name: '',
          systemType: '',
          icon: '',
          treeIcon: '',
          type: '',
          urlAddress: '',
          systemName: '',
          hbsoftSystemFlag: true,
          databaseName: '',
          remarks: ''
        },
        formOneEmpty: {
          name: '',
          systemType: '',
          icon: '',
          treeIcon: '',
          type: '',
          urlAddress: '',
          systemName: '',
          hbsoftSystemFlag: true,
          databaseName: '',
          remarks: ''
        },
        formTwo: {
          name: '',
          icon: '',
          treeIcon: '',
          type: '',
          flowChart: '',
          urlAddress: '',
          perFlag: '',
          templateId: ''
        },
        formTwoEmpty: {
          name: '',
          icon: '',
          treeIcon: '',
          type: '',
          flowChart: '',
          urlAddress: '',
          perFlag: '',
          templateId: ''
        },
        formType: 0,
        flag: 'cancel',
        oldNode: {},
        currentNode: {},
        treeFormDisabled: true,
        selectIconShow: false,
        selectIconData: {
          y: 0,
          prop: ''
        },
        treeMenuShow: false,
        treeMenuData: {
          node: {},
          x: 0,
          y: 0
        },
        hbTreeEdit: {
          drag: {
            isCopy: false,
            isMove: true,
            prev: true,
            next: true,
            inner: true
          },
          enable: true,
          showRenameBtn: false,
          showRemoveBtn: false
        },
        formDesignShow: false
      }
    },
    methods: {
      loadTree(value) {
        this.$post('menu/getTreeAll').then(res => {
          if (res.code == 0) {
            this.treeData = res.data
            this.$nextTick(() => {
              if (value) {
                this.currentNode = this.$refs.hbTree.getNodeByParam('value', value)
                this.$refs.hbTree.selectNode(this.currentNode);
                this.loadCurrentNodeData(value)
              } else {
                if (this.treeData != '') {
                  const firstSelectedNode = this.$refs.hbTree.getNodeByParam('value', this.treeData[0].value);
                  this.$refs.hbTree.selectNode(firstSelectedNode);
                  this.loadCurrentNodeData(firstSelectedNode.value)
                  this.currentNode = firstSelectedNode
                }
              }
            })
          }
        })
      },
      changeMenuBtn() {
        for (let v of this.menuBtn) {
          v.disabled = !v.disabled
        }
      },
      handleEvent(event) {
        if (this.treeData == '' && (event == 'addSame' || event == 'save' || event == 'cancel')) {
          this[event]()
        } else {
          if (JSON.stringify(this.currentNode) == '{}') {
            this.$message({
              message: '请先选中一个树节点',
              type: 'error',
              duration: 1000
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
          value: "new",
          label: "新建节点",
          pId: this.currentNode.pId
        };
        this.formOne.name = '新建节点'
        this.formTwo.name = '新建节点'
        let parentNode = null
        if (type == 'addSame') {
          parentNode = this.$refs.hbTree.getNodeByParam("value", this.currentNode.pId, null);
        } else if (type == 'addNext') {
          parentNode = this.currentNode
        }
        this.$refs.hbTree.addNodes(parentNode, defaultNode);
        const newNode = this.$refs.hbTree.getNodeByParam("value", "new", null);
        this.$refs.hbTree.selectNode(newNode);
      },
      removeDefaultNode() {
        const removeNode = this.$refs.hbTree.getNodeByParam("value", "new", null);
        if (removeNode != null) {
          this.$refs.hbTree.removeNode(removeNode);
          this.$refs.hbTree.selectNode(this.oldNode);
        }
      },
      addSame() {
        this.changeMenuBtn()
        this.treeFormDisabled = false
        Object.assign(this.formOne, this.formOneEmpty);
        Object.assign(this.formTwo, this.formTwoEmpty);
        this.addDefaultNode('addSame')
      },
      addNext() {
        this.formType = 20
        this.changeMenuBtn()
        this.treeFormDisabled = false
        Object.assign(this.formOne, this.formOneEmpty);
        Object.assign(this.formTwo, this.formTwoEmpty);
        this.addDefaultNode('addNext')
      },
      edit() {
        this.changeMenuBtn()
        this.treeFormDisabled = false
      },
      beforeDrop(treeId, treeNodes, targetNode, moveType, callback) {
        let dropBool = false
        const nodes = this.$refs.hbTree.transformToArray(treeNodes);
        let msg = ''
        if (moveType == 'prev' || moveType == 'next') {
          switch (targetNode.type * 1) {
            case 10:
            case 11:
              dropBool = (nodes[0].type == 10 || nodes[0].type == 11)
              if (!dropBool) {
                if (nodes[0].type == 20 || nodes[0].type == 21) {
                  msg = '菜单组只能移动至另一个菜单组的同级'
                } else if (nodes[0].type == 30 || nodes[0].type == 40 || nodes[0].type == 50) {
                  msg = '菜单模块只能移动至另一个菜单模块的同级'
                } else if (nodes[0].type == 90) {
                  msg = '菜单按钮只能移动至另一个菜单按钮的同级'
                }
              }
              break;
            case 20:
            case 21:
              dropBool = (nodes[0].type == 20 || nodes[0].type == 21 || nodes[0].type == 30 || nodes[0].type == 40 || nodes[0].type == 50)
              if (!dropBool) {
                if (nodes[0].type == 10 || nodes[0].type == 11) {
                  msg = '系统只能移动至另一个系统的同级'
                } else if (nodes[0].type == 90) {
                  msg = '菜单按钮只能移动至另一个菜单按钮的同级'
                }
              }
              break;
            case 30:
            case 40:
            case 50:
              dropBool = (nodes[0].type == 30 || nodes[0].type == 40 || nodes[0].type == 50)
              if (!dropBool) {
                if (nodes[0].type == 10 || nodes[0].type == 11) {
                  msg = '系统只能移动至另一个系统的同级'
                } else if (nodes[0].type == 20 || nodes[0].type == 21) {
                  msg = '菜单组只能移动至另一个菜单组的同级'
                } else if (nodes[0].type == 90) {
                  msg = '菜单按钮只能移动至另一个菜单按钮的同级'
                }
              }
              break;
            case 90:
              dropBool = (nodes[0].type == 90)
              if (!dropBool) {
                if (nodes[0].type == 10 || nodes[0].type == 11) {
                  msg = '系统只能移动至另一个系统的同级'
                } else if (nodes[0].type == 20 || nodes[0].type == 21) {
                  msg = '菜单组只能移动至另一个菜单组的同级'
                } else if (nodes[0].type == 30 || nodes[0].type == 40 || nodes[0].type == 50) {
                  msg = '菜单模块只能移动至另一个菜单模块的同级'
                }
              }
              break;
          }
        } else if (moveType == 'inner') {
          let pIdType = 0
          switch (targetNode.type * 1) {
            case 10:
            case 11:
              pIdType = 11;
              msg = '系统不能移动至另一个系统下'
              break;
            case 20:
            case 21:
              pIdType = 21;
              msg = '菜单组不能移动至另一个菜单组下'
              break;
            case 30:
            case 40:
            case 50:
              pIdType = 50;
              msg = '模块不能移动至另一个模块下'
              break;
            case 90:
              pIdType = 90;
              msg = '按钮不能移动至另一个按钮下'
              break;
          }
          dropBool = nodes[0].type > pIdType
          if (dropBool) {
            if (nodes[0].type == 90 && pIdType != 50) {
              msg = '按钮只能移动至菜单模块或快捷报表下'
              dropBool = false
            }
          }
        }
        if (!dropBool) {
          this.$message.error(msg)
        }
        callback(dropBool)
      },
      onDrop(event, treeId, treeNodes, targetNode, moveType) {
        const nodes = this.$refs.hbTree.transformToArray(treeNodes);
        let dropObj = {}
        dropObj.id = nodes[0].value
        dropObj.pId = nodes[0].pId == null ? '' : nodes[0].pId
        const treeObj = this.$refs.hbTree
        const allNodes = treeObj.transformToArray(treeObj.getNodes());
        for (let k = 0; k < allNodes.length; k++) {
          const bool = dropObj.id == allNodes[k].value
          if (bool) {
            dropObj.sequenceNum = treeObj.getNodeIndex(allNodes[k]) + 1
          }
        }
        this.$post('menu/setMenuSequence', dropObj).then(res => {
          if (res.code == 0) {
            this.loadTree(res.data)
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      del() {
        this.$confirm('是否确定删除本节点?', '提示', {
          type: 'warning'
        }).then(() => {
          this.treeFormDisabled = true
          this.$post('menu/remove', {
            id: this.currentNode.value
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.$refs.hbTree.removeNode(this.currentNode);
                  const father = this.$refs.hbTree.getNodeByParam("value", this.currentNode.pId, null);
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
                  }
                }
              })
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {

        });
      },
      save() {
        this.treeFormDisabled = true
        let sendData = {}
        let url = ''
        if (this.flag == 'addSame') {
          url = 'menu/add'
          if (this.currentNode.pId == '') {
            Object.assign(sendData, this.formOne);
            sendData.hbsoftSystemFlag = sendData.hbsoftSystemFlag ? 0 : 1
          } else {
            sendData = this.formTwo
          }
          sendData.pId = this.treeData == '' ? '' : this.currentNode.pId
        } else if (this.flag == 'addNext') {
          url = 'menu/add'
          sendData = this.formTwo
          sendData.pId = this.currentNode.value
        } else if (this.flag == 'edit') {
          url = 'menu/set'
          if (this.currentNode.pId == '') {
            Object.assign(sendData, this.formOne);
            sendData.hbsoftSystemFlag = sendData.hbsoftSystemFlag ? 0 : 1
          } else {
            sendData = this.formTwo
          }
          sendData.id = this.currentNode.value
        }
        this.$post(url, sendData).then(res => {
          if (res.code == 0) {
            this.changeMenuBtn()
            let currentValue = this.currentNode.value
            if (this.flag != 'edit') {
              currentValue = res.data
              this.removeDefaultNode()
              this.loadTree(currentValue)
            } else {
              this.currentNode = this.$refs.hbTree.getNodeByParam('value', currentValue)
              this.currentNode.label = sendData.name
              this.$refs.hbTree.updateNode(this.currentNode)
              this.loadCurrentNodeData(currentValue)
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      cancel() {
        this.changeMenuBtn()
        this.treeFormDisabled = true
        if (this.flag != 'edit') {
          this.removeDefaultNode()
          Object.assign(this.currentNode, this.oldNode)
        }
        this.$refs.hbTree.selectNode(this.currentNode)
        this.loadCurrentNodeData(this.currentNode.value)
      },
      onclick(event, treeId, treeNode) {
        this.currentNode = treeNode
        this.loadCurrentNodeData(treeNode.value)
      },
      uploadFormOneIcon(prop, event) {
        this.selectIconShow = true
        this.selectIconData.y = event.y
        this.selectIconData.prop = prop
      },
      uploadFormTwoIcon(prop, event) {
        this.selectIconShow = true
        this.selectIconData.y = event.y
        this.selectIconData.prop = prop
      },
      uploadFormTwoFlow(file, fileList) {
        this.formTwo.flowChart = file.name
      },
      selectIcon(className, prop) {
        const formName = prop.split('.')[0]
        const paramName = prop.split('.')[1]
        this.$set(this[formName], paramName, className)
        this.$refs.selectIconOut.selectIconClose()
      },
      formTwoMenuTypeChange(val) {
        this.formType = val
      },
      loadCurrentNodeData(value) {
        this.$post('menu/getById', {
          id: value
        }).then(res => {
          if (res.code == 0) {
            let formData = res.data
            this.formType = formData.type
            if (this.formType == 0 || this.formType == 10 || this.formType == 11) {
              formData.hbsoftSystemFlag = formData.hbsoftSystemFlag == 1 ? false : true
              this.formOne = formData
            } else {
              this.formTwo = formData
            }
          }
        })
      },
      onRightClick(event, treeId, treeNode) {
        this.currentNode = treeNode
        this.loadCurrentNodeData(treeNode.value)
        this.$refs.hbTree.selectNode(treeNode)
        this.treeMenuShow = true
        this.treeMenuData.node = treeNode
        this.treeMenuData.x = event.clientX
        this.treeMenuData.y = event.clientY
      },
      importSuccess(node, type) {
        // 菜单导入成功
        this.treeMenuShow = false
        this.loadTree()
      },
      jumpToFormDesign(name) {
        this.formDesignShow = true
      },
      designSuccess(data) {
        this.formTwo.templateId = data
        this.formDesignShow = false
      }
    },
    mounted() {
      this.loadTree()
    }
  }
</script>

<style lang="less" scoped>
  .menuManageOut{
    .topOut{padding: 15px;border-bottom: 1px solid #EBEEF5;}
    .midOut{height: calc(100vh - 64px);
      .leftOut{width: 300px;float: left;border-right: 1px solid #EBEEF5;height: 100%;overflow: auto;}
      .rightOut{width: calc(100% - 300px);float: left;padding: 15px;}
    }
  }
</style>

<style lang="less">
  .topOut .el-form-item{margin-bottom: 0;}
  .rightOut .el-select{width: 100%;}
  .templateId{
    .el-input{width: calc(100% - 52px);}
    .el-link{float: right;}
  }
</style>