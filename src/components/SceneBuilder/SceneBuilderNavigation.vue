<template>
  <div  class="scene-builder-navigation">
    <ul>
      <scene-builder-navigation-card v-for="(object, key) in objects" :object="object" :objectKey="key" :key="key" :class="{active: key === selectedObject}"></scene-builder-navigation-card>
    </ul>
    <div class="controls">
      <button v-if="itemsPlaced > 0" @click="buttonEraseClick">Effacer</button>
      <button @click="buttonImportClick">Importer</button>
      <button v-if="itemsPlaced > 0" @click="buttonExportClick">Exporter</button>
    </div>
  </div>
</template>

<script>
import { appStore } from '../../stores/AppStore'
import { EventBus } from '../../main'
import SceneBuilderNavigationCard from './SceneBuilderNavigationCard'

export default {
  components: {SceneBuilderNavigationCard},
  name: 'scene-builder-navigation',
  props: {
    selectedObject: {type: String, required: true}
  },
  data () {
    return {
      objects: appStore.getObjects(),
      itemsPlaced: 0
    }
  },
  mounted () {
    EventBus.$on('grid.item_removed', () => {
      if (this.itemsPlaced > 0) this.itemsPlaced--
    })
    EventBus.$on('grid.item_added', () => {
      this.itemsPlaced++
    })
  },
  methods: {
    buttonEraseClick () {
      EventBus.$emit('grid.clear')
      this.itemsPlaced = 0
    },
    buttonImportClick () {
      EventBus.$emit('grid.import')
    },
    buttonExportClick () {
      EventBus.$emit('grid.export')
    }
  }
}
</script>

<style lang="scss">
  .scene-builder-navigation {
    position: relative;
    z-index: 9999;
    color: whitesmoke;
    background: rgba(0, 0, 0, 0.42);
    width: 100%;
    padding: 60px;
    display: flex;
    & ul {
      display: flex;
      flex-direction: row;
      padding: 0;
      margin: 0;
      & li {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-right: 40px;
        &.active {
          border: 3px solid red;
        }
        &:last-of-type {
          margin-right: 0;
        }
        & img {
          width: 100px;
          height: 100px;
        }
      }
    }
  }
</style>
