<template>
<div class="wrapper">
  <section class="hello-content">
    <div class="container">
      <div class="left-side">
        <img :src="require(`@/assets/images/hello.png`)" loading="eager">
      </div>
      <div class="right-side">
        <h1>Learning English is easy</h1>
        <p>Изучай английский с удовольствием вместе с Linguium App</p>
        <md-button @click="getStarting()" v-if="!checkUser" class="md-raised" :md-ripple="false">Начать</md-button>
        <md-button @click="getLearning()" v-else class="md-raised" :md-ripple="false">Продолжить учиться</md-button>
      </div>
    </div>
  </section>
  <section class="promotion">
    <div class="container">
      <h1>Что тебя ждет в процессе обучения</h1>
      <ul class="promises">
        <li class="promise-item">
          <div class="promise-img">
            <img :src="require(`@/assets/images/clip-education.png`)">
          </div>
          <span>Читай книги</span>
          <p>Читай те книги, которые нравятся <b>лично тебе.</b></p>
        </li>
        <li class="promise-item">
          <div class="promise-img">
            <img :src="require(`@/assets/images/clip-list-is-empty.png`)">
          </div>
          <span>Учи слова и выражения</span>
          <p>Добавляй в свой список для изучения <b>любое незнакомое слово.</b></p>
        </li>
        <li class="promise-item">
          <div class="promise-img">
            <img :src="require(`@/assets/images/clip-programming.png`)">
          </div>
          <span>Учись на любом устройстве</span>
          <p>Сайт адаптирован для работы <b>на любом устройстве.</b></p>
        </li>
      </ul>
    </div>
  </section>
  <section class="about-project">
    <div class="container">
      <h1>О проекте</h1>
      <p>Данный проект является дипломной работой в рамках специальности
        «Математическое обеспечение и администрирование информационных систем»
        ИРИТ-РТФ УрФУ г. Екатеринбурга.</p>
    </div>
  </section>
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  methods: {
    getStarting () {
      this.$router.push({ name: 'login' })
    },

    getLearning () {
      this.$router.push({ name: 'profile' })
    }
  },

  computed: {
    ...mapGetters(['checkUser'])
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/startpage.less';
</style>
