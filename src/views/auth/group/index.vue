<template>
  <button @click="open(null)">打开</button>
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
import {ref,reactive,onMounted} from 'vue'
import { userGetMenu,userSetMenu,menuList } from '../../../api'

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

// 打开弹窗
const open =(rowData={})=>{
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

</style>
