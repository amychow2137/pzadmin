<template>
    <el-menu
        :style = "{width: !isCollapse ? '230px':'64px'}"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="aside-container"
        default-active="2"
        text-color="#fff"
        :collapse='isCollapse'
        @open="handleOpen"
        @close="handleClose"
      >
        <p class="logo-lg">{{ isCollapse ? 'DIDI' : 'DIDI陪诊'}}</p>
        <TreeMenu :index="1" :menuData="menuData"/>
      </el-menu>
</template>

<script setup lang="ts">
   import TreeMenu from './treeMenu.vue'
   import {useRouter} from 'vue-router'
   import { reactive,computed } from 'vue'
   import {useStore} from 'vuex'
   
   const router = useRouter();
   const store = useStore()
   const isCollapse =  computed(()=> store.state.menu.isCollapse)

// 直接通过 reactive 初始化并保留类型推断
    const menuData = reactive((router.options.routes ?? [])?.[0]?.children || []);
  

  const handleOpen = () =>{

  }
  const handleClose =() =>{

  }
</script>

<style lang="less" scoped>
 .aside-container {
    height: 100%;
    .logo-lg {
        font-size: 20px;
        text-align: center;
        height: 50px;
        line-height: 50px;
        color: #fff;
    }
 }
</style>