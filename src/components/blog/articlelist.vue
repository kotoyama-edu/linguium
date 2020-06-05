<template>
<div class="container">
  <div class="articles-wrapper">
    <div class="article-list column">
      <div v-if="filteredArticles.length">
        <article class="article-item" v-for="article in filteredArticles" :key="article.id" @click="getDetails(article)">
          <div class="article-content">
            <div class="article-cover" v-if="article.cover">
              <img :src="article.cover" loading="lazy" alt="cover"/>
            </div>
            <div class="article-readtime">
              <span>{{ calculateReadTime(article.wordsCount) }} min read</span>
            </div>
            <div class="article-main">
              <header><h2>{{ article.title }}</h2></header>
              <p>{{ article.abstract }}</p>
            </div>
            <footer>
              <div class="article-stats">
                <div class="likes">
                  <md-icon>favorite</md-icon>
                  <span>{{ Object.keys(article.likes).length }}</span>
                </div>
                <div class="comments">
                  <md-icon>chat_bubble</md-icon>
                  <span>{{ Object.keys(article.comments).length }}</span>
                </div>
              </div>
              <div class="additional-info">
                <span>{{ getArticleAuthor(article.author) }}</span>
                <span class="article-date"><b>·</b> {{ article.date | formattedDate }}</span>
              </div>
            </footer>
          </div>
        </article>
      </div>
      <div class="empty" v-else>
        <md-icon class="md-size-5x">find_in_page</md-icon>
        <h1>No articles yet...</h1>
        <p v-if="type === 'my'">Здесь будут отображаться все статьи, написанные вами.</p>
        <p v-if="type === 'following'">Здесь будут отображаться все статьи людей, на которых вы подписались.</p>
        <p v-if="type === 'favorites'">Здесь будут отображаться все понравившиеся вам статьи.</p>
      </div>
    </div>
    <div class="list-actions column">
      <md-list class="articles-filters">
        <md-list-item @click="toggle('all')">
          <md-icon>dashboard</md-icon>
          <span class="md-list-item-text">All articles</span>
        </md-list-item>

        <md-list-item @click="toggle('my')">
          <md-icon>description</md-icon>
          <span class="md-list-item-text">My articles</span>
        </md-list-item>

        <md-list-item @click="toggle('following')">
          <md-icon>how_to_reg</md-icon>
          <span class="md-list-item-text">Following</span>
        </md-list-item>

        <md-list-item @click="toggle('favorites')">
          <md-icon>favorite</md-icon>
          <span class="md-list-item-text">Favorites</span>
        </md-list-item>
      </md-list>
      <md-button class="md-raised md-primary" @click="createArticle()">Create article</md-button>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      type: 'all'
    }
  },

  methods: {
    createArticle () {
      this.$router.push({ name: 'articlecreate' })
    },

    calculateReadTime (textLength) {
      const wordsPerMinute = 200
      return Math.ceil(textLength / wordsPerMinute)
    },

    getDetails (article) {
      this.$router.push(
        { name: 'article', params: { id: article.id } }
      )
    },

    getArticleAuthor (author) {
      let user = this.$store.getters.users.find(user => user.id === author && user)
      if (user) {
        return user.name
      }
    },

    toggle (type) {
      this.type = type
    }
  },

  computed: {
    ...mapGetters(['articles', 'users', 'user', 'userdata']),

    filteredArticles () {
      let articles = this.articles
      if (this.type === 'my') {
        articles = articles.filter(article => article.author === this.user.id)
      }
      if (this.type === 'following') {
        let followers = Object.keys(this.userdata.following)
        articles = articles.filter(article => followers.includes(article.author))
      }
      if (this.type === 'favorites') {
        articles = articles.filter(article => {
          return Object.keys(article.likes).includes(this.user.id)
        })
      }
      return articles
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
    this.$bus.$on('articlecover:updated', () => {
      this.$store.dispatch('loadArticles')
    })
    this.$bus.$on('userprofile:changed', () => {
      this.$store.dispatch('loadUsers')
    })
  },

  beforeDestroy () {
    this.$bus.$off('article:updated')
    this.$bus.$off('articlecover:updated')
    this.$bus.$off('userprofile:changed')
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/articles.less';
</style>
