<template>
  <div class="scene-builder-page">
    <scene-builder :selected-object="appState.selectedObject">
    </scene-builder>
    <scene-builder-navigation :selected-object="appState.selectedObject"></scene-builder-navigation>
    <sweet-modal ref="exportModal" @close="onExportModalClose" icon="success" title="Export réussi">
      <p v-if="exportedScene">
        Voici l'url de votre scène : <router-link :to="{name: 'scene.view', params: {id: exportedScene.id}}">{{ getSceneViewUrl() }}</router-link>
      </p>
    </sweet-modal>
    <sweet-modal ref="failedModal" icon="error" title="Une erreur est survenue...">
      <p>
        Oh non ! :( Une erreur est survenue durant l'exportation de votre scène. Veuillez ré-essayer plus tard.
      </p>
    </sweet-modal>
  </div>
</template>

<script>
import { SweetModal } from 'sweet-modal-vue'
import SceneBuilderNavigation from '../SceneBuilder/SceneBuilderNavigation'
import SceneBuilder from '../SceneBuilder/SceneBuilder'
import { appStore } from '../../stores/AppStore'
import { EventBus } from '../../main'

export default {
  name: 'scene-builder-page',
  components: {
    SceneBuilder,
    SweetModal,
    SceneBuilderNavigation
  },
  methods: {
    onExportModalClose () {
      this.exportedScene = null
    },
    getSceneViewUrl () {
      return window.location.origin + this.$router.resolve({name: 'scene.view', params: {id: this.exportedScene.id}}).route.fullPath
    }
  },
  data () {
    return {
      appState: appStore.state,
      exportedScene: null
    }
  },
  mounted () {
    EventBus.$on('grid.export_failed', error => {
      console.log(error)
      if (this.$refs.failedModal) {
        this.$refs.failedModal.open()
      }
    })
    EventBus.$on('grid.exported', grid => {
      console.log(grid, 'exported')
      this.exportedScene = grid
      if (this.$refs.exportModal) {
        this.$refs.exportModal.open()
      }
    })
  }
}
</script>

<style lang="scss">
</style>
