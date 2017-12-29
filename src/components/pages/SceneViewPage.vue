<template>
  <div v-if="isLoading">Chargement...</div>
  <div class="scene-viewer-page" v-else-if="scene">
    <scene-builder :editing-mode="false" :selected-scene="scene"></scene-builder>
    <div class="controls">
      <button @click="cloneScene()">Créer une scène à partir de celle ci</button>

    </div>
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
  methods: {
    cloneScene () {
      this.$router.push({
        name: 'scene.clone',
        params: {
          id: this.scene.id
        }
      })
    }
  },
  mounted () {
    appStore.setCurrentScene(this.$route.params.id)
      .then(() => {
        this.isLoading = false
      })
      .catch(() => {
        this.isLoading = false
      })
  }
}
</script>

<style lang="scss">
  .scene-viewer-page {
    & .controls {
      position: fixed;
      margin: 40px;
      left:0;
      top:0;
      z-index: 9000;
      padding: 40px;
      background: rgba(0, 0, 0, 0.73);
    }
  }
</style>
