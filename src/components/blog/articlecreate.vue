<template>
  <div class="container">
    <form novalidate @submit.prevent="sendArticle" @submit.stop.prevent="showSnackbar = true">
      <div class="article-create">
        <div class="column left-side">
          <div class="editor">
            <md-field md-inline :class="getValidationClass('title')">
              <label>Title</label>
              <md-input v-model="article.title" maxlength="40" @change="$v.article.title.$touch()" required></md-input>
              <span class="md-error" v-if="!$v.article.title.required">Field is required.</span>
            </md-field>
            <md-field md-inline :class="getValidationClass('abstract')">
              <label>Short description</label>
              <md-input v-model="article.abstract" maxlength="140" @change="$v.article.abstract.$touch()" required></md-input>
              <span class="md-error" v-if="!$v.article.abstract.required">Field is required.</span>
            </md-field>
            <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
              <div class="menubar">
                <md-button
                  class="menubar__button"
                  :class="{ 'is-active': isActive.bold() }"
                  @click="commands.bold"
                >
                  <md-icon>format_bold</md-icon>
                </md-button>

                <md-button
                  class="menubar__button"
                  :class="{ 'is-active': isActive.italic() }"
                  @click="commands.italic"
                >
                  <md-icon>format_italic</md-icon>
                </md-button>

                <md-button
                  class="menubar__button"
                  :class="{ 'is-active': isActive.strike() }"
                  @click="commands.strike"
                >
                  <md-icon>format_strikethrough</md-icon>
                </md-button>

                <md-button
                  class="menubar__button"
                  :class="{ 'is-active': isActive.underline() }"
                  @click="commands.underline"
                >
                  <md-icon>format_underlined</md-icon>
                </md-button>

                <md-button
                  class="menubar__button"
                  :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                  @click="commands.heading({ level: 1 })"
                >
                  <b>H1</b>
                </md-button>

                <md-button
                  class="menubar__button"
                  :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                  @click="commands.heading({ level: 2 })"
                >
                  <b>H2</b>
                </md-button>

                <md-button
                  class="menubar__button"
                  :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                  @click="commands.heading({ level: 3 })"
                >
                  <b>H3</b>
                </md-button>

                <md-button
                  class="menubar__button"
                  :class="{ 'is-active': isActive.bullet_list() }"
                  @click="commands.bullet_list"
                >
                  <md-icon>format_list_bulleted</md-icon>
                </md-button>

                <md-button
                  class="menubar__button"
                  :class="{ 'is-active': isActive.ordered_list() }"
                  @click="commands.ordered_list"
                >
                  <md-icon>format_list_numbered</md-icon>
                </md-button>

                <md-button
                  class="menubar__button"
                  :class="{ 'is-active': isActive.code() }"
                  @click="commands.code()"
                >
                  <md-icon>code</md-icon>
                </md-button>

                <md-button
                  class="menubar__button"
                  :class="{ 'is-active': isActive.blockquote() }"
                  @click="commands.blockquote"
                >
                  <md-icon>format_quote</md-icon>
                </md-button>

                <md-button
                  class="menubar__button"
                  @click="commands.undo"
                >
                  <md-icon>undo</md-icon>
                </md-button>

                <md-button
                  class="menubar__button"
                  @click="commands.redo"
                >
                  <md-icon>redo</md-icon>
                </md-button>
              </div>
            </editor-menu-bar>
            <editor-content class="editor-content" :editor="editor" />
          </div>
        </div>
        <div class="column right-side">
          <div class="md-title">Article cover</div>
          <md-field>
            <md-file @change.native="getFile" v-model="article.cover.name" placeholder="Upload cover" accept="image/*" />
          </md-field>
          <div class="md-title">Article tags</div>
          <md-chips class="md-primary shake-on-error" v-model="article.tags" md-placeholder="Add tags..." @keydown.enter.native.prevent></md-chips>
          <md-button type="submit" class="md-raised md-primary" :disabled="loading">
            <span v-if="loading">Loading...</span>
            <span v-else>Send</span>
          </md-button>
          <md-button class="md-raised md-primary cancel" @click="cancelCreating()">Cancel</md-button>
        </div>
        <md-snackbar md-position="left" :md-duration="4000" :md-active.sync="showSnackbar" md-persistent>
          <span v-if="submitStatus === 'OK'">Your article has been successfully loaded</span>
          <span v-else>{{ submitStatus }}</span>
        </md-snackbar>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import {
  Blockquote,
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Italic,
  Strike,
  Underline,
  History,
  Code
} from 'tiptap-extensions'

export default {
  mixins: [validationMixin],
  components: {
    EditorContent,
    EditorMenuBar
  },

  validations: {
    article: {
      title: {
        required
      },
      abstract: {
        required
      }
    }
  },

  data () {
    return {
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new Heading({ levels: [1, 2, 3] }),
          new ListItem(),
          new OrderedList(),
          new Bold(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Code()
        ],
        onUpdate: ({ getHTML }) => {
          this.article.description = getHTML()
          if (this.article.description === '<p></p>') {
            this.article.description = ''
          }
          this.getCleanText()
        }
      }),
      showSnackbar: false,
      submitStatus: 'Processing...',
      temp: null,
      article: {
        title: '',
        abstract: '',
        author: null,
        tags: [],
        description: null,
        cover: {},
        date: new Date()
      }
    }
  },

  methods: {
    getValidationClass (fieldName) {
      const field = this.$v.article[fieldName]
      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },

    getFile (e) {
      this.article.cover = e.target.files[0]
    },

    getCleanText () {
      let separators = ['!', '?', ':', ';', '.', ',']
      this.temp = this.article.description
        .replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '')

      for (let i = 0; i < separators.length; i++) {
        let rg = new RegExp('\\' + separators[i], 'g')
        this.temp = this.temp.replace(rg, separators[i] + ' ')
      }
      this.temp = this.temp.replace(/\s+/g, ' ').replace(/\n/g, ' ')
    },

    cancelCreating () {
      this.$router.push({ name: 'articlelist' })
    },

    sendArticle () {
      this.$v.$touch()
      const article = {
        title: this.article.title,
        abstract: this.article.abstract,
        author: this.article.author,
        tags: this.article.tags,
        description: this.article.description,
        cover: this.article.cover,
        date: this.article.date,
        wordsCount: this.temp.split(' ').length
      }

      if (this.cannotSendArticle) {
        this.submitStatus = 'The title, abstract and description of your article should not be empty'
      } else {
        this.$store.dispatch('sendArticle', article)
          .then(() => {
            this.submitStatus = 'OK'
            this.$router.push({ name: 'articlelist' })
          })
          .catch(err => {
            this.submitStatus = err.message
          })
      }
    }
  },

  created () {
    this.article.author = this.user.id
  },

  computed: {
    ...mapGetters(['user', 'loading']),

    cannotSendArticle () {
      return !this.article.description || !this.article.title || !this.article.abstract
    }
  },

  beforeDestroy () {
    this.editor.destroy()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/articlecreate.less';
</style>
