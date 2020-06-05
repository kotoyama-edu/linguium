<template>
  <div class="container">
    <form novalidate @submit.prevent="signUp" @submit.stop.prevent="showSnackbar = true">

      <div class="title">
        <div class="md-title">Sign Up</div>
      </div>

      <div class="form-fields">
        <md-field :class="getValidationClass('name')">
          <label>Name</label>
          <md-input type="text" v-model="form.name" @change="$v.form.name.$touch()" v-focus></md-input>
          <span class="md-error" v-if="!$v.form.name.required">Field is required</span>
          <span class="md-error" v-else-if="!$v.form.name.minLength">Name must have at least {{ $v.form.name.$params.minLength.min }} letters.</span>
        </md-field>

        <md-field :class="getValidationClass('email')">
          <label>Email</label>
          <md-input type="email" autocomplete="email" v-model="form.email" @change="$v.form.email.$touch()"></md-input>
          <span class="md-error" v-if="!$v.form.email.required">Field is required</span>
          <span class="md-error" v-else-if="!$v.form.email.email">Invalid email</span>
        </md-field>

        <md-field :class="getValidationClass('password')" md-has-password>
          <label>Password</label>
          <md-input v-model="form.password" type="password" @change="$v.form.password.$touch()" autocomplete="off"></md-input>
          <span class="md-error" v-if="!$v.form.password.required">Password is required.</span>
          <span class="md-error" v-else-if="!$v.form.password.minLength">Password must have at least {{ $v.form.password.$params.minLength.min }} letters.</span>
        </md-field>

        <md-field :class="getValidationClass('repeatPassword')" md-has-password>
          <label>Repeat password</label>
          <md-input v-model="form.repeatPassword" type="password" @change="$v.form.repeatPassword.$touch()" autocomplete="off"></md-input>
          <span class="md-error" v-if="!$v.form.repeatPassword.sameAsPassword">Passwords must be identical.</span>
        </md-field>
      </div>

      <div class="actions md-layout md-alignment-center">
        <md-button type="submit" :disabled="loading">
          <span v-if="loading">Loading...</span>
          <span v-else>Sign Up</span>
        </md-button>
      </div>

      <md-snackbar md-position="left" :md-duration="4000" :md-active.sync="showSnackbar" md-persistent>
        <span v-if="submitStatus === 'OK'">User successfully signed up!</span>
        <span v-else>{{ submitStatus }}</span>
      </md-snackbar>

    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  data () {
    return {
      showSnackbar: false,
      submitStatus: 'Processing...',
      form: {
        name: '',
        email: '',
        password: '',
        repeatPassword: ''
      }
    }
  },
  validations: {
    form: {
      name: {
        required,
        minLength: minLength(3)
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6)
      },
      repeatPassword: {
        sameAsPassword: sameAs('password')
      }
    }
  },
  methods: {
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    signUp () {
      this.$v.$touch()
      const user = {
        name: this.form.name,
        email: this.form.email,
        password: this.form.password
      }
      this.$store.dispatch('signUp', user)
        .then(() => {
          this.submitStatus = 'OK'
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
