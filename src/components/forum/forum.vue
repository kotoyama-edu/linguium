<template>
  <div class="container">
    <section class="threads">
      <md-list class="md-triple-line">
        <md-list-item :md-ripple="false" @click="getForumTopic('general')">
          <md-icon>forum</md-icon>
          <div class="md-list-item-text">
            <span class="md-headline">General Discussion</span>
            <p>Topics that don't need a category, or don't fit into any other existing category.</p>
          </div>
          <div class="stats">
            <span class="md-headline">{{ filterByTopic('general').length }}</span>
            <span class="md-body-1">overall threads</span>
          </div>
        </md-list-item>

        <md-divider class="md-inset"></md-divider>

        <md-list-item :md-ripple="false" @click="getForumTopic('help')">
          <md-icon>help</md-icon>
          <div class="md-list-item-text">
            <span class="md-headline">Get Help</span>
            <p>Got stuck? Get help from other users here.</p>
          </div>
          <div class="stats">
            <span class="md-headline">{{ filterByTopic('help').length }}</span>
            <span class="md-body-1">overall threads</span>
          </div>
        </md-list-item>

        <md-divider class="md-inset"></md-divider>

        <md-list-item :md-ripple="false" @click="getForumTopic('introductions')">
          <md-icon>whatshot</md-icon>
          <div class="md-list-item-text">
            <span class="md-headline">Introductions</span>
            <p>New to the community? Stop by, say hi and tell us a bit about yourself.</p>
          </div>
          <div class="stats">
            <span class="md-headline">{{ filterByTopic('introductions').length }}</span>
            <span class="md-body-1">overall threads</span>
          </div>
        </md-list-item>

        <md-divider class="md-inset"></md-divider>

        <md-list-item :md-ripple="false" @click="getForumTopic('feedback')">
          <md-icon>feedback</md-icon>
          <div class="md-list-item-text">
            <span class="md-headline">Feedback</span>
            <p>Discussion about this site, how it works, and how we can improve it.</p>
          </div>
          <div class="stats">
            <span class="md-headline">{{ filterByTopic('feedback').length }}</span>
            <span class="md-body-1">overall threads</span>
          </div>
        </md-list-item>
      </md-list>

    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  methods: {
    getForumTopic (topic) {
      this.$router.push(
        { name: 'forumtopic', params: { topic: topic } }
      )
    },

    filterByTopic (topic) {
      return this.threads.filter(thread => thread.topic === topic)
    }
  },

  mounted () {
    this.$store.dispatch('loadThreads')
  },

  computed: {
    ...mapGetters(['threads'])
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/forum.less';
</style>
