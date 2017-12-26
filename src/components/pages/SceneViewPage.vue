<template>
  <div class="scene-viewer-page" v-if="scene">
    <scene-builder :editing-mode="false" :selected-scene="scene"></scene-builder>
  </div>
  <div class="scene-viewer-page" v-else>
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
      appState: appStore.state
    }
  },
  computed: {
    scene () {
      return this.appState.currentScene
    }
  },
  mounted () {
    appStore.setCurrentScene(this.$route.params.hash)
  }
}
</script>

<style lang="scss">
</style>
