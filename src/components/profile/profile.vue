<template>
<div class="container">
  <div class="userprofile">
    <aside class="column account-info">
      <div class="profile-pic" v-if="userAvatar">
        <img class="avatar" :src="userAvatar" loading="eager" alt="userpic"/>
      </div>
      <div class="profile-description">
        <h1 class="username">{{ userName }}</h1>
        <p>Joined {{ getUserCreatedDate | formattedDate }}</p>
      </div>
      <md-list class="profile-actions">
        <md-list-item md-expand :md-expanded.sync="expand">
          <md-icon>description</md-icon>
          <span class="md-list-item-text">Personal data</span>

          <md-list slot="md-expand">
            <md-list-item class="md-inset" @click="toggle('Userwords')">Words</md-list-item>
            <md-list-item class="md-inset" @click="toggle('Userbooks')">Books</md-list-item>
          </md-list>
        </md-list-item>

        <md-list-item @click="toggle('Settings')">
          <md-icon>settings</md-icon>
          <span class="md-list-item-text">Settings</span>
        </md-list-item>
      </md-list>
    </aside>
    <section class="column userdata">
      <transition name="component-fade" mode="out-in">
        <component :is="component" />
      </transition>
    </section>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Userwords from '@/components/profile/userwords'
import Userbooks from '@/components/profile/userbooks'
import Settings from '@/components/profile/settings'

export default {
  data () {
    return {
      expand: true,
      component: 'Userwords'
    }
  },

  methods: {
    toggle (value) {
      this.component = value
    }
  },

  computed: {
    ...mapGetters(['userName', 'userAvatar', 'registrationDate']),

    getUserCreatedDate () {
      return new Date(this.registrationDate)
    }
  },

  components: {
    Userwords,
    Userbooks,
    Settings
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/userprofile.less';
</style>
