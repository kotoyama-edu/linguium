<template>
  <div class="container">
    <div class="md-layout md-alignment-center">
      <div class="field">
        <md-field>
          <label>Поиск</label>
          <md-input v-model="search"></md-input>
        </md-field>
      </div>

      <div class="field">
        <md-field>
          <label for="level">Уровень</label>
          <md-select v-model="level" name="level" multiple>
            <md-option v-for="lvl in levels" :key="lvl" :value="lvl"> {{ lvl }}</md-option>
          </md-select>
        </md-field>
      </div>
    </div>

    <div class="book-list md-layout md-alignment-center">
      <div class="book-item"
        v-for="book in filteredBooks" :key="book.id" @click="getDetails(book)">
        <md-card md-with-hover>
          <md-card-media-cover md-solid>
            <md-card-media>
              <img :src="require(`@/assets/bookscovers/${book.image}.jpg`)" alt="book">
            </md-card-media>
            <md-card-area>
              <md-card-header>
                <span class="md-title">{{ book.title }}</span>
                <span class="md-subhead">{{ book.author }}</span>
              </md-card-header>
              <md-card-actions>
                <md-button>Читать</md-button>
              </md-card-actions>
            </md-card-area>
          </md-card-media-cover>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: null,
      level: [],
      levels: ['Intermediate', 'Pre-Intermediate']
    }
  },

  methods: {
    getDetails (book) {
      this.$router.push(
        { name: 'book', params: { id: book.id } }
      )
    }
  },

  computed: {
    books () {
      return this.$store.getters.books
    },

    filteredBooks () {
      let books = this.books
      if (this.search) {
        books = books.filter(book =>
          book.title.toLowerCase().indexOf(this.search.toLowerCase()) >= 0 ||
          book.author.toLowerCase().indexOf(this.search.toLowerCase()) >= 0)
      }

      if (this.level.length) {
        books = books.filter(book => this.level.filter(value => book.level.indexOf(value) !== -1).length > 0)
      }
      return books
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/books.less';
</style>
