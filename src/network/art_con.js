import { request, tokenRequest } from './request'

// 获取表格数据信息
export const getArtData = (params) => {
  return tokenRequest({
    url: '/mp/v1_0/articles',
    method: 'GET',
    params
  })
}

// 获取频道数据
export const getChannels = () => {
  return request({
    url: '/mp/v1_0/channels',
    method: 'GET'
  })
}

// 删除文章
export const deleteArt = (target) => {
  return tokenRequest({
    url: `/mp/v1_0/articles/${target}`,
    method: 'DELETE'
  })
}