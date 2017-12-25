<template>
  <li @click="setActiveObject(objectKey)" class="scene-builder-navigation-card">
    <img :src="object.imgPath" alt="">
    {{ object.name }}
  </li>
</template>

<script>
import { appStore } from '../../stores/AppStore'

export default {
  name: 'scene-builder-navigation-card',
  props: {
    object: {type: Object, required: true},
    objectKey: {type: String, required: true}
  },
  methods: {
    setActiveObject (key) {
      console.log('cc')
      appStore.setActiveObject(key)
    }
  }
}
</script>

<style lang="scss">

</style>
