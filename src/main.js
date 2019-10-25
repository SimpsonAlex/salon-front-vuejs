import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import router from "./router/router";
import store from "@vue/cli-service/generator/vuex/template/src/store";


Vue.use(BootstrapVue)

Vue.config.productionTip = false

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
