<template>
  <div class="scene-builder-page">
    <scene-builder-navigation :selected-object="appState.selectedObject"></scene-builder-navigation>
    <scene-builder :selected-object="appState.selectedObject"></scene-builder>
  </div>
</template>

<script>
  import SceneBuilderNavigation from '../SceneBuilder/SceneBuilderNavigation'
  import SceneBuilder from '../SceneBuilder/SceneBuilder'
  import { appStore } from '../../stores/AppStore'

export default {
    name: 'scene-builder-page',
    components: {
      SceneBuilder,
      SceneBuilderNavigation
    },
    data () {
      return {
        appState: appStore.state
      }
    },
    mounted () {
    }
}
</script>

<style lang="scss">
</style>
