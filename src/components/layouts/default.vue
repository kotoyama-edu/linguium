<template>
  <div class="default">
    <md-content class="md-scrollbar">
      <Navbar></Navbar>
      <transition name="component-fade" mode="out-in">
        <router-view />
      </transition>
      <Footer></Footer>
    </md-content>
  </div>
</template>

<script>
import Navbar from '@/components/ui/navbar'
import Footer from '@/components/ui/footer'

export default {
  name: 'Default',
  components: {
    Navbar,
    Footer
  },

  watch: {
    '$route' (to, from) {
      document.title = to.meta.title || 'Linguium'
    }
  }
}
</script>

<style>
.default {
  font-family: 'Poppins', sans-serif;
  text-align: center;
  background-color: #3f3d56;
  color: white;
  min-height: 100vh;
}

.md-chip.md-theme-default.md-clickable:not(.md-disabled):hover,
.md-chip.md-theme-default.md-primary.md-clickable:not(.md-disabled):hover {
  color: white;
  background-color: #448aff;
}

.md-content.md-scrollbar {
  overflow: auto;
  max-height: 100vh;
  background-color: #3f3d56;
  z-index: 10;
  position: relative;
}

.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .2s ease;
}

.component-fade-enter, .component-fade-leave-to {
  opacity: 0;
}

.md-table.md-theme-default .md-table-content {
  background-color: rgb(80,78,100);
}

.md-table-fixed-header {
  width: 100%;
}

.ProseMirror {
  border: 1px solid rgba(255, 255, 255, 0.473);
  border-radius: 5px;
  padding: 0 10px;
  min-height: 208px;
}

.ProseMirror:focus {
  border-radius: 3px;
}

.editor-content p {
  font-size: 18px;
}

.editor-content p code {
  padding: .2rem .4rem;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: 700;
  background: rgba(0,0,0,.1);
  margin: 0 .2rem;
}

.article-content blockquote,
.editor-content blockquote {
  border-left: 3px solid rgba(231, 231, 231, 0.432);
  padding-left: .8rem;
  font-style: italic;
}

.menubar__button.is-active {
  background-color: rgba(0,0,0,.1);
}

.md-snackbar {
  z-index: 1001;
  background-color: #434175 !important;
  color: white !important;
}

.md-list.md-theme-default {
  background-color: #3f3d56;
}

.md-list-item-text {
  white-space: normal;
}
</style>
