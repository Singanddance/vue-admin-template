import resquest from '@/utils/request'
//这个模块主要获取的是品牌管理的数据模块
//获取品牌列表的接口
// /admin/product/baseTrademark/{page}/{limit} 当前第几页,每一页展示数据的条数
export const reqTradeMark = (page, limit) =>
    resquest({
        url: `/admin/product/baseTrademark/${page}/${limit}`,
        method: 'get'
    })
//处理品牌
//新增品牌 /admin/product/baseTrademark/save  post 参数为 品牌名称,品牌logo
//！！！注意 新增品牌不需要携带品牌的ID
//修改品牌的操作 /admin/product/baseTrademark/update  put 参数为 品牌ID,品牌名称,品牌logo
//！！！注意 修改品牌要携带品牌的ID
//将新增和修改封装为一个请求
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    //带给服务器数据携带ID,代表是修改
    if (tradeMark.id) {
        //修改
       return resquest({
            url: `/admin/product/baseTrademark/update`,
            method: 'put',
            data:tradeMark
        })
    } else {
        //新增
        return resquest({
            url: `/admin/product/baseTrademark/save`,
            method: 'post',
            data:tradeMark
        })
    }
}
//删除品牌
// /admin/product/baseTrademark/remove/{id} delete 需要携带ID
export const reqDeleteTradeMark = (id) =>
    resquest({
        url: `/admin/product/baseTrademark/remove/${id}`,
        method: 'delete',
    })


