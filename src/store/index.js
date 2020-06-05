import Vue from 'vue'
import Vuex from 'vuex'

import common from './common'
import user from './user'
import users from './users'
import book from './books'
import userdata from './userdata'
import article from './articles'
import threads from './forum'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    user: user,
    users: users,
    userdata: userdata,
    book: book,
    article: article,
    threads: threads
  },
  state: {
    layout: 'default'
  },
  mutations: {
    setLayout (state, payload) {
      state.layout = payload
    }
  },
  getters: {
    layout (state) {
      return state.layout
    }
  }
})
