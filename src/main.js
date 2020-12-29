import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Gallery from './components/Gallery.vue'; 

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

export default s3 = {
  region: 'us-east-2', 
  accessKeyId: 'AKIAJ5RYPTXB5YX3CZAA', 
  secretAccessKey: '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', 
  bucket: 'sotochassaignetest'
}