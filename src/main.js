import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

//引入相关API请求接口
import API from '@/api'
//引入三级联动组件,注册为全局组件
import CategorySelect from '@/components/CategorySelect';
Vue.component(CategorySelect.name,CategorySelect);

//引入HintButton组件,注册为全局组件
import HintButton from '@/components/HintButton';
Vue.component(HintButton.name,HintButton);

//引入分页器组件,注册为全局组件
import Pagination from '@/components/Pagination';
Vue.component(Pagination.name,Pagination);

//组件实例的原型的原型对象指向的是vur.prototype
//任意取件都可以使用API相关的接口
Vue.prototype.$API = API

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
