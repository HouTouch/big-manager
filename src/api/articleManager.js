import request from '@/utils/request'

// 获取文章列表
export const artGetListService = (params) => {
  return request.get('/my/article/list', { params })
}
//发布文章
export const addArticleService = (data) => {
  return request.post('/my/article/add', data)
}

//获取文章详情

export const artGetDetailService = (id) =>
  request.get('/my/article/info', {
    params: {
      id
    }
  })

//编辑文章
export const artEditService = (data) => request.put('my/article/info', data)

//删除文章
export const artDeleteService = (id) =>
  request.delete('/my/article/info', { params: { id } })
