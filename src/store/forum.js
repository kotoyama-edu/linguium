import Vue from 'vue'
import { EventBus } from '../helpers/eventBus'

import Thread from './helpers/thread_helper'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

export default {
  state: {
    threads: []
  },

  mutations: {
    setThreads (state, payload) {
      state.threads = payload
    },

    sendThread (state, payload) {
      state.threads.push(payload)
    },

    editThread (state, payload) {
      Vue.set(state.threads, payload.id, payload)
      EventBus.notify('thread:updated')
    },

    sendReply (state, payload) {
      Vue.set(state.threads, payload.threadId, payload.reply)
      EventBus.notify('thread:updated')
    },

    setThreadResolved (state, payload) {
      Vue.set(state.threads, payload.threadId, payload.thread)
      EventBus.notify('thread:updated')
    }

    // markAsAnswer (state, payload) {
    //   Vue.set(state.threads, payload.threadId, payload.thread)
    //   EventBus.notify('thread:updated')
    // }
  },

  actions: {
    async loadThreads ({ commit }) {
      commit('clearError')
      await Vue.$db.collection('forum').get().then(querySnapshot => {
        let threads = []
        querySnapshot.forEach(element => {
          const data = element.data()
          threads.push(new Thread(
            element.id, data.title, data.description, data.author, data.tags,
            data.date, data.topic, data.replies, data.answered, data.reply
          ))
        })
        commit('setThreads', threads)
      })
        .catch(err => commit('setError', err.message))
    },

    async sendThread ({ commit }, payload) {
      commit('clearError')
      commit('setLoading', true)
      let forum = Vue.$db.collection('forum')
      let thread = {
        title: payload.title,
        description: payload.description,
        author: payload.author,
        tags: payload.tags,
        date: payload.date,
        topic: payload.topic,
        replies: payload.replies,
        answered: payload.answered
      }
      await forum.add(thread)
        .then(() => {
          commit('sendThread', thread)
          commit('setLoading', false)
        })
        .catch(() => {
          commit('setLoading', false)
        })
    },

    editThread ({ commit }, payload) {
      commit('clearError')
      commit('setLoading', true)
      let thread = Vue.$db.collection('forum').doc(payload.id)
      let changes = {
        title: payload.title,
        description: payload.description,
        tags: payload.tags,
        topic: payload.topic
      }
      thread.update(changes)
        .then(() => {
          commit('editThread', changes)
          commit('setLoading', false)
        })
        .catch(err => {
          commit('setLoading', false)
          commit('setError', err.message)
        })
    },

    deleteThread ({ commit }, payload) {
      commit('clearError')
      commit('setLoading', true)
      let thread = Vue.$db.collection('forum').doc(payload.id)
      thread.delete()
    },

    async sendReply ({ commit }, payload) {
      commit('clearError')
      let threads = Vue.$db.collection('forum').doc(payload.thread)
      let reply = {
        id: payload.id,
        body: payload.body,
        author: payload.author,
        date: payload.date,
        solution: payload.solution,
        reply: payload.reply
      }
      await threads.set({
        replies: {
          [payload.id]: reply
        }
      }, { merge: true })
        .then(() => {
          commit('sendReply', { threadId: payload.thread, reply: reply })
          commit('setLoading', false)
        })
        .catch(() => {
          commit('setLoading', false)
        })
    },

    markAsAnswer ({ commit }, payload) {
      let thread = Vue.$db.collection('forum').doc(payload.thread.id)
      let resolved = true
      thread.update({
        answered: true
      })
        .then(() => {
          thread.update({
            [`replies.${payload.reply.id}.solution`]: resolved
          })
          commit('setThreadResolved', { threadId: payload.thread.id, thread: payload.thread })
        })
      commit('setThreadResolved', { threadId: payload.thread.id, thread: payload.thread })
    },

    deleteReply ({ commit }, payload) {
      commit('clearError')
      let thread = Vue.$db.collection('forum').doc(payload.thread)
      thread.update({
        [`replies.${payload.reply.id}`]: firebase.firestore.FieldValue.delete()
      })
        .then(() => EventBus.notify('thread:updated'))
    }
  },

  getters: {
    threads: (state) => state.threads
  }
}
