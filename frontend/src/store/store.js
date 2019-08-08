import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    admin: null,
    tags: {
      'graphic-design': 'bubble_chart',
      'mobile-app': 'smartphone',
      'website': 'desktop_mac',
      'web-app': 'laptop_mac',
      'software': 'android'
    },
    successToast: {
      duration: 3000,
      position: 'bottom-right',
      closeOnSwipe: true,
      theme: 'bubble',
      className: 'cyan darken-4',
      icon: {
        name: 'check_circle'
      }
    },
    errorToast: {
      duration: 3000,
      position: 'bottom-right',
      closeOnSwipe: true,
      theme: 'bubble',
      className: 'red',
      icon: {
        name: 'error'
      }
    },
    toast: {
      duration: 3000,
      position: 'bottom-right',
      closeOnSwipe: true,
      theme: 'bubble',
      className: 'pink darken-4',
      icon: {
        name: 'autorenew'
      }
    }
  },
  mutations: {
    setAdmin (state, admin) {
      state.admin = admin
    }
  },
  actions: {
    setAdmin ({commit}, admin) {
      commit('setAdmin', admin)
    }
  }
})
