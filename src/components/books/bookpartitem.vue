<template>
  <div md-layout @click="getPartReading()">
    <md-card class="md-primary md-layout-item md-medium-size-100 md-small-size-100 md-xsmall-size-100"
      md-theme="green-card">
      <md-card-header>
        <div class="md-subheading">{{ part.title }}</div>
        <div class="md-caption" v-if="finishedDate">Прочитана {{ finishedDate | formattedDate }}</div>
        <div class="md-caption" v-else-if="!isUserBookLoaded">Не загружена</div>
        <div class="md-caption" v-else>Не прочитана</div>
      </md-card-header>
    </md-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    'part': {
      type: Object,
      required: true
    },
    'bookId': {
      required: true
    }
  },

  methods: {
    getPartReading () {
      if (this.isUserBookLoaded) {
        this.$router.push({ name: 'bookpart', params: { bookId: this.bookId, partId: this.part.id } })
      }
    }
  },

  computed: {
    ...mapGetters(['checkUser', 'userdata', 'loading']),

    isUserBookLoaded (bookId) {
      return this.checkUser && !this.loading && !!this.userdata.books[this.bookId]
    },

    finishedDate () {
      if (!this.isUserBookLoaded) return false
      let book = this.userdata.books[this.bookId]

      if (book && book.parts[this.part.id]) {
        return book.parts[this.part.id].finishedDate
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/bookdetails.less';
</style>
