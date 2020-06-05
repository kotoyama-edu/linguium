<template>
  <div class="container">
    <section class="topics">
      <div v-if="filteredThreads.length">
        <div class="thread" v-for="thread in filteredThreads" :key="thread.id" @click="getDetails(thread)">
          <header class="thread-header">
            <div class="thread-title">
              <span class="md-title">{{ thread.title }}</span>
              <md-icon v-if="thread.answered">check_box</md-icon>
            </div>
            <div class="thread-replies">
              <md-icon>chat_bubble</md-icon>
              <span>{{ Object.keys(thread.replies).length }}</span>
            </div>
          </header>
          <div class="thread-main">
            <span class="md-body-1" v-if="thread.description.length > 80">{{ thread.description.substring(0, 80) + ' . . .' }}</span>
            <span class="md-body-1" v-else>{{ thread.description }}</span>
          </div>
          <div class="thread-footer">
            <div class="thread-author-avatar">
              <img :src="getThreadAuthorAvatar(thread.author)" alt="avatar"/>
            </div>
            <span>{{ getThreadAuthorName(thread.author) }}</span>
            <span class="md-caption">asked {{ thread.date | formattedDate }}</span>
            <div class="thread-tags">
              <md-chip class="chip" v-for="tag in thread.tags" :key="tag">{{ tag }}</md-chip>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <md-icon class="md-size-5x">find_in_page</md-icon>
        <h1>No such threads</h1>
        <p>Здесь будут отображаться все найденные треды.</p>
      </div>
    </section>
    <section class="actions-list">
      <md-list class="threads-filters">
        <md-list-item @click="toggle('all')">
          <md-icon>dashboard</md-icon>
          <span class="md-list-item-text">All threads</span>
        </md-list-item>

        <md-list-item @click="toggle('my')">
          <md-icon>description</md-icon>
          <span class="md-list-item-text">My threads</span>
        </md-list-item>

        <md-list-item @click="toggle('solved')">
          <md-icon>check_circle</md-icon>
          <span class="md-list-item-text">Solved</span>
        </md-list-item>

        <md-list-item @click="toggle('unsolved')">
          <md-icon>cancel</md-icon>
          <span class="md-list-item-text">Unsolved</span>
        </md-list-item>
      </md-list>
      <md-button class="md-raised md-primary" @click="createThread()">Create thread</md-button>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    'topic': {
      type: String,
      required: true
    }
  },

  data () {
    return {
      type: 'all'
    }
  },

  methods: {
    createThread () {
      this.$router.push({ name: 'threadcreate' })
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

    getDetails (thread) {
      this.$router.push(
        { name: 'thread', params: { id: thread.id } }
      )
    },

    toggle (type) {
      this.type = type
    }
  },

  computed: {
    ...mapGetters(['threads', 'user']),

    filteredThreads () {
      let threads = this.threads.filter(thread => thread.topic === this.topic)
      if (this.type === 'my') {
        threads = threads.filter(thread => thread.author === this.user.id)
      }
      if (this.type === 'solved') {
        threads = threads.filter(thread => thread.answered === true)
      }
      if (this.type === 'unsolved') {
        threads = threads.filter(thread => thread.answered === false)
      }
      return threads
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
    this.$bus.$off('userprofile:changed')
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/forumtopic.less';
</style>
