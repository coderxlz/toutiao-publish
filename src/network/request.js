import axios from "axios"

import store from '@/store/index.js'
import router from '@/router/index.js'

import JSONbig from 'json-bigint'

import { Message } from 'element-ui';

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

  instance.interceptors.response.use(res => {
    // 所有响应成功的状态都会进入这里
    return res
  },err => {
    if( err.response && err.response.status ) {
      let msg = null
      switch(err.response.status) {
        case 400:
          msg = '参数错误';break
        case 401:
          msg = '用户认证失败，请重新登录'
          // 清除token
          store.commit('clearToken')
          // 跳转到登录页
          router.replace('/login');break
        case 404:
          msg = '手机号码不正确';break
        case 507:
          msg = '服务器异常';break
      }
      Message({
        message: msg,
        type: 'warning'
      })
    }
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
        console.log('转换失败',data)
        return data
      }
    }]
  })


  // 请求拦截器拦截request请求，并加入token请求头
  instance.interceptors.request.use(config => {
    if(store.state.token){
    config.headers.Authorization = `Bearer ${store.state.token}`
    }
    return config
  })

  // 响应拦截器，拦截响应，处理401状态码
  // 该拦截器会拦截所有通过该axios对象发出的响应，两个回调函数分别对应着响应成功结果res与响应失败错误对象err
  instance.interceptors.response.use(res => {
    // 所有响应成功的状态都会进入这里
    return res
  },err => {
    if( err.response && err.response.status ) {
      let msg = null
      switch(err.response.status) {
        case 400:
          msg = '参数错误';break
        case 401:
          msg = '用户认证失败，请重新登录'
          // 清除token
          store.commit('clearToken')
          // 跳转到登录页
          router.replace('/login');break
        case 404:
          msg = '手机号码不正确';break
        case 507:
          msg = '服务器异常';break
      }
      Message({
        message: msg,
        type: 'warning'
      })
    }
  })

  return instance(config)
}