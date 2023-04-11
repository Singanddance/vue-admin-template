import request from '@/utils/request'

//获取SPU列表数据的接口
// /admin/product/{page}/{limit} get   page limit category3Id
export const reqSpuList = (page, limit, category3Id) =>
    request({
        url: `/admin/product/${page}/${limit}`,
        method: 'get',
        params: { category3Id }
    })

//获取SPU信息
// /admin/product/getSpuById/{spuId} get
export const reqSpu = (spuId) =>
    request({
        url: `/admin/product/getSpuById/${spuId}`,
        method: 'get'
    })

//获取品牌的信息
// /admin/product/baseTrademark/getTrademarkList get
export const reqTrademarkList = () =>
    request({
        url: `/admin/product/baseTrademark/getTrademarkList`,
        method: 'get'
    })

//获取spu图片的接口
// /admin/product/spuImageList/{spuId} get
export const reqSpuImageList = (spuId) =>
    request({
        url: `/admin/product/spuImageList/${spuId}`,
        method: 'get'
    })

//获取平台全部销售属性---整个平台销售属性最多有3个
// /admin/product/baseSaleAttrList get
export const reqBaseSaleAttrList = () =>
    request({
        url: `/admin/product/baseSaleAttrList`,
        method: 'get'
    })

// 修改SPU|添加SPU,对于修改或者是添加,带给服务器的参数大致是一样的,区别是是否携带id
export const reqAddOrUpdateSpu = (spuInfo) => {
    if (spuInfo.id) {
        //携带的参数带有id则是修改Spu /admin/product/updateSpuInfo post
        return request({
            url: `/admin/product/updateSpuInfo`,
            method: 'post',
            data: spuInfo
        })
    } else {
        //携带的参数带不带id则是添加Spu /admin/product/saveSpuInfo post
        return request({
            url: `/admin/product/saveSpuInfo`,
            method: 'post',
            data: spuInfo
        })
    }
}

// 删除SPU的接口
///admin/product/deleteSpu/{spuId} delete
export const reqDeleteSpu = (spuId) =>
    request({
        url: `/admin/product/deleteSpu/${spuId}`,
        method: 'delete'
    })

//获取销售属性的数据接口
// /admin/product/spuSaleAttrList/{spuId} get
export const reqSpuSaleAttrList = (spuId) =>
    request({
        url: `/admin/product/spuSaleAttrList/${spuId}`,
        method: 'get'
    })

//获取平台属性的数据
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get
export const reqAttrList = (category1Id, category2Id, category3Id) =>
    request({
        url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method: 'get'
    })

//添加SKU
// /admin/product/saveSkuInfo post
export const reqAddSku = (skuInfo) =>
    request({
        url: `/admin/product/saveSkuInfo`,
        method: 'post',
        data: skuInfo
    })

//获取SKU列表数据的请求接口
// /admin/product/findBySpuId/{spuId} get
export const reqSkuList = (spuId) =>
    request({
        url: `/admin/product/findBySpuId/${spuId}`,
        method: 'get',
    })