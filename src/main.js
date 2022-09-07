import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugin/vuetify'
import router from './router'
import Vuex from 'vuex'
// import store from './store.js'
import axios from 'axios'
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'

Vue.use(Chartkick.use(Chart))

Vue.config.productionTip = false

Vue.prototype.$http = axios;
Vue.prototype.$api = 'http://127.0.0.1:8000/api';

Vue.use(Vuex);
const store = new Vuex.Store({
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
  }
})


new Vue({
  vuetify,
  router,
  store: store,
  render: h => h(App),
}).$mount('#app')