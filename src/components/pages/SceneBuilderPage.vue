<template>
  <div class="scene-builder-page">
    <scene-builder :selected-object="appState.selectedObject">
    </scene-builder>
    <scene-builder-navigation :selected-object="appState.selectedObject"></scene-builder-navigation>
    <sweet-modal ref="exportModal" @close="onExportModalClose" icon="success" title="Export réussi">
      <p v-if="exportedGrid">
        Voici l'url de votre scène : <router-link :to="{name: 'scene.view', params: {hash: exportedGrid.hash}}">{{ getSceneViewUrl() }}</router-link>
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
      this.exportedGrid = null
    },
    getSceneViewUrl () {
      return window.location.origin + this.$router.resolve({name: 'scene.view', params: {hash: this.exportedGrid.hash}}).route.fullPath
    }
  },
  data () {
    return {
      appState: appStore.state,
      exportedGrid: null
    }
  },
  mounted () {
    EventBus.$on('grid.exported', (grid) => {
      console.log(grid, 'exported')
      this.exportedGrid = grid
      this.$refs.exportModal.open()
    })
  }
}
</script>

<style lang="scss">
</style>
