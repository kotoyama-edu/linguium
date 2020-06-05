import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

import User from './helpers/user_helper'
import { EventBus } from '../helpers/eventBus'

export default {
  state: {
    user: null,
    unsubscribeAuth: null
  },

  mutations: {
    setUser (state, payload) {
      state.user = payload
    },

    setUserName (state, payload) {
      Vue.set(state.user, 'name', payload)
    },

    setUserEmail (state, payload) {
      Vue.set(state.user, 'email', payload)
    },

    setUserAvatar (state, payload) {
      Vue.set(state.user, 'avatar', payload)
    },

    setUnsubscribeAuth (state, payload) {
      state.unsubscribeAuth = payload
    }
  },

  actions: {
    initAuth ({ commit, dispatch, state }) {
      return new Promise((resolve) => {
        if (state.unsubscribeAuth) {
          state.unsubscribeAuth()
        }
        let unsubscribe = firebase.auth().onAuthStateChanged((user) => {
          dispatch('getLoggedUser', user)
          resolve(user)
        })
        commit('setUnsubscribeAuth', unsubscribe)
      })
    },

    async signUp ({ commit }, { name, email, password }) {
      commit('clearError')
      commit('setLoading', true)
      const user = await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
          let userId = firebase.auth().currentUser.uid
          let dataRef = Vue.$db.collection('users').doc(userId)
          let storageRef = firebase.storage().ref('users/' + '/cute.png')
          storageRef.getDownloadURL().then(url => {
            dataRef.set({ name: name, email: email, avatar: url })
            firebase.auth().currentUser.updateProfile({ photoURL: url })
              .then(() => commit('setUserAvatar', url))
          })
          firebase.auth().currentUser.updateProfile({
            displayName: name
          })
            .then(() => commit('setUserName', name))
          commit('setUser', new User(
            user.user.uid,
            user.user.email,
            user.user.displayName)
          )
          commit('setLoading', false)
        })
        .catch((error) => {
          commit('setLoading', false)
          commit('setError', error.message)
        })
    },

    async login ({ commit }, { email, password }) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const user = await firebase.auth().signInWithEmailAndPassword(email, password)
        commit('setUser', new User(user.user.uid, user.user.email))
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },

    logout () {
      firebase.auth().signOut()
    },

    getLoggedUser ({ commit, dispatch }, payload) {
      if (payload) {
        commit('setUser', new User(payload.uid, payload.email))
        commit('setUserName', payload.displayName)
        commit('setUserAvatar', payload.photoURL)
        dispatch('getUserData', payload.uid)
      } else {
        commit('setUser', null)
      }
    },

    async changeUserInfo ({ commit, getters }, payload) {
      let dataRef = Vue.$db.collection('users').doc(getters.userId)
      let credentials = firebase.auth.EmailAuthProvider.credential(payload.email, payload.password)
      commit('clearError')
      commit('setLoading', true)

      await firebase.auth().currentUser.reauthenticateWithCredential(credentials)
        .then(() => {
          let currentUser = firebase.auth().currentUser
          if (payload.changeType === 'name') {
            dataRef.update({ name: payload.newName })
            currentUser.updateProfile({ displayName: payload.newName })
              .then(() => {
                commit('setUserName', payload.newName)
                commit('setLoading', false)
              })
              .catch((error) => {
                commit('setLoading', false)
                commit('setError', error.message)
              })
          }
          if (payload.changeType === 'email') {
            dataRef.update({ email: payload.newEmail })
            currentUser.updateEmail(payload.newEmail)
              .then(() => {
                commit('setUserEmail', payload.newEmail)
                commit('setLoading', false)
              })
              .catch((error) => {
                commit('setLoading', false)
                commit('setError', error.message)
              })
          }
          if (payload.changeType === 'password') {
            currentUser.updatePassword(payload.newPassword)
              .then(() => {
                commit('setLoading', false)
              })
              .catch((error) => {
                commit('setLoading', false)
                commit('setError', error.message)
              })
          }
        })
        .catch((error) => {
          commit('setLoading', false)
          commit('setError', error.message)
        })
      EventBus.notify('userprofile:changed')
    },

    async updateProfilePic ({ commit, getters }, payload) {
      commit('clearError')
      commit('setLoading', true)
      let dataRef = Vue.$db.collection('users').doc(getters.userId)
      let storageRef = firebase.storage().ref('users/' + getters.userId + '/avatars' + '/profile.jpg')
      await storageRef.put(payload)
        .then(() => {
          storageRef.getDownloadURL().then(url => {
            dataRef.update({ avatar: url })
            firebase.auth().currentUser.updateProfile({ photoURL: url })
              .then(() => {
                commit('setUserAvatar', url)
                commit('setLoading', false)
                EventBus.notify('userprofile:changed')
              })
          })
        })
        .catch((error) => {
          commit('setLoading', false)
          commit('setError', error.message)
        })
    }
  },

  getters: {
    user: (state) => state.user,
    checkUser: (state) => state.user != null,
    userName: (state) => state.user.name,
    userEmail: (state) => state.user.email,
    userAvatar: (state) => state.user.avatar,
    userId: () => firebase.auth().currentUser.uid,
    registrationDate: () => firebase.auth().currentUser.metadata.creationTime
  }
}
