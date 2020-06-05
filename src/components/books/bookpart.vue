<template>
  <div class="container" v-if="part" :class="mode">
    <div class="actions">
      <a @click="$router.go(-1)"><md-icon class="back">arrow_back_ios</md-icon>Назад</a>
      <div class="icon-action" @click="getCurrentBookPage()"><md-icon class="action">close</md-icon></div>
      <div class="icon-action" @click="mode === 'dark' ? mode = 'light' : mode = 'dark'"><md-icon class="action">nights_stay</md-icon></div>
    </div>
    <div class="note" v-if="finishedDate">
      <header><p>Часть прочитана {{ finishedDate | formattedDate }}</p></header>
    </div>
    <div class="tooltip" v-if="showTooltip">
      <p>Выделите слово или предложение, чтобы получить перевод.</p>
      <div class="icon-tooltip">
        <md-button class="md-icon-button md-dense" @click="showTooltip = false">
          <md-icon>close</md-icon>
        </md-button>
      </div>
    </div>
    <div class="content">
      <h1> {{ part.partTitle }}</h1>
      <div v-for="(content, i) in part.content" :key="`part${i}`">
        <p v-for="(paragraph, j) in content.paragraphs" :key="`part${i}sent${j}`" ref="target" @submit.stop.prevent="showSnackbar = true">
          {{ paragraph.text }}
        </p>
      </div>
      <div class="dialog-button">
        <md-dialog-confirm
          :md-active.sync="active"
          md-title="Завершить главу?"
          md-content="Вы уверены, что хотите завершить чтение данной главы?"
          md-confirm-text="Завершить"
          md-cancel-text="Отмена"
          @md-confirm="completePart" />
        <md-button class="md-raised" @click="active = true" v-if="!finishedDate">Завершить</md-button>
        <md-button class="md-raised" @click="getNextPartReading()" v-if="nextPart">Следующая часть</md-button>
      </div>
    </div>
    <md-dialog-alert
      :md-active.sync="warning"
      :md-content="content"
      md-confirm-text="Ok" />
    <md-snackbar class="snackbar" md-position="center" :md-duration="5000" :md-active.sync="showSnackbar" md-persistent>
      <span>{{ word.translation }}</span>
      <md-button v-if="word.textToTranslate.length < 25" class="to-dict" @click="addWord()" :disabled="checking || loading">В словарь</md-button> <!-- TODO: loading -->
    </md-snackbar>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import yandexConfig from '@/config/yandex'

export default {
  data: () => ({
    word: {
      textToTranslate: '',
      translation: ''
    },
    selection: '',
    showSnackbar: false,
    mode: 'light',
    part: null,
    active: false,
    showTooltip: true,
    warning: false,
    checking: false,
    content: '',
    partKey: '',
    nextPart: null
  }),

  props: {
    'bookId': {
      type: String,
      required: true
    },
    'partId': {
      type: String,
      required: true
    }
  },

  created () {
    Vue.$db.collection('bookParts')
      .where('bookId', '==', this.bookId)
      .where('bookPartId', '==', this.partId)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(element => {
          this.part = element.data()
          this.partKey = element.id
        })
      })
      .then(() => {
        this.$store.dispatch('updateUserBookPart', { bookId: this.bookId, partId: this.partId })
      })
      .then(() => {
        this.getNextPart()
      })
      .catch(error => console.log(error))
  },

  mounted () {
    document.addEventListener('mouseup', event => {
      this.getSelectedTextAndTranslate()
      window.getSelection().removeAllRanges()
    })
  },

  methods: {
    getSelectedTextAndTranslate () {
      this.selection = window.getSelection().toString()
      if (this.selection) {
        this.getTranslation()
        this.showSnackbar = true
      }
    },

    getTranslation () {
      try {
        axios.get(`${yandexConfig.url + yandexConfig.apiKey + this.selection}`)
          .then(response => {
            this.word.textToTranslate = this.selection
            this.word.translation = response.data.text[0]
          })
      } catch (err) {
        this.error = err.message
      }
    },

    addWord () {
      this.checking = true
      const word = {
        id: this.word.textToTranslate.toLowerCase().replace(/\s/g, ''),
        originalWord: this.word.textToTranslate.toLowerCase(),
        translatedWord: this.word.translation.toLowerCase()
      }

      let userWords = this.$store.getters.userdata.words

      if (userWords[word.id]) {
        this.warning = true
        this.content = 'Это слово уже есть в словаре.'
      } else if (Object.keys(userWords).length > 100) {
        this.warning = true
        this.content = 'Вы уже добавили слишком много слов для изучения.'
      } else {
        this.$store.dispatch('addUserWord', word)
      }
      this.checking = false
    },

    completePart () {
      this.$store.dispatch('completeUserBookPart', { bookId: this.bookId, partId: this.partId })
    },

    getNextPart () {
      let nextPartDocument = Vue.$db.collection('bookParts').doc(this.nextPartDocument)
      nextPartDocument.get()
        .then((data) => {
          this.nextPart = data.exists ? data.data() : {}
        })
    },

    getNextPartReading () {
      this.$router.push(
        { name: 'bookpart', params: { bookId: this.bookId, partId: this.nextPart.bookPartId } }
      )
    },

    getCurrentBookPage () {
      this.$router.push(
        { name: 'book', params: { id: this.bookId } }
      )
    }
  },

  computed: {
    finishedDate () {
      let book = this.$store.getters.userdata.books[this.bookId]
      if (book && book.parts[this.partId]) {
        return book.parts[this.partId].finishedDate
      }
    },

    nextPartDocument () {
      let nextPartNum = Math.floor(this.partKey.match(/\d+/)[0]) + 1
      let currentBookPart = this.partKey.replace(/[0-9]/g, '')
      return currentBookPart + nextPartNum
    },

    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>

<style lang="less">
@import '~@/assets/less/bookpart.less';
</style>
