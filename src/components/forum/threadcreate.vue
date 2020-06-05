<template>
  <div class="container">
    <span class="md-headline">Start thread</span>
    <form class="md-layout" @submit.prevent="sendThread">
      <md-field md-inline :class="getValidationClass('title')">
        <label>Title</label>
        <md-input v-model="thread.title" @change="$v.thread.title.$touch()" required></md-input>
        <span class="md-error" v-if="!$v.thread.title.required">Field is required.</span>
      </md-field>
      <md-field :class="getValidationClass('description')">
        <label>Description</label>
        <md-textarea v-model="thread.description" @change="$v.thread.description.$touch()" required></md-textarea>
        <span class="md-error" v-if="!$v.thread.description.required">Field is required.</span>
      </md-field>
      <div class="thread-details md-layout md-gutter">
        <div class="md-layout-item">
          <md-field :class="getValidationClass('topic')">
            <label for="movie">Topic</label>
            <md-select v-model="thread.topic" disabled @change="$v.thread.topic.$touch()" required>
              <md-option value="general">General Discussion</md-option>
              <md-option value="help">Get Help</md-option>
              <md-option value="introductions">Introductions</md-option>
              <md-option value="feedback">Feedback</md-option>
            </md-select>
            <span class="md-error" v-if="!$v.thread.topic.required">Field is required.</span>
          </md-field>
          <md-chips class="md-primary shake-on-error" v-model="thread.tags" :md-limit="5" md-placeholder="Add tags..." :md-format="formatTag" @keydown.enter.native.prevent>
            <div class="md-helper-text">Up to 5 tags</div>
          </md-chips>
        </div>
      </div>
      <div class="thread-button-create">
        <md-button type="submit" class="md-raised md-primary" :disabled="loading">
          <span v-if="loading">Loading...</span>
          <span v-else>Send Thread</span>
        </md-button>
        <md-button class="md-raised md-primary cancel" @click="cancel()">Cancel</md-button>
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
    }
  },

  data: () => ({
    thread: {
      title: '',
      description: '',
      author: null,
      tags: [],
      date: new Date(),
      topic: null,
      replies: {},
      answered: false
    }
  }),

  validations: {
    thread: {
      title: {
        required
      },
      description: {
        required
      },
      topic: {
        required
      }
    }
  },

  methods: {
    getValidationClass (fieldName) {
      const field = this.$v.thread[fieldName]
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

    sendThread () {
      this.$v.$touch()
      const thread = {
        title: this.thread.title,
        description: this.thread.description,
        author: this.thread.author,
        tags: this.thread.tags,
        date: this.thread.date,
        topic: this.thread.topic,
        replies: this.thread.replies,
        answered: this.thread.answered
      }
      if (!this.cannotSendThread) {
        this.$store.dispatch('sendThread', thread)
          .then(() => {
            this.$router.push({ name: 'forumtopic', params: { topic: this.thread.topic } })
          })
      }
    },

    cancel () {
      this.$router.push('/forum/' + this.topic)
    }
  },

  created () {
    this.thread.author = this.user.id
    if (this.topic) {
      this.thread.topic = this.topic
    } else {
      this.thread.topic = null
    }
  },

  computed: {
    ...mapGetters(['user', 'loading']),

    cannotSendThread () {
      return !this.thread.description || !this.thread.title || !this.thread.topic
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/threadcreate.less';
</style>
