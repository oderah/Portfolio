import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import Login from '@/components/Login'
import About from '@/components/about/About'
import Contact from '@/components/Contact'
import Porfolio from '@/components/portfolio/Porfolio'
import Project from '@/components/portfolio/Project'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing
    },
    {
      path: '/admin/login',
      name: 'login',
      component: Login
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: Porfolio
    },
    {
      path: '/portfolio/:id',
      name: 'project',
      component: Project
    }
  ]
})
