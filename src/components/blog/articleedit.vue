<template>
  <div class="container">
    <form novalidate @submit.prevent="editArticle" @submit.stop.prevent="showSnackbar = true">
      <div class="article-create">
        <div class="column left-side">
          <div class="editor">
            <md-field md-inline :class="getValidationClass('editedTitle')">
              <label>New title</label>
              <md-input v-model="editedTitle" maxlength="40" @change="$v.editedTitle.$touch()" required></md-input>
              <span class="md-error" v-if="!$v.editedTitle.required">Field is required.</span>
            </md-field>
            <md-field md-inline :class="getValidationClass('editedAbstract')">
              <label>New short description</label>
              <md-input v-model="editedAbstract" maxlength="140" @change="$v.editedAbstract.$touch()" required></md-input>
              <span class="md-error" v-if="!$v.editedAbstract.required">Field is required.</span>
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
            <md-file @change.native="getFile" v-model="editedCover.name" placeholder="Upload new cover" accept="image/*" />
          </md-field>
          <div class="md-title">Article tags</div>
          <md-chips class="md-primary shake-on-error" v-model="editedTags" md-placeholder="Add tags..." @keydown.enter.native.prevent></md-chips>
          <md-button type="submit" class="md-raised md-primary" :disabled="loading">
            <span v-if="loading">Loading...</span>
            <span v-else>Update</span>
          </md-button>
          <md-button class="md-raised md-primary cancel" @click="cancelEditing()">Cancel</md-button>
        </div>
        <md-snackbar md-position="left" :md-duration="4000" :md-active.sync="showSnackbar" md-persistent>
          <span v-if="submitStatus === 'OK'">Your article has been successfully edited</span>
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
  props: {
    'id': {
      type: String,
      required: true
    }
  },

  mixins: [validationMixin],
  components: {
    EditorContent,
    EditorMenuBar
  },

  validations: {
    editedTitle: {
      required
    },
    editedAbstract: {
      required
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
          this.editedDescription = getHTML()
          if (this.editedDescription === '<p></p>') {
            this.editedDescription = ''
          }
          this.getCleanText()
        }
      }),
      showSnackbar: false,
      submitStatus: 'Processing...',
      temp: null,
      editedTitle: '',
      editedAbstract: '',
      editedTags: [],
      editedDescription: null,
      editedCover: {}
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

    getFile (e) {
      this.editedCover = e.target.files[0]
    },

    getCleanText () {
      let separators = ['!', '?', ':', ';', '.', ',']
      this.temp = this.editedDescription
        .replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '')

      for (let i = 0; i < separators.length; i++) {
        let rg = new RegExp('\\' + separators[i], 'g')
        this.temp = this.temp.replace(rg, separators[i] + ' ')
      }
      this.temp = this.temp.replace(/\s+/g, ' ').replace(/\n/g, ' ')
    },

    cancelEditing () {
      this.$router.push('/blog/article/' + this.article.id)
    },

    editArticle () {
      this.$v.$touch()
      const editedArticle = {
        id: this.article.id,
        title: this.editedTitle,
        abstract: this.editedAbstract,
        tags: this.editedTags,
        description: this.editedDescription,
        cover: this.editedCover,
        wordsCount: this.temp.split(' ').length
      }

      if (this.cannotEditArticle) {
        this.submitStatus = 'The title, abstract and description of your article should not be empty'
      } else if (!this.userIsCreator) {
        this.submitStatus = 'firestore: PERMISSION_DENIED'
      } else {
        this.$store.dispatch('editArticle', editedArticle)
          .then(() => {
            this.submitStatus = 'OK'
          })
          .then(() => {
            this.$router.push('/blog/article/' + this.article.id)
          })
          .catch(err => {
            this.submitStatus = err.message
          })
      }
    }
  },

  created () {
    this.editedTitle = this.article.title
    this.editedAbstract = this.article.abstract
    this.editedTags = this.article.tags
    this.editor.setContent(this.article.description)
    this.editedDescription = this.article.description
    this.getCleanText()
  },

  computed: {
    ...mapGetters(['loading', 'checkUser']),

    cannotEditArticle () {
      return !this.editedDescription || !this.editedTitle || !this.editedAbstract
    },

    userIsCreator () {
      return this.checkUser ? this.$store.getters.user.id === this.article.author : false
    },

    article () {
      return this.$store.getters.articles.find(article => article.id === this.id)
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
