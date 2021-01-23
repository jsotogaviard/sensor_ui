import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Datum from './components/Datum.vue';

Vue.config.productionTip = false

const router = new VueRouter({
  routes: [
    { path: '/', component: Datum }
  ]
})

Vue.use(VueRouter)

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')

