import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Authenticated: false,
    role: '',
  },
  mutations: {
    setAuthenticated(state, status) {
      state.Authenticated = status;
    },
    setRole(state, role) {
      state.role = role;
    }
  },
  actions: {

  }
})