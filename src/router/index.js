/*
 * @Author: your name
 * @Date: 2020-07-26 13:39:46
 * @LastEditTime: 2020-07-28 16:26:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\router\index.js
 */ 
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component:  require('@/pages/Index').default
    },
    {
        path: '/setting.html',
        name: 'Setting',
        component:  require('@/pages/Setting').default
    },
    {
        path: '/plugins.html',
        name: 'Plugins',
        component:  require('@/pages/Plugins').default
    },
    {
        path: '/myplugin.html',
        name: 'MyPlugin',
        component:  require('@/pages/MyPlugin').default
    }
  ]
})
