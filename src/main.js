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
import Active from "@/components/Create";
import Foo from "@/components/Foo";
import Bar from "@/components/Bar";


var router = new VueRouter({
  routes:[
    {path: '/create', component: Active},
    {path: '/foo', component: Foo},
    {path: '/clients_list', component: Bar },
    {path: '/client/:id', component:ClientDetail},

  ]
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
