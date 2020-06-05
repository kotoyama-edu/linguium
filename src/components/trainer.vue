<template>
  <div class="container">
    <div class="actions">
      <a @click="$router.go(-1)"><md-icon class="back">arrow_back_ios</md-icon>Назад</a>
      <div class="icon-action" @click="$router.go(-1)"><md-icon class="action">close</md-icon></div>
    </div>
    <div class="cards">
      <div class="card" v-for="(card, index) in cards" :key="index" v-show="questionIndex == index">
        <header v-if="mode == 'learning'">
          <p>Вопрос {{ questionIndex + 1 }} из {{ cards.length }}</p>
          <p>Правильных ответов: {{ score }}</p>
        </header>
        <div class="results-mode" v-if="mode == 'results'">
          <div class="result-img">
            <img :src="require(`@/assets/images/marginalia-unsubscribed.png`)">
          </div>
          <div class="result-text">
            <span class="md-headline">Результат</span>
            <span class="md-subheading">Правильных ответов: {{ score }} из {{ cards.length }}</span>
            <md-button class="md-raised" :md-ripple="false" @click="back()">Вернуться в профиль</md-button>
          </div>
        </div>
        <div class="card-content"  v-if="mode == 'learning'">
          <div class="word-to-memorize">
            <span class="current-word">{{ card.questionWord.original }}</span>
            <md-button class="md-icon-button md-dense md-primary" v-if="canPronounceWord" @click="pronounce(card.questionWord.original)">
              <md-icon>volume_up</md-icon>
            </md-button>
          </div>
          <div class="answers-container">
            <div class="answer" v-for="(answer, index) in card.answers" :key="index">
              <md-button v-if="!card.answered" class="md-raised" :md-ripple="false" @click="checkAnswer(answer, card)">{{ answer.translation }}</md-button>
              <md-button v-if="card.answered && card.questionWord.translation == answer.translation" class="correct" disabled>{{ answer.translation }}</md-button>
              <md-button v-if="card.answered && card.questionWord.translation !== answer.translation" class="md-raised" disabled>{{ answer.translation }}</md-button>
            </div>
          </div>
        </div>
        <div class="footer" v-if="mode == 'learning'">
          <transition name="slide-fade">
            <div class="notification" v-if="showAnswer">
              <div class="correct" v-if="card.correct">
                <md-icon class="md-size-2x">check_circle</md-icon>
                <span>Верно!</span>
              </div>
              <div class="incorrect" v-else>
                <md-icon class="md-size-2x">highlight_off</md-icon>
                <span>Неверно!</span>
              </div>
            </div>
          </transition>
          <md-button v-if="index == cards.length - 1 && card.answered == true && mode == 'learning'"
            :md-ripple="false"
            @click="mode = 'results'"
          >Результат</md-button>
          <md-button v-else
            :md-ripple="false"
            :disabled="index >= cards.length - 1 || card.answered == false && mode == 'learning'"
            @click="nextQuestion(card, index)"
          >Дальше</md-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setWords, shuffle } from '../helpers/words'
import { pronounceWord, getVoices } from '../helpers/speechSynthesis'

export default {
  data () {
    return {
      words: [],
      cards: [],
      questionIndex: 0,
      score: 0,
      canPronounceWord: false,
      showAnswer: false,
      voice: null,
      mode: 'learning'
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

    nextQuestion (card, index) {
      this.showAnswer = false
      if (index < this.cards.length - 1) {
        this.questionIndex++
      } else if (index === this.cards.length - 1) {
        this.questionIndex = this.cards.length
      }
    },

    checkAnswer (answer, card) {
      card.answered = true
      if (answer.translation === card.questionWord.translation) {
        card.correct = true
        this.score++
        this.processWord(card.questionWord)
      } else {
        card.correct = false
      }
      this.showAnswer = true
    },

    generateAnswers (givenWord) {
      let wrongAnswers = this.words.filter(word => word.translation !== givenWord.translation)
      let correctAnswers = this.words.filter(word => word.translation === givenWord.translation)
      return correctAnswers.concat(wrongAnswers.slice(0, 3))
    },

    setQuestionCards () {
      for (var item in this.words) {
        if (this.words.hasOwnProperty(item)) {
          let word = this.words[item]
          let questionCard = {
            questionWord: word,
            answers: shuffle(this.generateAnswers(word)),
            answered: false,
            correct: null
          }
          this.cards.push(questionCard)
        }
      }
    },

    processWord (word) {
      this.$store.dispatch('processUserWord', word.id)
    },

    back () {
      this.$router.push({ name: 'profile' })
    }
  },

  created () {
    this.$bus.$once('userdata:loaded', () => {
      this.setWords()
      shuffle(this.words)
      this.setQuestionCards()
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
    shuffle(this.words)
    this.setQuestionCards()
  },

  beforeDestroy () {
    this.$bus.$off('userdata:loaded')
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/trainer.less';
</style>
