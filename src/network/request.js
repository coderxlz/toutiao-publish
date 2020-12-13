import axios from "axios"

import store from '@/store/index.js'

import JSONbig from 'json-bigint'

// 不带token的用户请求
export const request = function (config) {
  const instance = axios.create({
    baseURL: 'http://ttapi.research.itcast.cn',
    timeout: 5000,
    // 拦截axios自动转换手动使用jsonbig进行转换从而解决大数字问题
    transformResponse: [function (data) {
      try {
        return JSONbig.parse(data)
      }
      catch(e) {
        console.log('转换失败')
        return data
      }
    }]
  })

  return instance(config)
} 

// 带token的用户请求
export const tokenRequest = (config) => {
  const instance = axios.create({
    baseURL: 'http://ttapi.research.itcast.cn',
    timeout: 5000,
    // 拦截axios自动转换手动使用jsonbig进行转换从而解决大数字问题
    transformResponse: [function (data) {
      try {
        return JSONbig.parse(data)
      }
      catch(e) {
        console.log('转换失败')
        return data
      }
    }]
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