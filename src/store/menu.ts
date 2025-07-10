const state = {
   isCollapse:false,
   selectMenu:[],
   routerList:[]
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
   },
   dynamicMenu(state:any,payload:any){
    // 通过glob导入文件
    const modules = import.meta.glob('../views/**/**/*.vue')
    console.log(modules)
    function routerSet (router:any) {
        router.forEach((route: { children: any; component: () => Promise<unknown> }) => {
        // 判断没有子菜单，拼接路由数据
         if (!route.children){
            const url = `../views${route.meta.path}/index.vue`
            // 拿到获取的vue组建
            route.component = modules[url]
         } else {
            routerSet(route.children)
         } 
        })
    }
     routerSet(payload)
     // 拿到完整的路由数据
     state.routerList = payload
   }
}

export default {
    state,
    mutations
}