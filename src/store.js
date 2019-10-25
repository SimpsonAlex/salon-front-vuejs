import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

// const BACKEND_PATH = 'https://backend-djangorfw.herokuapp.com/';
const BACKEND_PATH = 'http://127.0.0.1:8000/';
export default BACKEND_PATH;

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    headerFile: {},
    headerSimple: {},

  },
})

