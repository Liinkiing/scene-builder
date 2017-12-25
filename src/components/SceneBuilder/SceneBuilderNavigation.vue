<template>
  <div  class="scene-builder-navigation">
    <ul>
      <scene-builder-navigation-card v-for="(object, key) in objects" :object="object" :objectKey="key" :class="{active: key === selectedObject}"></scene-builder-navigation-card>
    </ul>
  </div>
</template>

<script>
import { appStore } from '../../stores/AppStore'
import SceneBuilderNavigationCard from './SceneBuilderNavigationCard'

export default {
  components: {SceneBuilderNavigationCard},
  name: 'scene-builder-navigation',
  props: {
    selectedObject: {type: String, required: true}
  },
  data () {
    return {
      objects: appStore.getObjects()
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
