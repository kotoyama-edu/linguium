<template>
<div class="container" v-if="book">
  <section class="cover">
    <img :src="require(`@/assets/bookscovers/${book.image}.jpg`)">
  </section>
  <section class="content">
    <div class="book-title">
      <span class="md-headline">{{ book.title }}</span>
      <div class="icon" v-if="getUserDataBook()">
        <i class="material-icons">cloud_done</i>
        <md-tooltip md-direction="top" md-delay="200">Книга скачана {{ getBookAddedDate() | formattedDate }}</md-tooltip>
      </div>
    </div>
    <span class="md-subhead">Автор: {{ book.author }}</span>
    <span class="md-subhead">Уровень: {{ book.level.toString() }}</span>
    <span class="md-subhead">Год: {{ book.year }}</span>
    <span class="md-subhead">{{ book.description }}</span>
    <div class="chips">
      <md-chip class="chip" v-for="genre in book.genres" :key="genre">{{ genre }}</md-chip>
    </div>
    <div class="content-bottom">
      <md-button class="button bookmark" v-if="canLoadBook()" @click="addToUserLibrary()">
        <md-icon>cloud_download</md-icon>
        Загрузить
      </md-button>
      <md-button class="button bookmarked" v-else disabled>
        <md-icon>library_add_check</md-icon>
        В библиотеке
      </md-button>
    </div>
  </section>
  <section class="parts">
    <span class="md-headline" v-if="book.parts.length">Главы</span>
    <span class="md-headline" v-else>Нет доступных глав для чтения</span>
    <md-content class="md-scrollbar">
      <div class="part" v-for="part in book.parts" :key="part.id">
        <BookPartItem :part="part" :bookId="book.id"></BookPartItem>
      </div>
    </md-content>
  </section>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import BookPartItem from '@/components/books/bookpartitem'

export default {
  props: {
    'id': {
      type: String,
      required: true
    }
  },

  components: {
    BookPartItem
  },

  methods: {
    canLoadBook () {
      let book = this.getUserDataBook()
      return this.checkUser && !this.loading && !book
    },

    addToUserLibrary () {
      this.$store.dispatch('addUserBook', this.id)
    },

    getUserDataBook () {
      return this.userdata.books[this.id]
    },

    getBookAddedDate () {
      let book = this.getUserDataBook()
      return book.addedDate
    }
  },

  computed: {
    book () {
      return this.$store.getters.books.find(book => book.id === this.id)
    },

    isUserBookLoaded () {
      let book = this.getUserDataBook()
      return this.checkUser && !this.loading && !!book
    },

    ...mapGetters(['checkUser', 'userdata', 'loading'])
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/bookdetails.less';
</style>
