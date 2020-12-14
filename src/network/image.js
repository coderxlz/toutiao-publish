import { request,tokenRequest,tokenrequest } from './request'

// 获取图片素材
export const getImages = params => {
  return tokenRequest({
    url: '/mp/v1_0/user/images',
    method: 'GET',
    params
  })
}

// 上传素材
export const uploadImage = data => {
  return tokenRequest({
    url: '/mp/v1_0/user/images',
    method: 'POST',
    data
  })
}