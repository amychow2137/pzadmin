import { createStore } from 'vuex'
import menu from './menu'
import createPersistedstate from 'vuex-persistedstate'


export default createStore({
  // 接收很多个处理的函数
  plugins:[createPersistedstate({
    key:'pz_v3pz'
  })], 
  modules: {
    menu
  }
})