<template>
  <div class="common-layout">
    <el-container>
      <!--<el-aside width="200px">Aside</el-aside>-->
      <el-aside width=auto><Aside /></el-aside>
      <el-container>
        <!-- <el-header>Header</el-header> -->
         <el-header><Header /></el-header>
        <el-main>
          <RouterView/>
       </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script setup lang="ts">
 import Aside from '../components/aside.vue'
 import Header from '../components/navHeader.vue'

</script>

<style lang="less" scoped>
  .common-layout{
      height: 100%;
      .el-container {
        height: 100%;}}
</style>