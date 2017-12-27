import Vue from 'vue'
import Router from 'vue-router'
import SceneBuilderPage from '../components/pages/SceneBuilderPage'
import SceneViewPage from '../components/pages/SceneViewPage'
import ErrorPage from '../components/pages/ErrorPage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: SceneBuilderPage
    },
    {
      path: '/view/:id',
      name: 'scene.view',
      component: SceneViewPage
    },
    {path: '*', name: 'error', component: ErrorPage}
  ]
})
