import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Gallery from './components/Gallery.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner, faFolder } from '@fortawesome/free-solid-svg-icons'

library.add(faSpinner, faFolder)
library.add(faUserSecret)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

const router = new VueRouter({
  routes: [
    { path: '/*', component: Gallery }
  ]
})

Vue.use(VueRouter)

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')

