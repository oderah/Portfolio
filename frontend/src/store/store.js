import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    admin: null
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
