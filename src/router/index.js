import Vue from 'vue'
import Router from 'vue-router'
import Store from '@/store'

import StartPage from '@/components/startpage'
import Article from '@/components/blog/article'
import ArticleList from '@/components/blog/articleList'
import ArticleCreate from '@/components/blog/articlecreate'
import ArticleEdit from '@/components/blog/articleedit'
import Forum from '@/components/forum/forum'
import ForumTopic from '@/components/forum/forumtopic'
import Thread from '@/components/forum/thread'
import ThreadCreate from '@/components/forum/threadcreate'
import ThreadEdit from '@/components/forum/threadedit'
import Book from '@/components/books/book'
import BookList from '@/components/books/booklist'
import BookPart from '@/components/books/bookpart'
import WordsTrainer from '@/components/trainer'
import Profile from '@/components/profile/profile'
import Login from '@/components/auth/login'
import SignUp from '@/components/auth/signUp'
import NotFound from '@/components/notfound'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'startpage',
      component: StartPage,
      meta: {
        title: 'Linguium'
      }
    },
    {
      path: '/myprofile',
      name: 'profile',
      component: Profile,
      meta: {
        title: 'My profile - Linguium',
        authRequired: true
      }
    },
    {
      path: '/blog',
      name: 'articlelist',
      component: ArticleList,
      meta: {
        title: 'Blog - Linguium',
        authRequired: true
      }
    },
    {
      path: '/blog/article/:id',
      name: 'article',
      component: Article,
      props: true,
      meta: {
        title: 'Article - Linguium',
        authRequired: true
      }
    },
    {
      path: '/blog/create',
      name: 'articlecreate',
      component: ArticleCreate,
      meta: {
        title: 'Create Article - Linguium',
        authRequired: true
      }
    },
    {
      path: '/blog/article/:id/edit',
      name: 'articleedit',
      component: ArticleEdit,
      props: true,
      meta: {
        title: 'Edit Article - Linguium',
        authRequired: true
      }
    },
    {
      path: '/forum',
      name: 'forum',
      component: Forum,
      meta: {
        title: 'Forum - Linguium',
        authRequired: true
      }
    },
    {
      path: '/forum/:topic',
      name: 'forumtopic',
      component: ForumTopic,
      props: true,
      meta: {
        title: 'Forum Topic - Linguium',
        authRequired: true
      }
    },
    {
      path: '/forum/:topic/create',
      name: 'threadcreate',
      component: ThreadCreate,
      props: true,
      meta: {
        title: 'Create Thread - Linguium',
        authRequired: true
      }
    },
    {
      path: '/forum/:topic/:id',
      name: 'thread',
      component: Thread,
      props: true,
      meta: {
        title: 'Forum Thread - Linguium',
        authRequired: true
      }
    },
    {
      path: '/forum/:topic/:id/edit',
      name: 'threadedit',
      component: ThreadEdit,
      props: true,
      meta: {
        title: 'Edit Thread - Linguium',
        authRequired: true
      }
    },
    {
      path: '/books',
      name: 'booklist',
      component: BookList,
      meta: {
        title: 'Book List - Linguium',
        authRequired: true
      }
    },
    {
      path: '/books/:id',
      name: 'book',
      component: Book,
      props: true,
      meta: {
        title: 'Book - Linguium',
        authRequired: true
      }
    },
    {
      path: '/books/:bookId/:partId',
      name: 'bookpart',
      component: BookPart,
      props: true,
      meta: {
        layout: 'read-mode',
        refresh: true,
        authRequired: true
      }
    },
    {
      path: '/words/training',
      name: 'trainer',
      component: WordsTrainer,
      meta: {
        layout: 'trainer-mode',
        refresh: true,
        authRequired: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: 'Login - Linguium'
      }
    },
    {
      path: '/signup',
      name: 'signUp',
      component: SignUp,
      meta: {
        title: 'Sign Up - Linguium'
      }
    },
    {
      path: '*',
      component: NotFound,
      meta: {
        title: 'Not Found',
        layout: 'read-mode',
        refresh: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  Store.dispatch('initAuth')
    .then((user) => {
      if (to.matched.some(route => route.meta.authRequired)) {
        return user ? next() : next('/login')
      }
      return next()
    })
})

router.beforeEach((to, from, next) => {
  if (from.meta.refresh) {
    window.location.href = to.path
    return
  }
  next()
})

export default router
