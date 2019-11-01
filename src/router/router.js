import Vue from 'vue'
import Router from 'vue-router'
import ClientDetail from "@/components/ClientDetail";
import Image from "@/components/Image";
import Calendar from "@/components/Calendar";
import Client_list from "@/components/Client_list";
import Header from "@/components/Header";
import Auth from "@/components/Auth";
import TotalCash from "@/components/TotalCash";


Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: {
                name: "login"
            }
        },
        {
            path: "/login",
            name: "login",
            component: Auth,
        },
        {
            path: "/home", name: 'home', component: Header,
            children: [
                {path: '/image', component: Image},
                {path: '/calendar', component: Calendar},
                {path: '/clients_list', component: Client_list},
                {path: '/calculations', component: TotalCash},
                {path: '/client/:id', component: ClientDetail},
                {path: '*', redirect: {name: 'home'}}
            ],
            mode: 'history'
        },
    ],
    mode: 'history'
})