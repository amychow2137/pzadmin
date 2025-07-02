<template>
  <div class="">admin
  </div>
</template>
<script setup lang="ts">
import { authAdmin } from '../../../api';
import { reactive,onMounted } from 'vue';

const paginationData = reactive({
  pageNum: 1, // 第几页
  pageSize: 10 // 有几条数据
})

onMounted(()=>{
  authAdmin(paginationData).then(({data})=>{
    console.log(data)
  })
})

</script>
<style lang="less" scoped>




</style>
