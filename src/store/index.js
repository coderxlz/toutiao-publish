import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 存储两种状态，用户token数据以及refresh_token数据
    token: '',
    refresh_token: ''
  },
  mutations: {
    // 保存token和refresh_token数据
    saveAllToken (state,payload) {
      state.token = payload.token
      state.refresh_token = payload.refresh_token
    }
  },
  actions: {
  },
  modules: {
  }
})
