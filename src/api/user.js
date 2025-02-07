//引入axios (axios进行了二次封装)
import request from '@/utils/request'
//对外暴露登录的接口函数
export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}
//对外暴露获取用信息的函数
export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}
//对外暴露退出的函数
export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
