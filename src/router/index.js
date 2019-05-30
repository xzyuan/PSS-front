import Vue from 'vue'
import Router from 'vue-router'
import access from '@/components/access'
import user from '@/components/user'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/access',
      name: 'PSS Swipe Info',
      component: access
    },
    {
      path: '/user',
      name: 'PSS User Manage',
      component: user,
      meta: {
        isLocal: true
      }
    },
    {
      path: '/',
      name: 'PSS',
      component: access
    }
  ]
})
