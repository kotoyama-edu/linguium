<template>
  <div class="profile-settings">
    <section class="change-userpic">
      <div class="md-title">Profile picture</div>
      <div class="userpic-content">
        <md-field>
          <md-file @change.native="getFile" v-model="file.name" placeholder="Upload your avatar" accept="image/*" />
        </md-field>
        <md-button class="md-dense md-primary" @click="uploadAvatar()" :disabled="loading || !isFileExists">
          <span v-if="loading">Loading...</span>
          <span v-else>Change</span>
        </md-button>
      </div>
      <md-divider></md-divider>
    </section>
    <section class="change-username">
      <div class="md-title">Username</div>
      <div class="username-content">
        <p>Your user name is <span>{{ userName }}</span></p>
        <md-button class="md-dense md-primary" @click="openDialog('name')">Change</md-button>

        <md-dialog :md-active.sync="usernameDialog">
          <form @submit.prevent="changeUserProfile" @keyup.enter="changeUserProfile">
            <md-dialog-title>Enter new username</md-dialog-title>
              <div class="error">
                <span v-if="error">{{ error }}</span>
              </div>
              <md-field :class="getValidationClass('password')" md-has-password>
                <label>Your password</label>
                <md-input v-model="form.password" type="password" autocomplete="off" @change="$v.form.password.$touch()"></md-input>
                <span class="md-error" v-if="!$v.form.password.required">Password is required.</span>
              </md-field>
              <md-field :class="getValidationClass('newUsername')">
                <label>New username</label>
                <md-input type="text" v-model="form.newUsername"></md-input>
                <span class="md-error" v-if="!$v.form.newUsername.required">Field is required</span>
                <span class="md-error" v-else-if="!$v.form.newUsername.minLength">User name must have at least {{ $v.form.newUsername.$params.minLength.min }} letters.</span>
              </md-field>
            <md-dialog-actions>
              <md-button class="md-primary" @click="closeDialog(usernameDialog)">Close</md-button>
              <md-button type="submit" :disabled="loading" class="md-primary">
                <span v-if="loading">Loading...</span>
                <span v-else>Save</span>
              </md-button>
            </md-dialog-actions>
          </form>
        </md-dialog>

      </div>
      <md-divider></md-divider>
    </section>
    <section class="change-email">
      <div class="md-title">Email address</div>
      <div class="email-content">
        <p>Your email address is <span>{{ userEmail }}</span></p>
        <md-button class="md-dense md-primary" @click="openDialog('email')">Change</md-button>

        <md-dialog :md-active.sync="userEmailDialog">
          <form @submit.prevent="changeUserProfile" @keyup.enter="changeUserProfile">
            <md-dialog-title>Enter new email</md-dialog-title>
              <div class="error">
                <span v-if="error">{{ error }}</span>
              </div>
              <md-field :class="getValidationClass('password')" md-has-password>
                <label>Your password</label>
                <md-input v-model="form.password" type="password" autocomplete="off" @change="$v.form.password.$touch()"></md-input>
                <span class="md-error" v-if="!$v.form.password.required">Password is required.</span>
              </md-field>
              <md-field :class="getValidationClass('newUserEmail')">
                <label>New email</label>
                <md-input type="email" autocomplete="email" v-model="form.newUserEmail" @change="$v.form.newUserEmail.$touch()"></md-input>
                <span class="md-error" v-if="!$v.form.newUserEmail.required">Field is required</span>
                <span class="md-error" v-else-if="!$v.form.newUserEmail.email">Invalid email</span>
              </md-field>
            <md-dialog-actions>
              <md-button class="md-primary" @click="closeDialog(userEmailDialog)">Close</md-button>
              <md-button type="submit" :disabled="loading" class="md-primary">
                <span v-if="loading">Loading...</span>
                <span v-else>Save</span>
              </md-button>
            </md-dialog-actions>
          </form>
        </md-dialog>

      </div>
      <md-divider></md-divider>
    </section>
    <section class="change-password">
      <div class="password-content">
        <div class="md-title">Password</div>
        <div class="button-container">
          <md-button class="md-dense md-primary" @click="openDialog('password')">Change</md-button>

          <md-dialog :md-active.sync="userPassDialog">
            <form @submit.prevent="changeUserProfile" @keyup.enter="changeUserProfile">
              <md-dialog-title>Enter new password</md-dialog-title>
                <div class="error">
                  <span v-if="error">{{ error }}</span>
                </div>
                <md-field :class="getValidationClass('password')" md-has-password>
                  <label>Old password</label>
                  <md-input v-model="form.password" type="password" autocomplete="off" @change="$v.form.password.$touch()"></md-input>
                  <span class="md-error" v-if="!$v.form.password.required">Password is required.</span>
                </md-field>
                <md-field :class="getValidationClass('newUserPassword')" md-has-password>
                  <label>New password</label>
                  <md-input type="password" autocomplete="off" v-model="form.newUserPassword" @change="$v.form.newUserPassword.$touch()"></md-input>
                  <span class="md-error" v-if="!$v.form.newUserPassword.required">Password is required.</span>
                  <span class="md-error" v-else-if="!$v.form.newUserPassword.minLength">New password must have at least {{ $v.form.newUserPassword.$params.minLength.min }} letters.</span>
                </md-field>
              <md-dialog-actions>
                <md-button class="md-primary" @click="closeDialog(userPassDialog)">Close</md-button>
                <md-button type="submit" :disabled="loading" class="md-primary">
                  <span v-if="loading">Loading...</span>
                  <span v-else>Save</span>
                </md-button>
              </md-dialog-actions>
            </form>
          </md-dialog>

        </div>
      </div>
      <md-divider></md-divider>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, minLength, email } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  data () {
    return {
      usernameDialog: false,
      userEmailDialog: false,
      userPassDialog: false,
      changeType: null,
      file: {},
      form: {
        password: null,
        newUsername: null,
        newUserEmail: null,
        newUserPassword: null
      }
    }
  },

  validations: {
    form: {
      newUsername: {
        required,
        minLength: minLength(3)
      },
      email: {
        required,
        email
      },
      newUserEmail: {
        required,
        email
      },
      password: {
        required
      },
      newUserPassword: {
        required,
        minLength: minLength(6)
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

    getFile (e) {
      this.file = e.target.files[0]
    },

    uploadAvatar () {
      this.$store.dispatch('updateProfilePic', this.file)
      setTimeout(() => {
        this.file = {}
      }, 1200)
    },

    changeUserProfile () {
      this.$v.$touch()
      try {
        const user = {
          email: this.userEmail,
          password: this.form.password,
          newName: this.form.newUsername,
          newEmail: this.form.newUserEmail,
          newPassword: this.form.newUserPassword,
          changeType: this.changeType
        }
        this.$store.dispatch('changeUserInfo', user)
      } catch (err) {
        console.log(err)
      }
    },

    openDialog (changeType) {
      this.changeType = changeType
      switch (changeType) {
        case 'name':
          this.usernameDialog = true
          break
        case 'email':
          this.userEmailDialog = true
          break
        case 'password':
          this.userPassDialog = true
          break
      }
    },

    closeDialog (dialog) {
      this.changeType = null
      this.form.password = null
      this.$v.$reset()
      this.$store.dispatch('clearError')
      switch (dialog) {
        case this.usernameDialog:
          this.usernameDialog = false
          break
        case this.userEmailDialog:
          this.userEmailDialog = false
          break
        case this.userPassDialog:
          this.userPassDialog = false
          break
      }
    }
  },

  computed: {
    ...mapGetters(['userName', 'userEmail', 'loading', 'error']),

    isFileExists () {
      return !!this.file.name
    }
  },

  created () {
    this.form.newUsername = this.userName
    this.$bus.$on('userprofile:changed', () => {
      this.usernameDialog = false
    })
    this.$bus.$on('userprofile:changed', () => {
      this.userEmailDialog = false
    })
    this.$bus.$on('userprofile:changed', () => {
      this.userPassDialog = false
    })
  },

  beforeDestroy () {
    this.$bus.$off('userprofile:changed')
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/settings.less';
</style>
