// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'

import store from './store/index'

import formattedDate from './helpers/formattedDate'
import { setUpBus } from './helpers/eventBus'

import Default from '@/components/layouts/Default'
import ReadMode from '@/components/layouts/ReadMode'
import TrainerMode from '@/components/layouts/TrainerMode'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css'

import Vuelidate from 'vuelidate'

import firebaseConfig from './config/firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

Vue.component('default', Default)
Vue.component('read-mode', ReadMode)
Vue.component('trainer-mode', TrainerMode)

Vue.use(Vuelidate)
Vue.use(VueMaterial)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

Vue.filter('formattedDate', formattedDate)

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()

Vue.$db = db

setUpBus()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created: function onApplicationCreated () {
    this.$store.dispatch('loadBooks')
    this.$store.dispatch('loadArticles')
    this.$store.dispatch('loadUsers')
  }
})

Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})
