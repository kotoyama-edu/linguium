<template>
  <div class="page-container md-layout-column">
    <md-toolbar class="md-medium" md-elevation="0">
      <md-button class="md-icon-button" @click="toggle()">
        <md-icon>menu</md-icon>
      </md-button>
      <span class="md-title"><router-link to="/">linguium app</router-link></span>
      <div class="md-toolbar-section-start">
        <Menu></Menu>
      </div>

      <div class="md-toolbar-section-end">
        <md-button v-if="!userIsAuth" class ="button-auth" to="/login">Login</md-button>
        <md-button v-if="!userIsAuth" class ="button-auth" to="/signup">Sign Up</md-button>
        <div class="logout">
          <md-button v-if="userIsAuth" class ="button-auth" @click.prevent="logout">Sign Out</md-button>
        </div>
      </div>
    </md-toolbar>

    <md-content class="md-transparent">
      <transition name="slide">
      <div class="full-control" v-if="showNavigation">
        <div class="list">
          <md-list>
            <md-list-item v-if="userIsAuth">
              <md-icon>school</md-icon>
              <span class="md-list-item-text"><router-link to="/books">Books</router-link></span>
            </md-list-item>

            <md-list-item v-if="userIsAuth">
              <md-icon>description</md-icon>
              <span class="md-list-item-text"><router-link to="/blog">Blog</router-link></span>
            </md-list-item>

            <md-list-item v-if="userIsAuth">
              <md-icon>forum</md-icon>
              <span class="md-list-item-text"><router-link to="/forum">Forum</router-link></span>
            </md-list-item>

            <md-list-item v-if="userIsAuth">
              <md-icon>account_circle</md-icon>
              <span class="md-list-item-text"><router-link to="/myprofile">My Profile</router-link></span>
            </md-list-item>

            <md-list-item v-if="!userIsAuth">
              <md-icon>input</md-icon>
              <span class="md-list-item-text"><router-link to="/login">Sign In</router-link></span>
            </md-list-item>

            <md-list-item v-if="!userIsAuth">
              <md-icon>lock_open</md-icon>
              <span class="md-list-item-text"><router-link to="/signup">Sign Up</router-link></span>
            </md-list-item>

            <md-list-item v-if="userIsAuth" @click="logout">
              <md-icon>exit_to_app</md-icon>
              <span class="md-list-item-text">Log Out</span>
            </md-list-item>
          </md-list>
        </div>
      </div>
    </transition>
    </md-content>
  </div>
</template>

<script>
import Menu from '@/components/ui/Menu'
export default {
  components: {
    Menu
  },
  data: () => ({
    showNavigation: false
  }),
  methods: {
    toggle () {
      this.showNavigation = !this.showNavigation
    },
    logout () {
      this.$store.dispatch('logout')
      this.$router.push('/login')
    }
  },
  watch: {
    '$route' () {
      this.showNavigation = false
    }
  },
  computed: {
    userIsAuth () {
      return this.$store.getters.checkUser
    },
    user () {
      return this.$store.getters.user
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/ui/navbar.less';
@import '~@/assets/less/ui/button.less';
</style>
