import Vue from 'vue'
import User from './helpers/user_helper'

export default {
  state: {
    users: []
  },

  mutations: {
    setUsers (state, payload) {
      state.users = payload
    }
  },

  actions: {
    async loadUsers ({ commit }) {
      commit('clearError')
      Vue.$db.collection('users').get().then(querySnapshot => {
        let users = []
        querySnapshot.forEach(element => {
          const data = element.data()
          users.push(new User(element.id, data.email, data.name, data.avatar))
        })
        commit('setUsers', users)
      })
        .catch(err => commit('setError', err.message))
    }
  },

  getters: {
    users: (state) => state.users
  }
}
