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
