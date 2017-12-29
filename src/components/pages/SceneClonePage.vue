<template>
  <div v-if="isLoading">Chargement...</div>
  <div v-else-if="scene" class="scene-clone-page">
    <scene-builder :selected-object="appState.selectedObject" :selected-scene="scene">
    </scene-builder>
    <scene-builder-navigation :selected-object="appState.selectedObject"></scene-builder-navigation>
  </div>
  <div v-else-if="!isLoading && !scene">
    <h2>Impossible de cloner cette scène, car elle n'existe pas !</h2>
  </div>
</template>

<script>
import SceneBuilderNavigation from '../SceneBuilder/SceneBuilderNavigation'
import SceneBuilder from '../SceneBuilder/SceneBuilder'
import { appStore } from '../../stores/AppStore'
import { LS_SAVE_KEY } from '../../main'

export default {
  name: 'scene-clone-page',
  components: {
    SceneBuilder,
    SceneBuilderNavigation
  },
  data () {
    return {
      isLoading: true,
      appState: appStore.state
    }
  },
  computed: {
    scene () {
      return this.appState.currentScene
    }
  },
  mounted () {
    appStore.setCurrentScene(this.$route.params.id)
      .then(() => {
        this.isLoading = false
        if (window.localStorage) {
          window.localStorage.setItem(LS_SAVE_KEY, JSON.stringify(this.scene.data))
          this.$router.replace({
            name: 'homepage'
          })
        }
      })
      .catch(() => {
        this.isLoading = false
      })
  }
}
</script>

<style lang="scss">
</style>
