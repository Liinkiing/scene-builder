<template>
  <div v-if="isLoading">Chargement...</div>
  <div class="scene-viewer-page" v-else-if="scene">
    <scene-builder :editing-mode="false" :selected-scene="scene"></scene-builder>
  </div>
  <div class="scene-viewer-page" v-else-if="!isLoading && !scene">
    <h1>Cette scène n'existe pas !</h1>
  </div>
</template>

<script>
import { appStore } from '../../stores/AppStore'
import SceneBuilder from '../SceneBuilder/SceneBuilder'

export default {
  components: {SceneBuilder},
  name: 'scene-viewer-page',
  data () {
    return {
      appState: appStore.state,
      isLoading: true
    }
  },
  computed: {
    scene () {
      return this.appState.currentScene
    }
  },
  mounted () {
    appStore.setCurrentScene(this.$route.params.hash)
      .then(() => {
        this.isLoading = false
      })
  }
}
</script>

<style lang="scss">
</style>
