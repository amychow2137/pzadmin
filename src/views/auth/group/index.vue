<template>
  <button @click="dialogFormVisable = true">打开</button>
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
    >
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
            > 
          </el-tree>
        </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref,reactive,onMounted} from 'vue'
import { userGetMenu } from '../../../api'

onMounted(()=>{
  userGetMenu().then(({ data })=>{
  console.log(data)
  permissionData.value = data.data
  })
})

// form的数据
const form = reactive({
     name:'',
     permissions: ''
})
// 权限树形结构菜单权限
const permissionData = ref([])

// 控制弹窗的显示/隐藏
const dialogFormVisable = ref(false)

// 关闭弹窗的回掉
const beforeClose = () => {
   dialogFormVisable.value = false

}

// 选中权限
const defaultKeys = [4, 5]
const treeRef = ref()
</script>

<style lang="less" scoped>

</style>
