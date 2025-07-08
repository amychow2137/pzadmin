<template>
  <panel-head />
  <div class="btns">
    <el-button :icon="Plus" type="primary" @click="open(null)" size="small">新增</el-button>
  </div>
  <el-table :data="tableData.list" style="width: 100%;">
    <el-table-column prop="id" label="ID" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permissionName" label="菜单权限" width="500px"/>
    <el-table-column label="操作" >
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-info">
   <el-pagination
      v-model:current-page="paginationData.pageNum" 
      :page-size="paginationData.pageSize"
      :background="false"
      size="small"
      layout="total, prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  
  <el-dialog
    v-model="dialogFormVisable"
    :before-close = 'beforeClose'
    title = '添加权限'
    widtn = "500"
    >
    <el-form
      ref="formRef" 
      label-width="100px"
      label-position="left"
      :model="form"
      :rules="rules"
    >
        <el-form-item v-show="false" prop="id">
          <el-input v-model="form.id" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请填写权限名称"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-tree
            ref="treeRef"
            style="max-width: 600px;"
            :data="permissionData"
            node-key = 'id' 
            show-checkbox
            :default-checked-keys="defaultKeys"
            :default-expanded-keys="[2]"
            > 
          </el-tree>
        </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref,reactive,onMounted, nextTick} from 'vue'
import { userGetMenu,userSetMenu,menuList } from '../../../api'
import PanelHead from '../../../components/panelHead.vue'
import { Plus} from "@element-plus/icons-vue"

onMounted(()=>{
  // 菜单数据
  userGetMenu().then(({ data })=>{
  console.log(data)
  permissionData.value = data.data
  })
  getListData()
})

//列表数据
const tableData = reactive({
  list:[],
  total:0
})

const paginationData = reactive({
  pageNum: 1, // 第几页
  pageSize: 10 // 有几条数据
})

// 点击页码的回掉函数
const handleSizeChange = (val:any) => {
  paginationData.pageSize = val
  getListData()
}

// 点击当前页的函数
const handleCurrentChange = (val:any) => {
    paginationData.pageNum = val
    getListData()
}

// 打开弹窗
const open =(rowData={})=>{
    console.log(rowData)
    dialogFormVisable.value = true
    // 弹窗打开form生成是异步的
    nextTick(()=>{
      if (rowData) {
        // 浅拷贝
        Object.assign(form,{id:rowData.id,name:rowData.name })
        treeRef.value.setCheckedKeys(rowData.permission)
      }
    })
}

// 请求列表数据（多次请求数据，单独抽离方法）
const getListData = () => {
    menuList(paginationData).then(({data})=>{
    const {list,total} = data.data
    tableData.list = list
    tableData.total = total
    })
}

const formRef = ref()

// form的数据
const form = reactive({
     name:'',
     permissions: '',
     id:''
})
// 权限树形结构菜单权限
const permissionData = ref([])

// 控制弹窗的显示/隐藏
const dialogFormVisable = ref(false)

// 关闭弹窗的回掉
const beforeClose = () => {
  dialogFormVisable.value = false
  // 重置表单
  formRef.value.resetFields()
  // tree选择重置
  treeRef.value.setCheckedKeys(defaultKeys)
}

// 表单校验
const rules = reactive({
   // validator自定义校验规则,trigger在什么时候触发
   name:[{required:true,trigger:'blur',message:'请输入权限名称'}]
})

// 表单提交
const confirm = async (formEl:any) =>{
   if (!formEl) return
   await formEl.validate((vaild,fields)=>{
      if (vaild){
        // 获取到选择的checkbox数据
        const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
        userSetMenu({name:form.name,permissions,id:form.id}).then(({data})=>{
        beforeClose()
        getListData()
        })
      } else {
        console.log('error submit!', fields)
      }
   })
}

// 选中权限
const defaultKeys = [4, 5]
const treeRef = ref()
</script>

<style lang="less" scoped>
.btns {
  padding:10px 0 10px 10px;
  background-color: #fff;
}
</style>
