<template>
<div class="wrapper">
  <!-- <header>
    <div class="filters">
      <div v-if="selectedSort.length === 0">
        <md-chip @click="sortByAuthorName()">Sort by author</md-chip>
        <md-chip @click="sortByTitle()">Sort by title</md-chip>
      </div>
      <div v-else-if="selectedSort === 'bytitle'">
        <md-chip @click="sortByAuthorName()">Sort by author</md-chip>
        <md-chip class="md-primary" @click="sortByTitle()">Sort by title</md-chip>
      </div>
      <div v-else>
        <md-chip class="md-primary" @click="sortByAuthorName()">Sort by author</md-chip>
        <md-chip @click="sortByTitle()">Sort by title</md-chip>
      </div>
    </div>
    <div class="search">
      <input id="search" type="search" v-model="searchedTitle" placeholder="Search by title">
    </div>
  </header> -->
  <div class="books-container" v-if="userBooks.length">
    <transition-group name="books-group" tag="div" id="animation">
    <div class="userbook" v-for="book in filteredByTitle" :key="book.id" @click="getDetails(book)">
      <picture class="img-container">
        <img :src="require(`@/assets/bookscovers/${book.image}.jpg`)" alt="book">
      </picture>
    </div>
    </transition-group>
  </div>
  <div v-else>
    <md-empty-state
      md-icon="library_books"
      md-label="Нет доступных книг"
      md-description="Книги нужны для изучения новых слов посредством чтения.">
      <md-button class="md-primary md-raised" @click="getBooksPage()">Перейти к списку книг</md-button>
    </md-empty-state>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      myBooks: [],
      searchedTitle: '',
      selectedSort: ''
    }
  },

  computed: {
    ...mapGetters(['userdata', 'books']),

    userBooks () {
      return this.books.filter(book => this.userdata.books[book.id])
    },

    filteredByTitle () {
      return this.myBooks.filter(book => {
        return book.title.toLowerCase().includes(this.searchedTitle.toLowerCase())
      })
    }
  },

  methods: {
    getBooksPage () {
      this.$router.push({ name: 'booklist' })
    },

    getDetails (book) {
      this.$router.push(
        { name: 'book', params: { id: book.id } }
      )
    },

    sortByTitle () {
      this.selectedSort = 'bytitle'
      return this.myBooks.sort((a, b) => a.title > b.title ? 1 : -1)
    },

    sortByAuthorName () {
      this.selectedSort = 'byauthor'
      return this.myBooks.sort((a, b) => a.author > b.author ? 1 : -1)
    }
  },

  mounted () {
    this.myBooks = this.userBooks
  },

  created () {
    this.$bus.$once('userdata:loaded', () => {
      this.myBooks = this.userBooks
    })
  },

  beforeDestroy () {
    this.$bus.$off('userdata:loaded')
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/userbooks.less';
</style>
