import Vuex from 'vuex'
import Vue from 'vue'
import scorerecords from './modules/scorerecords.js'

// Load Vuex
Vue.use(Vuex)

// Create Store
export default new Vuex.Store({
  modules: {
    scorerecords
  }
})