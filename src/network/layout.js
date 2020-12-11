import { request,tokenRequest } from './request'

// 获取用户个人资料
export const getUserInfo = () => {
  return tokenRequest({
    url: '/mp/v1_0/user/profile',
    method: 'GET'
  })
}