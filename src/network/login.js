import { request } from './request'

// 登录认证
export const login = (data) => {
  return request({
    url: '/mp/v1_0/authorizations',
    method: 'POST',
    data
  })
}