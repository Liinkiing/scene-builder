import Vue from 'vue'
import Router from 'vue-router'
import SceneBuilderPage from '../components/pages/SceneBuilderPage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: SceneBuilderPage
    }
  ]
})
