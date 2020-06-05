import Vue from 'vue'
import { EventBus } from '../helpers/eventBus'

import Article from './helpers/article_helper'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

export default {
  state: {
    articles: []
  },

  mutations: {
    setArticles (state, payload) {
      state.articles = payload
    },

    sendArticle (state, payload) {
      state.articles.push(payload)
    },

    setArticleCover (state, payload) {
      Vue.set(state.articles, payload.articleId, payload.cover)
      EventBus.notify('articlecover:updated')
    },

    editArticle (state, payload) {
      Vue.set(state.articles, payload.id, payload)
      EventBus.notify('article:updated')
    },

    likeArticle (state, payload) {
      Vue.set(state.articles, payload.articleId, payload.article)
      EventBus.notify('article:updated')
    },

    sendComment (state, payload) {
      Vue.set(state.articles, payload.articleId, payload.comment)
      EventBus.notify('article:updated')
    }
  },

  actions: {
    async loadArticles ({ commit }) {
      commit('clearError')
      await Vue.$db.collection('articles').get().then(querySnapshot => {
        let articles = []
        querySnapshot.forEach(element => {
          const data = element.data()
          articles.push(new Article(
            element.id, data.title, data.abstract, data.description, data.author,
            data.cover, data.tags, data.date, data.likes, data.wordsCount, data.comments
          ))
        })
        commit('setArticles', articles)
      })
        .catch(err => commit('setError', err.message))
    },

    async sendArticle ({ commit }, payload) {
      commit('clearError')
      commit('setLoading', true)
      let articles = Vue.$db.collection('articles')
      let article = {
        title: payload.title,
        abstract: payload.abstract,
        description: payload.description,
        author: payload.author,
        tags: payload.tags,
        date: payload.date,
        cover: '',
        likes: 0,
        wordsCount: payload.wordsCount,
        comments: []
      }
      await articles.add(article)
        .then(docRef => {
          if (payload.cover) {
            let storageRef = firebase.storage().ref('articles/' + docRef.id + '/cover' + '/article.jpg')
            storageRef.put(payload.cover)
              .then(() => {
                storageRef.getDownloadURL().then(url => {
                  articles.doc(docRef.id).update({ cover: url })
                    .then(() => {
                      article.cover = url
                      articles.doc(docRef.id).set(article)
                      commit('setArticleCover', { articleId: docRef.id, cover: url })
                      commit('setLoading', false)
                    })
                })
              })
              .catch((error) => {
                commit('setLoading', false)
                commit('setError', error.message)
              })
          }
          commit('sendArticle', article)
          commit('setLoading', false)
        })
        .catch(err => {
          commit('setLoading', false)
          commit('setError', err.message)
        })
    },

    editArticle ({ commit }, payload) {
      commit('clearError')
      commit('setLoading', true)
      let article = Vue.$db.collection('articles').doc(payload.id)
      let changes = {
        title: payload.title,
        abstract: payload.abstract,
        tags: payload.tags,
        description: payload.description,
        wordsCount: payload.wordsCount
      }
      article.update(changes)
        .then(() => {
          if (payload.cover) {
            let storageRef = firebase.storage().ref('articles/' + payload.id + '/cover' + '/article.jpg')
            storageRef.put(payload.cover)
              .then(() => {
                storageRef.getDownloadURL().then(url => {
                  article.update({ cover: url })
                    .then(() => {
                      article.cover = url
                      commit('setArticleCover', { articleId: payload.id, cover: url })
                      commit('setLoading', false)
                    })
                })
              })
              .catch((error) => {
                commit('setLoading', false)
                commit('setError', error.message)
              })
          }
          commit('editArticle', changes)
          commit('setLoading', false)
        })
        .catch(err => {
          commit('setLoading', false)
          commit('setError', err.message)
        })
    },

    deleteArticle ({ commit }, payload) {
      commit('clearError')
      commit('setLoading', true)
      let article = Vue.$db.collection('articles').doc(payload.id)
      if (payload.cover) {
        let storageRef = firebase.storage().ref('articles/' + payload.id + '/cover' + '/article.jpg')
        storageRef.delete()
      }
      article.delete()
    },

    async likeArticle ({ commit }, { article, user }) {
      let dataRef = Vue.$db.collection('articles').doc(article.id)
      await dataRef.set({
        likes: {
          [user.id]: article.id
        }
      }, { merge: true })
        .then(() => {
          commit('likeArticle', { articleId: article.id, article: article })
          commit('setLoading', false)
        })
        .catch(() => {
          commit('setLoading', false)
        })
    },

    unlikeArticle ({ commit }, { article, user }) {
      commit('clearError')
      let dataRef = Vue.$db.collection('articles').doc(article.id)
      dataRef.update({
        [`likes.${user.id}`]: firebase.firestore.FieldValue.delete()
      })
        .then(() => EventBus.notify('article:updated'))
    },

    async sendComment ({ commit }, payload) {
      commit('clearError')
      let articles = Vue.$db.collection('articles').doc(payload.article)
      let comment = {
        id: payload.id,
        body: payload.body,
        author: payload.author,
        date: payload.date
      }
      await articles.set({
        comments: {
          [payload.id]: comment
        }
      }, { merge: true })
        .then(() => {
          commit('sendComment', { articleId: payload.article, comment: comment })
          commit('setLoading', false)
        })
        .catch(() => {
          commit('setLoading', false)
        })
    },

    deleteComment ({ commit }, payload) {
      commit('clearError')
      let dataRef = Vue.$db.collection('articles').doc(payload.article)
      dataRef.update({
        [`comments.${payload.comment.id}`]: firebase.firestore.FieldValue.delete()
      })
        .then(() => EventBus.notify('article:updated'))
    }
  },

  getters: {
    articles: (state) => state.articles
  }
}
