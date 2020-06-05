<template>
  <div class="container" v-if="thread">
    <header class="thread-header">
      <div class="thread-title">
        <span class="md-headline">{{ thread.title }}</span>
        <md-icon v-if="thread.answered">check_box</md-icon>
      </div>
      <div class="thread-actions">
        <router-link :to="{ name: 'forumtopic', params: { id: this.topic }}">Back to topic</router-link>
        <span class="md-body-1" v-if="userIsCreator" @click="editThread(thread)">Edit</span>
        <span class="md-body-1" v-if="userIsCreator" @click="deleteThread()">Delete</span>
      </div>
      <div class="thread-author">
        <div class="thread-author-avatar">
          <img :src="getThreadAuthorAvatar(thread.author)" alt="avatar"/>
        </div>
        <span class="md-body-2">{{ getThreadAuthorName(thread.author) }}</span>
        <div class="md-subhead">{{ thread.date | formattedDate }}</div>
      </div>
    </header>
    <section class="thread-main">
      <span class="md-subheading">{{ thread.description }}</span>
    </section>
    <footer class="thread-footer">
      <div class="replies-count">
        <span class="md-title" v-if="Object.keys(thread.replies).length">{{ Object.keys(thread.replies).length }} replies</span>
        <span class="md-title" v-else>No replies. Be the first!</span>
      </div>
      <div class="thread-tags" v-if="thread.tags.length">
        <md-chip class="chip" v-for="tag in thread.tags" :key="tag">{{ tag }}</md-chip>
      </div>
    </footer>
    <section class="thread-replies">
      <div class="send-reply">
        <md-field>
          <label>Type here to reply...</label>
          <md-textarea v-model="reply" @keyup.enter.native="sendReply()"></md-textarea>
        </md-field>
      </div>
      <div class="replies-list">
        <transition-group name="fade-up" tag="div" class="replies">
          <div class="reply" v-for="(reply, i) in thread.replies" :key="`${i}-${reply.thread}`">
            <div class="reply-author">
              <div class="reply-user-avatar">
                <img :src="getReplyAuthor(reply.author).avatar" v-if="getReplyAuthor(reply.author).avatar" alt="avatar"/>
              </div>
              <div class="reply-solution">
                <div class="md-body-2 author">{{ getReplyAuthor(reply.author).name }}</div>
                <md-chip v-if="reply.solution">Best answer</md-chip>
              </div>
              <span class="md-caption">{{ reply.date | formattedDate }}</span>
            </div>
            <div class="reply-main">
              <div class="md-body-2" v-if="reply.reply">@{{ getReplyAuthor(reply.reply).name + ' ' + reply.body }}</div>
              <div class="md-body-2" v-else>{{ reply.body }}</div>
            </div>
            <div class="reply-footer">
              <span class="md-body-1" @click="setReplyToUser(getReplyAuthor(reply.author))">Reply</span>
              <span class="md-body-1" v-if="userIsCreator && !thread.answered" @click="markAsAnswer(reply)">Mark as answer</span>
              <span class="md-body-1" v-if="canDeleteReply(reply)" @click="deleteReply(reply)">Delete</span>
            </div>
          </div>
        </transition-group>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    'id': {
      type: String,
      required: true
    },

    'topic': {
      type: String,
      required: true
    }
  },

  data () {
    return {
      reply: '',
      userReply: null,
      canReplyToUser: true
    }
  },

  methods: {
    editThread (thread) {
      this.$router.push({ name: 'threadedit', params: { id: thread.id, topic: this.topic } })
    },

    deleteThread () {
      if (confirm('Are you sure?')) {
        this.$store.dispatch('deleteThread', this.thread)
          .then(() => {
            this.$router.push({ name: 'forumtopic', params: { id: this.topic } })
          })
      }
    },

    getThreadAuthorName (author) {
      let user = this.$store.getters.users.find(user => user.id === author)
      if (user) {
        return user.name
      }
    },

    getThreadAuthorAvatar (author) {
      let user = this.$store.getters.users.find(user => user.id === author)
      if (user) {
        return user.avatar
      }
    },

    getReplyAuthor (id) {
      return this.$store.getters.users.find(user => user.id === id)
    },

    setReplyToUser (user) {
      if (this.canReplyToUser) {
        let username = '@' + user.name
        this.reply += username
        this.userReply = user.id
      }
      this.canReplyToUser = false
    },

    sendReply () {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let id = ''
      for (let i = 0; i < 20; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      let reply = {
        id: id,
        body: this.reply.replace(/(@\S+)/gi, '').trim(),
        date: new Date(),
        thread: this.id,
        author: this.user.id,
        solution: false,
        reply: this.userReply
      }
      if (this.reply.replace(/\s/g, '').length) {
        this.$store.dispatch('sendReply', reply)
        this.reply = ''
        this.canReplyToUser = true
      }
    },

    deleteReply (reply) {
      if (confirm('Are you sure?')) {
        this.$store.dispatch('deleteReply', {
          reply: reply,
          thread: this.id
        })
      }
    },

    markAsAnswer (reply) {
      if (confirm('Is it solution?')) {
        this.$store.dispatch('markAsAnswer', {
          reply: reply,
          thread: this.thread
        })
      }
    },

    canDeleteReply (reply) {
      return this.checkUser && !this.loading && reply.author === this.user.id
    }
  },

  computed: {
    ...mapGetters(['checkUser', 'loading', 'user']),

    thread () {
      return this.$store.getters.threads.find(thread => thread.id === this.id)
    },

    userIsCreator () {
      return this.checkUser ? this.$store.getters.user.id === this.thread.author : false
    }
  },

  watch: {
    reply () {
      if (!this.reply) {
        this.canReplyToUser = true
        this.userReply = null
      }
    }
  },

  mounted () {
    this.$store.dispatch('loadThreads')
    this.$store.dispatch('loadUsers')
  },

  created () {
    this.$bus.$on('thread:updated', () => {
      this.$store.dispatch('loadThreads')
    })
    this.$bus.$on('userprofile:changed', () => {
      this.$store.dispatch('loadUsers')
    })
  },

  beforeDestroy () {
    this.$bus.$off('thread:updated')
    this.$bus.$off('userprofile:updated')
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/thread.less';
</style>
