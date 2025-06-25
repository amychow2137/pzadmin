const state = {
   isCollapse:false,
   selectMenu:[]
}

const mutations = {
   collapseMenu(state: { isCollapse: boolean }){
      state.isCollapse = !state.isCollapse
   },
   addMenu(state: any,payload: any) {
      // 对数据进行去重
      if (state.selectMenu.findIndex((item: { path: any }) => item.path === payload.path) === -1) {
          state.selectMenu.push(payload)
      }
   },
   closeMenu(state: any,payload: any){
      // 找到点击数据的索引
      const index = state.selectMenu.findIndex((val: { name: any }) => val.name === payload.name)
      // 通过索引删除数组指定元素
      state.selectMenu.splice(index,1)
   }
}

export default {
    state,
    mutations
}