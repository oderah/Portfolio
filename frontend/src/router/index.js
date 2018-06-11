import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: Landing
    },
    {
      path: '/admin/login',
      name: 'login',
      component: Login
    }
  ]
})
