<template>
  <!-- <el-sub-menu index="1">
    <template #title>
      <el-icon><location /></el-icon>
      <span>Navigator One</span>
    </template>
    <el-menu-item-group title="Group One">
      <el-menu-item index="1-1">item one</el-menu-item>
      <el-menu-item index="1-2">item two</el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group title="Group Two">
      <el-menu-item index="1-3">item three</el-menu-item>
    </el-menu-item-group>
    <el-sub-menu index="1-4">
      <template #title>item four</template>
      <el-menu-item index="1-4-1">item one</el-menu-item>
    </el-sub-menu>
  </el-sub-menu>
  <el-menu-item index="2">
    <el-icon><icon-menu /></el-icon>
    <span>Navigator Two</span>
  </el-menu-item>
  <el-menu-item index="3" disabled>
    <el-icon><document /></el-icon>
    <span>Navigator Three</span>
  </el-menu-item> -->
  
  <template v-for="(item,index) in props.menuData">
    <!-- 没有子菜单的情况 -->
    <el-menu-item 
      @click="handleClick(item,`${props.index}-${item.meta.id}`)"
    v-if="!item.children || item.children?.length == 0" :index="`${props.index}-${item.meta.id}`"
    :key="`${props.index}-${item.meta.id}`">
      <!-- <el-icon><setting /></el-icon>
      <span>Navigator Four</span> -->
      <el-icon size="20">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item>
    <!-- 有子菜单的情况下需要el-sub-menu包裹 -->
    <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
      <template #title>
        <el-icon size="20">
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.name }}</span>
    </template>
    <!-- 子菜单显示用el-menu-item -->
    <!-- 递归渲染，与文件名字有关 -->
    <tree-menu :index="`${props.index}-${item.meta.id}`" 
    :menuData="item.children" ></tree-menu>
    </el-sub-menu>
  </template>
  
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'

const store = useStore()

// 创建router实例
const router = useRouter()

const props = defineProps(['menuData','index'])

//点击菜单
const handleClick = (item:any,active:any) =>{
  store.commit('addMenu',item.meta)
  store.commit('updateMenuActive',active)
  console.log('2222',active)
  router.push(item.meta.path)
}

</script>

<style scoped>

</style>