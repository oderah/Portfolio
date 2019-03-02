// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'babel-polyfill'
import App from './App'
import router from './router'
import { sync } from 'vuex-router-sync'
import store from '@/store/store'
import Toasted from 'vue-toasted'

var VueCookie = require('vue-cookie')
// var Toasted = require('vue-toasted')

Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(VueCookie)
Vue.use(Toasted)

Vue.directive('lazy', {
  inserted (el, binding, vnode) {
    function loadImage () {
      const imageElement = Array.from(el.children).find(
        el => el.nodeName === 'IMG'
      )
      if (imageElement) {
        imageElement.addEventListener('load', () => {
          setTimeout(() => el.classList.add('loaded'), 100)
        })
        imageElement.addEventListener('error', () => console.log('error'))
        imageElement.src = imageElement.dataset.url
      }
    }

    function handleIntersect (entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage()
          observer.unobserve(el)
        }
      })
    }

    function createObserver () {
      const options = {
        root: null,
        threshold: '0'
      }
      const observer = new IntersectionObserver(handleIntersect, options)
      observer.observe(el)
    }

    if (window['IntersectionObserver']) {
      createObserver()
    } else {
      loadImage()
    }
  }
})

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
