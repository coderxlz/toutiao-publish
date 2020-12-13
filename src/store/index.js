import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 存储两种状态，用户token数据以及refresh_token数据
    token: localStorage.getItem('publish_token'),
    refresh_token: localStorage.getItem('publish_refresh_token')
  },
  mutations: {
    // 保存token和refresh_token数据
    saveAllToken (state,payload) {
      if (!state.token && !state.refresh_token){
        state.token = payload.token
        state.refresh_token = payload.refresh_token
      }
      else{
        return
      }
    },
    
    // 将token数据持久化
    localToken (state,payload) {
      localStorage.setItem('publish_token',payload.token)
      localStorage.setItem('publish_refresh_token',payload.refresh_token)
    },

    // 退出登录，清除token
    clearToken (state,payload) {
      localStorage.removeItem('publish_token')
      localStorage.removeItem('publish_refresh_token')
      state.token = null
      state.refresh_token = null
    }
  },
  actions: {
  },
  modules: {
  }
})
