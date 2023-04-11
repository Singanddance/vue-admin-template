//SKU相关的接口
import request from '@/utils/request'

//sku列表的接口
// /admin/product/list/{page}/{limit} get
export const reqSkuList = (page,limit) =>
    request({
        url:`/admin/product/list/${page}/${limit}`,
        method:'get'
    })

//上架商品
// /admin/product/onSale/{skuId} get
export const reqSale = (skuId) =>
    request({
        url:`/admin/product/onSale/${skuId}`,
        method:'get'
    })

//下架商品
// /admin/product/cancelSale/{skuId} get
export const reqcancel = (skuId) =>
    request({
        url:`/admin/product/cancelSale/${skuId}`,
        method:'get'
    })

//查看SKU详情的接口
// /admin/product/getSkuById/{skuId} get
export const reqSkuById = (skuId) =>
    request({
        url:`/admin/product/getSkuById/${skuId}`,
        method:'get'
    })
