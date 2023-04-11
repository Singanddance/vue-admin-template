//平台属性管理的请求文件
import resquest from '@/utils/request'

//三级分类的接口
//获取一级分类数据的接口 /admin/product/getCategory1
export const reqCategory1List = () =>
    resquest({
        url:`/admin/product/getCategory1`,
        method: 'get'
    })
//获取二级分类数据的借口 /admin/product/getCategory2/${category1Id}
export const reqCategory2List = (category1Id) =>
    resquest({
        url:`/admin/product/getCategory2/${category1Id}`,
        method: 'get'
    })
//获取三级分类数据的借口 /admin/product/getCategory3/${category2Id}
export const reqCategory3List = (category2Id) =>
    resquest({
        url:`/admin/product/getCategory3/${category2Id}`,
        method: 'get'
    })

/* ------------------------ */
//获取平台属性的接口 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrList = (category1Id,category2Id,category3Id) =>
    resquest({
        url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method: 'get'
    })
//添加|修改属性与属性值的接口 /admin/product/saveAttrInfo post
export const reqAddOrUpdateAttr = (data) =>
    resquest({
        url:`/admin/product/saveAttrInfo`,
        method: 'post',
        data
    })
   /*  {
        "attrName": "string", //属性名
        "attrValueList": [  //属性值,因为属性值可以是多个,因此是数组
          {
            "attrId": 0, //属性的id
            "valueName": "string" //相应的属性值
          }
        ],
        "categoryId": 0,  //category3Id
        "categoryLevel": 3,  
      } */

//删除属性的接口 /admin/product/deleteAttr/{attrId} delete
export const reqDeleteAttr = (attrId) =>
    resquest({
        url:`/admin/product/deleteAttr/${attrId}`,
        method: 'delete',
    })
