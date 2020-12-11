import axios from "axios"

import store from '@/store/index.js'

// 不带token的用户请求
export const request = function (config) {
  const instance = axios.create({
    baseURL: 'http://ttapi.research.itcast.cn',
    timeout: 5000
  })

  return instance(config)
} 

// 带token的用户请求
export const tokenRequest = (config) => {
  const instance = axios.create({
    baseURL: 'http://ttapi.research.itcast.cn',
    timeout: 5000
  })


  // 拦截request请求，并加入token请求头
  instance.interceptors.request.use(config => {
    if(store.state.token){
    config.headers.Authorization = `Bearer ${store.state.token}`
    }
    return config
  })

  return instance(config)
}