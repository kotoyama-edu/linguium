<template>
  <section class="words-learning">
    <md-table v-model="words" v-if="words.length" md-sort="original" class="learning-table" md-fixed-header>
      <md-table-toolbar>
        <span class="md-title">Your words for today</span>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Word" md-sort-by="original">{{ item.original }}</md-table-cell>
        <md-table-cell md-label="Translation" md-sort-by="translation">{{ item.translation }}</md-table-cell>
        <md-table-cell md-label="Pronunciation">
          <md-button class="md-icon-button md-dense" v-if="canPronounceWord" @click="pronounce(item.original)">
            <md-icon>volume_up</md-icon>
          </md-button>
          <md-button class="md-icon-button md-dense" v-else disabled>
            <md-icon>volume_off</md-icon>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>

    <div v-else>
      <md-empty-state
        md-icon="g_translate"
        md-label="Нет слов для изучения"
        md-description="Чтобы пополнить словарь, читайте книги и выделяйте незнакомые слова.">
        <md-button class="md-primary md-raised" @click="getBooksPage()">Перейти к списку книг</md-button>
      </md-empty-state>
    </div>

    <div class="footer-actions">
      <md-button v-if="words.length < 5" disabled>Добавьте хотя бы пять слов, чтобы практиковаться
      </md-button>
      <md-button v-else @click="getTraining()">Перейти к изучению
        <md-icon>arrow_right_alt</md-icon>
      </md-button>
    </div>
  </section>
</template>

<script>
import { pronounceWord, getVoices } from '@/helpers/speechSynthesis'
import { setWords } from '@/helpers/words'

export default {
  data () {
    return {
      words: [],
      cards: [],
      showAnswer: false,
      canPronounceWord: false,
      voice: null
    }
  },

  methods: {
    setWords () {
      let userWords = this.$store.getters.userdata.words
      setWords(this.words, userWords)
    },

    pronounce (word) {
      pronounceWord(word, this.voice)
    },

    getTraining () {
      this.$router.push({ name: 'trainer' })
    },

    getBooksPage () {
      this.$router.push({ name: 'booklist' })
    }
  },

  created () {
    this.$bus.$once('userdata:loaded', () => {
      this.setWords()
    })
    this.$bus.$on('userword:updated', () => {
      this.setWords()
    })

    if ('speechSynthesis' in window) {
      getVoices().then(voice => {
        let englishVoices = voice.filter(voice => voice.name.toLowerCase().indexOf('english') >= 1)
        if (englishVoices.length) {
          this.canPronounceWord = true
          this.voice = englishVoices[0]
        }
      })
    }
  },

  mounted () {
    this.setWords()
  },

  beforeDestroy () {
    this.$bus.$off('userdata:loaded')
    this.$bus.$off('userword:updated')
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/vocabulary.less';
</style>
