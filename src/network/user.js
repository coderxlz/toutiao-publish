import { request,tokenRequest } from './request'

// 获取用户个人资料
export const getProfile = () => {
  return tokenRequest({
    url: '/mp/v1_0/user/profile',
    method: 'GET'
  })
}

// 编辑用户资料
export const editProfile = data => {
  return tokenRequest({
    url: '/mp/v1_0/user/profile',
    method: 'PATCH',
    data
  })
}

// 更新用户头像
export const updateAvatar = data => {
  return tokenRequest({
    url: '/mp/v1_0/user/photo',
    method: 'PATCH',
    data
  })
}