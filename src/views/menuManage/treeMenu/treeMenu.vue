<template>
  <transition name="dialog-fade">
    <ul id="treeMenu" v-if="show" :style="{position: 'fixed', top: (data.y + 15) + 'px', left: (data.x + 15) + 'px'}">
      <li @click="exportMenu">导出本级菜单</li>
      <li>导入本级菜单<input type="file" accept=".txt" @change="importMenu('same', $event)"></li>
      <li>导入下级菜单<input type="file" accept=".txt" @change="importMenu('next', $event)"></li>
    </ul>
  </transition>
</template>

<script>
  export default {
    name: "TreeMenu",
    props: {
      show: Boolean,
      data: Object
    },
    methods: {
      treeMenuClose() {
        this.$emit('update:show', false)
      },
      exportMenu() {
        this.treeMenuClose()
        location.href = 'api/menu/exportMenu?menuId=' + this.data.node.value
      },
      importMenu(type, event) {
        this.treeMenuClose()
        const file = event.target.files[0]
        const reader = new FileReader()
        reader.readAsText(file, "UTF-8")
        reader.onload = e => {
          const content = e.target.result
          let pId = ''
          if (type == 'same') {
            pId = this.data.node.pId == null ? '' : this.data.node.pId
          } else if (type == 'next') {
            pId = this.data.node.value
          }
          this.$post('menu/importMenu', {
            pId: pId,
            data: content
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.msg,
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.$emit('importSuccess', this.data.node, type)
                }
              })
            } else {
              this.$message({
                message: res.msg,
                type: 'error',
                duration: 1000
              })
            }
          })
        }
      }
    },
    mounted() {
      document.addEventListener('mouseup',(e) => {
        const element = document.getElementById('treeMenu')
        if (element && !element.contains(e.target)) {
          this.treeMenuClose()
        }
      })
    }
  }
</script>

<style lang="less" scoped>
  #treeMenu{background: #fff;box-shadow: 0 0 4px 2px rgba(0, 0, 0, .1);width: 140px;
    li{line-height: 40px;border-bottom: 1px solid #F2F6FC;text-align: center;cursor: pointer;position: relative;
      input{position: absolute;width: 100%;height: 100%;top: 0;left: 0;opacity: 0;font-size: 0;cursor: pointer;}
    }
    li:last-child{border-bottom: none;}
    li:hover{color: #409EFF;}
  }
</style>