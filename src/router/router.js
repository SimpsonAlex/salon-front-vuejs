import Vue from 'vue'
import VueRouter from "vue-router";

Vue.use(VueRouter)


Vue.config.productionTip = false


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import ClientDetail from "@/components/ClientDetail";
import Image from "@/components/Image";
import Calendar from "@/components/Calendar";
import Client_list from "@/components/Client_list";
import Auth from "@/components/Auth";




var router = new VueRouter({
  routes:[
    {path: '/', redirect: '/auth'},
    {path: '/auth', component: Auth},
    {path: '/image', component: Image},
    {path: '/calendar', component: Calendar},
    {path: '/clients_list', component: Client_list },
    {path: '/client/:id', component:ClientDetail},
    {path: '*', redirect: '/clients_list'}
  ],
  mode: 'history'
});

export default router