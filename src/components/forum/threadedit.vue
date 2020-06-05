<template>
  <div class="container">
    <span class="md-headline">Edit thread</span>
    <form class="md-layout" @submit.prevent="editThread" @submit.stop.prevent="showSnackbar = true">
      <md-field md-inline :class="getValidationClass('editedTitle')">
        <label>Title</label>
        <md-input v-model="editedTitle" @change="$v.editedTitle.$touch()" required></md-input>
        <span class="md-error" v-if="!$v.editedTitle.required">Field is required.</span>
      </md-field>
      <md-field :class="getValidationClass('editedDescription')">
        <label>Description</label>
        <md-textarea v-model="editedDescription" @change="$v.editedDescription.$touch()" required></md-textarea>
        <span class="md-error" v-if="!$v.editedDescription.required">Field is required.</span>
      </md-field>
      <div class="thread-details md-layout md-gutter">
        <div class="md-layout-item">
          <md-field :class="getValidationClass('editedTopic')">
            <label for="movie">Topic</label>
            <md-select v-model="editedTopic" @change="$v.editedTopic.$touch()" required>
              <md-option value="general">General Discussion</md-option>
              <md-option value="help">Get Help</md-option>
              <md-option value="introductions">Introductions</md-option>
              <md-option value="feedback">Feedback</md-option>
            </md-select>
            <span class="md-error" v-if="!$v.editedTopic.required">Field is required.</span>
          </md-field>
          <md-chips class="md-primary shake-on-error" v-model="editedTags" :md-limit="5" md-placeholder="Add tags..." :md-format="formatTag" @keydown.enter.native.prevent>
            <div class="md-helper-text">Up to 5 tags</div>
          </md-chips>
        </div>
      </div>
      <div class="thread-button-create">
        <md-button type="submit" class="md-raised md-primary" :disabled="loading">
          <span v-if="loading">Loading...</span>
          <span v-else>Update</span>
        </md-button>
        <md-button class="md-raised md-primary cancel" @click="cancel()">Cancel</md-button>
        <md-snackbar md-position="left" :md-duration="4000" :md-active.sync="showSnackbar" md-persistent>
          <span>{{ submitStatus }}</span>
        </md-snackbar>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],

  props: {
    'topic': {
      type: String
    },
    'id': {
      type: String,
      required: true
    }
  },

  data: () => ({
    editedTitle: '',
    editedDescription: '',
    editedTopic: null,
    editedTags: [],
    showSnackbar: false,
    submitStatus: 'Processing...'
  }),

  validations: {
    editedTitle: {
      required
    },
    editedDescription: {
      required
    },
    editedTopic: {
      required
    }
  },

  methods: {
    getValidationClass (fieldName) {
      const field = this.$v[fieldName]
      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },

    formatTag (str) {
      let tags = str.split(' ').filter(str => str !== '')
      tags = tags.map(str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
      tags = tags.map(str => str[0].toUpperCase() + str.slice(1))
      return tags.join(' ')
    },

    editThread () {
      this.$v.$touch()
      const editedThread = {
        id: this.thread.id,
        title: this.editedTitle,
        description: this.editedDescription,
        tags: this.editedTags,
        topic: this.editedTopic
      }
      if (!this.userIsCreator) {
        this.submitStatus = 'firestore: PERMISSION_DENIED'
      } else if (this.cannotEditThread) {
        this.submitStatus = 'Fill the form correctly'
      } else {
        this.$store.dispatch('editThread', editedThread)
          .then(() => {
            this.$router.push({ name: 'thread', params: { id: this.id, topic: this.editedTopic } })
          })
      }
    },

    cancel () {
      this.$router.push({ name: 'thread', params: { id: this.id, topic: this.thread.topic } })
    }
  },

  created () {
    this.editedTitle = this.thread.title
    this.editedDescription = this.thread.description
    this.editedTags = this.thread.tags
    this.editedTopic = this.thread.topic
  },

  computed: {
    ...mapGetters(['checkUser', 'user', 'loading']),

    cannotEditThread () {
      return !this.thread.description || !this.thread.title || !this.thread.topic
    },

    userIsCreator () {
      return this.checkUser ? this.$store.getters.user.id === this.thread.author : false
    },

    thread () {
      return this.$store.getters.threads.find(thread => thread.id === this.id)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/threadcreate.less';
</style>
