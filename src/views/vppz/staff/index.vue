<template>
  <div class="btns">
    <el-button :icon="Plus" type="primary" @click="open(null)" size="small">新增</el-button>
  </div>
  <el-dialog
    v-model="dialogFormVisable"
    :before-close = 'beforeClose'
    title = '陪护师添加'
    widtn = "500"
    >
      <el-form
        ref="formRef" 
        label-width="100px"
        label-position="left"
        :model="form"
        :rules="rules">
        <el-form-item v-show="false" prop="id">
          <el-input v-model="form.id" />
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input v-model="form.name" placeholder="请输入昵称"/>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-button v-if="!form.avatar" type="primary">点击上传</el-button>
          <el-image 
              v-else
              :src="form.avatar"
              style="width: 100px;height: 100px;"
              />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择姓名">
            <el-option label="男" value="1" />
            <el-option label="女" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
           <el-input-number v-model="form.age" :min="18" :max="50" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="是否生效" prop="active">
          <el-radio-group v-model="form.active">
            <el-radio value="0">失效</el-radio>
            <el-radio value="1">生效</el-radio>
          </el-radio-group>
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

import { Plus} from "@element-plus/icons-vue"
import {reactive, ref} from 'vue'

const dialogFormVisable = ref(false)
const beforeClose = () => {
  
}

const formRef = ref()
const form = reactive({
    id: '',
    mobile: '',
    active: 1,
    age: 28,
    avatar: '',
    name: '',
    sex: ''
})

const rules = reactive({

})

// 表单提交
const confirm = async (formEl:any) =>{
   if (!formEl) return
   await formEl.validate((vaild:any,fields:any)=>{
      if (vaild){
        
      } else {
        console.log('error submit!', fields)
      }
   })
}

// 打开弹窗
const open =(rowData={})=>{
    dialogFormVisable.value = true
}

</script>
<style lang="less" scoped>
.btns {
    padding: 10px 0 10px 10px;
    background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
