<template>
  <div>
    <md-tabs class="md-transparent md-primary" v-if="userIsAuth" md-sync-route>
      <md-tab id="tab-blog" md-label="blog" to="/blog"></md-tab>
      <md-tab id="tab-forum" md-label="forum" to="/forum"></md-tab>
      <md-tab id="tab-books" md-label="books" to="/books"></md-tab>
      <md-tab id="tab-account" md-label="profile" to="/myprofile"></md-tab>
    </md-tabs>
  </div>
</template>

<script>
export default {
  computed: {
    userIsAuth () {
      return this.$store.getters.checkUser
    }
  }
}
</script>
