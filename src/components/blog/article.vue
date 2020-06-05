<template>
  <div class="container" v-if="article">
    <header class="article-header">
      <div class="article-title">
        <h1>{{ article.title }}</h1>
      </div>
      <section class="author-info">
        <div class="article-user" v-if="author">
          <div class="article-author-avatar">
            <img :src="author.avatar" v-if="author.avatar" alt="avatar"/>
          </div>
          <div class="article-author-info">
            <div class="md-title" v-if="author.name">
              <span>{{ author.name }}</span>
              <div class="article-button-follow" v-if="!userIsCreator">
                <md-button class="md-dense md-primary" v-if="canFollowUser()" @click="followUser()">
                  Follow
                </md-button>
                <md-button class="md-dense md-primary folliwing" v-else @click="unfollowUser()">
                  Following
                </md-button>
              </div>
            </div>
            <div class="md-subhead">{{ article.date | formattedDate }}</div>
          </div>
        </div>
        <div class="article-actions">
          <md-button class="md-icon-button" v-if="userIsCreator" @click="getEditingPage(article)">
            <md-icon>edit</md-icon>
          </md-button>
          <md-button class="md-icon-button" v-if="userIsCreator" @click="deleteArticle()">
            <md-icon class="delete">delete</md-icon>
          </md-button>
        </div>
      </section>
    </header>
    <div class="main-content">
      <p class="article-content" v-html="article.description"> {{ article.description }}</p>
    </div>
    <section class="article-footer">
      <div class="footer-top">
        <div class="article-likes">
          <md-button class="md-icon-button" v-if="canLikeArticle()" @click="likeArticle()">
            <md-icon>favorite</md-icon>
          </md-button>
          <md-button class="md-icon-button" v-else @click="unlikeArticle()">
            <md-icon class="liked">favorite</md-icon>
          </md-button>
          <div class="likes-count">
            <span>{{ Object.keys(article.likes).length }}</span>
          </div>
        </div>
        <div class="article-tags">
          <md-chip class="chip" v-for="tag in article.tags" :key="tag">{{ tag }}</md-chip>
        </div>
      </div>
      <section class="article-comments">
        <div class="send-comment">
          <md-field>
            <label>Write a comment...</label>
            <md-textarea v-model="comment" @keyup.enter.native="sendComment()"></md-textarea>
          </md-field>
        </div>
        <div class="comments-list">
          <span class="md-headline" v-if="Object.keys(article.comments).length">Comments ({{ Object.keys(article.comments).length }})</span>
          <span class="md-headline" v-else>No comments. Be the first!</span>
          <transition-group name="fade-up" tag="div" class="comments">
            <div class="comment" v-for="(comment, i) in article.comments" :key="`${i}-${comment.article}`">
              <div class="comment-user-avatar">
                <img :src="getCommentAuthor(comment.author).avatar" v-if="getCommentAuthor(comment.author).avatar" alt="avatar"/>
              </div>
              <div class="comment-container">
                <div class="comment-main">
                  <div class="comment-actions">
                    <md-button class="md-icon-button" v-if="canDeleteComment(comment)" @click="deleteComment(comment)">
                      <md-icon>close</md-icon>
                    </md-button>
                  </div>
                  <div class="md-body-2 author">{{ getCommentAuthor(comment.author).name }}</div>
                  <div class="md-body-2">{{ comment.body }}</div>
                </div>
                <div class="comment-date">
                  <span class="md-caption">{{ comment.date | formattedDate }}</span>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    'id': {
      type: String,
      required: true
    }
  },

  data () {
    return {
      comment: ''
    }
  },

  methods: {
    getEditingPage (article) {
      this.$router.push({ name: 'articleedit', params: { id: article.id } })
    },

    deleteArticle () {
      if (confirm('Are you sure?')) {
        this.$store.dispatch('deleteArticle', this.article)
          .then(() => {
            this.$router.push({ name: 'articlelist' })
          })
      }
    },

    sendComment () {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let id = ''
      for (let i = 0; i < 20; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      let comment = {
        id: id,
        body: this.comment.trim(),
        date: new Date(),
        article: this.id,
        author: this.user.id
      }
      if (this.comment.replace(/\s/g, '').length) {
        this.$store.dispatch('sendComment', comment)
        this.comment = ''
      }
    },

    deleteComment (comment) {
      if (confirm('Are you sure?')) {
        this.$store.dispatch('deleteComment', {
          comment: comment,
          article: this.id
        })
      }
    },

    getCommentAuthor (id) {
      return this.$store.getters.users.find(user => user.id === id)
    },

    getUserDataFollowing () {
      return this.userdata.following[this.author.id]
    },

    canLikeArticle () {
      let userLike = Object.keys(this.article.likes).includes(this.user.id)
      return this.checkUser && !this.loading && !userLike
    },

    canFollowUser () {
      let followingUser = this.getUserDataFollowing()
      return this.checkUser && !this.loading && !followingUser && !this.userIsCreator
    },

    canDeleteComment (comment) {
      return this.checkUser && !this.loading && comment.author === this.user.id
    },

    followUser () {
      this.$store.dispatch('followUser', this.author)
    },

    unfollowUser () {
      this.$store.dispatch('unfollowUser', this.author)
    },

    likeArticle () {
      this.$store.dispatch('likeArticle', { article: this.article, user: this.user })
    },

    unlikeArticle () {
      this.$store.dispatch('unlikeArticle', { article: this.article, user: this.user })
    }
  },

  computed: {
    ...mapGetters(['checkUser', 'loading', 'userdata', 'user']),

    article () {
      return this.$store.getters.articles.find(article => article.id === this.id)
    },

    author () {
      return this.$store.getters.users.find(user => user.id === this.article.author)
    },

    userIsCreator () {
      return this.checkUser ? this.$store.getters.user.id === this.article.author : false
    },

    isUserFollowing () {
      let followingUser = this.getUserDataFollowing()
      return this.checkUser && !this.loading && !!followingUser
    },

    isArticleLiked () {
      return Object.keys(this.article.likes).includes(this.user.id)
    }
  },

  mounted () {
    this.$store.dispatch('loadArticles')
    this.$store.dispatch('loadUsers')
  },

  created () {
    this.$bus.$on('article:updated', () => {
      this.$store.dispatch('loadArticles')
    })
    this.$bus.$on('userprofile:changed', () => {
      this.$store.dispatch('loadUsers')
    })
    this.$bus.$once('userfollowing:updated', () => {
      this.$store.dispatch('getUserData', this.user.id)
    })
  },

  beforeDestroy () {
    this.$bus.$off('article:updated')
    this.$bus.$off('userprofile:updated')
    this.$bus.$off('userfollowing:updated')
    this.$bus.$off('userdata:loaded')
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/article.less';
</style>
