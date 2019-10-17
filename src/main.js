import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from "vue-router";

Vue.use(VueRouter)

Vue.use(BootstrapVue)

Vue.config.productionTip = false

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import ClientDetail from "@/components/ClientDetail";
import Image from "@/components/Image";
import Calendar from "@/components/Calendar";
import Client_list from "@/components/Client_list";



var router = new VueRouter({
  routes:[
    {path: '/image', component: Image},
    {path: '/calendar', component: Calendar},
    {path: '/clients_list', component: Client_list },
    {path: '/client/:id', component:ClientDetail},
    {path: '*', redirect: '/clients_list'}
  ],
  mode: 'history'
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
