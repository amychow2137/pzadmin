<template>
   <el-row class="login-container" justify="center" :align="'middle'">
      <el-card style="max-width: 480px;">
         <template #header>
            <div class="card-header">
               <img :src="imgUrl" alt="">
            </div>
         </template>
         <div class="jump-link">
            <el-link type="primary" @click="handlechange">{{ fromType ? '返回登录': '注册账号' }}</el-link>
         </div>
           <el-form 
           ref="loginFormRef"
           :model="loginForm" 
           style="max-width: 600px;"
           class="demo-ruleForm"
           :rules="rules"
           >
            <el-form-item prop="userName">
              <el-input v-model="loginForm.userName" placeholder="手机号" :prefix-icon="'UserFilled'"></el-input>
            </el-form-item>
            <el-form-item prop="passWord">
              <el-input v-model="loginForm.passWord" type="password" placeholder="密码" :prefix-icon="'Lock'"></el-input>
            </el-form-item>
            <el-form-item v-if="fromType" prop="validCode">
              <el-input v-model="loginForm.validCode" placeholder="验证码" :prefix-icon="'Lock'">
                  <template #append>
                     <span @click="countDownChange">{{ countDown.validText }}</span>
                  </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type = "primary" :style="{width: '100%'}" @click="submitForm(loginFormRef)">
                 {{ fromType ? '注册账号': '登录' }}
              </el-button>
            </el-form-item>
           </el-form>
      </el-card>
   </el-row>
</template>

<script setup lang="ts">
import { ref,reactive,computed,toRaw } from 'vue'
import { getCode,userAuthentication,login,menuPermissions } from '../../api'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const imgUrl = new URL('../../../public/login-head.png',import.meta.url).href

//  表单数据
const loginForm = reactive({
   userName:'',
   passWord:'',
   validCode:''
})

//  切换表单（0登录 1注册）
const fromType = ref(0) 
// 点击切换登录和注册
const handlechange = () => {
    fromType.value = fromType.value ? 0 : 1
}

// 账号校验规则
const validateUser = (rule: any,value: string,callback: (arg0: Error | undefined) => void) => {
   // 不能为空
   if (value === '') {
      callback(new Error('请输入账号'))
   } else {
      const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
      phoneReg.test(value) ? callback() : callback(new Error('手机号格式错误，请输入正确手机号'))
   }
}
// 密码校验
const validatePass = (rule: any,value: string,callback: (arg0: Error | undefined) => void) => {
   if (value === '') {
      callback(new Error('请输入密码'))
   } else {
      const password = /^[a-zA-Z0-9_-]{4,16}$/
      password.test(value) ? callback() : callback(new Error('密码格式错误，需要4到16位字符，请确认格式'))
   }
}

// 表单校验
const rules = reactive({
   // validator自定义校验规则,trigger在什么时候触发
   userName:[{validator: validateUser,trigger:'blur'}],
   passWord:[{validator: validatePass,trigger:'blur'}]
})

// 发送短信
const countDown = reactive({
   validText:'获取验证码',
   time:60
})
let flag = false
const countDownChange =() =>{
   // 如果是已发送不处理
   if (flag) return
   // 判断手机号，是否正确
   const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
   if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
      return ElMessage({
               message: '请检查手机号是否正确',
               type: 'warning',
            })
   }
   // 倒计时
   const time = setInterval(()=>{
      if (countDown.time <= 0) {
         countDown.time = 60
         countDown.validText = '获取验证码'
         flag = false
         clearInterval(time) // 清除定时器
      } else {
         countDown.time -= 1
         countDown.validText = `剩余${countDown.time}s`}
   },1000)
   flag = true
   getCode({ tel : loginForm.userName }).then(({ data}) =>{
   console.log(data,'data')
   if (data.code === 10000) {
      ElMessage.success('发送成功')
   }
   })
}

const router = useRouter()
const loginFormRef = ref()
const store = useStore()

const routerList =  computed(()=>store.state.menu.routerList)

// 表单提交
const  submitForm = async (formEl: any)=> {
  if (!formEl) return
  // 手动触发校验
  await formEl.validate((valid: any, fields: any) => {
    if (valid) {
      console.log('submit!')
      // 注册页面
      if (fromType.value) {
         userAuthentication(loginForm).then(({data})=>{
             if (data.code === 10000) {
               ElMessage.success('注册成功')
               fromType.value = 0
             } 
         })
      } else {
      //  登录页面
        login(loginForm).then(({data})=>{
         if (data.code === 10000) {
            ElMessage.success('登录成功')
            // 页面跳转逻辑和数据缓存逻辑
            // 将token和用户信息缓存到浏览器
            localStorage.setItem('pz_token',data.data.token)
            localStorage.setItem('pz_userInfo',JSON.stringify(data.data.userInfo)) // 需要把{}转成对象
            // 获取权限数据
            menuPermissions().then(({ data })=>{
               store.commit('dynamicMenu',data.data)
               console.log(routerList)
               // toRaw可以把一个响应式的数据变成一个普通的数据
               toRaw(routerList.value).forEach((item: any) => {
                  router.addRoute('main',item)
               })
               // 页面跳转
               router.push('/')
            })
         }
        })
      }
      //
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang='less' scoped>
:deep(.el-card__header) {
   padding: 0
}
.login-container {
   height: 100%;
   .card-header{
      background-color: #899fe1;
      img {
         width: 430px;
      }
   }
   .jump-link {
      text-align: right;
      margin-bottom: 10px;
   }
}
</style>