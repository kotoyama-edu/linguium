<template>
  <div class="container">
    <form novalidate @submit.prevent="login" @submit.stop.prevent="showSnackbar = true">
      <div class="title">
        <div class="md-title">Login</div>
      </div>
      <div class="form">
        <md-field>
          <label>Email</label>
          <md-input type="email" v-model="form.email" autocomplete="email" v-focus></md-input>
        </md-field>
        <md-field md-has-password>
          <label>Password</label>
          <md-input v-model="form.password" type="password" autocomplete="off"></md-input>
        </md-field>
      </div>
      <div class="actions md-layout md-alignment-center">
        <md-button type="submit" :disabled="loading">
          <span v-if="loading">Loading...</span>
          <span v-else>Login</span>
        </md-button>
      </div>
      <md-snackbar md-position="left" :md-duration="4000" :md-active.sync="showSnackbar" md-persistent>
        <span v-if="submitStatus === 'OK'">Successfully logged in!</span>
        <span v-else>{{ submitStatus }}</span>
      </md-snackbar>
    </form>
  </div>
</template>

<script>

export default {
  data () {
    return {
      showSnackbar: false,
      submitStatus: 'Processing...',
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      const user = {
        email: this.form.email,
        password: this.form.password
      }
      this.$store.dispatch('login', user)
        .then(() => {
          this.submitStatus = 'OK'
        })
        .then(() => {
          this.$router.push('/')
        })
        .catch(err => {
          this.submitStatus = err.message
        })
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/auth.less';
@import '~@/assets/less/ui/button.less';
</style>
