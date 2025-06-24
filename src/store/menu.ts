const state = {
   isCollapse:false,
   selectMenu:[]
}

const mutations = {
   collapseMenu(state: { isCollapse: boolean }){
    state.isCollapse = !state.isCollapse
   }
}

export default {
    state,
    mutations
}