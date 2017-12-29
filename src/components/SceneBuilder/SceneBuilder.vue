<template>
  <div id="scene-builder">
  </div>
</template>

<script>
  /* eslint-disable */

import EffectComposer, { RenderPass, ShaderPass, CopyShader } from 'three-effectcomposer-es6'
import Grid from './Grid'
import { EventBus, LS_SAVE_KEY } from '../../main'
import { sceneSerializer } from '../../utils/SceneSerializer'
import { objectManager } from '../../utils/ObjectsManager'
import { apiWrapper } from '../../utils/ApiWrapper'
let THREE = require('three')
import './THREEMadness'
// let OrbitControls = require('three-orbit-controls')(THREE)
let frustumSize = 1000

export default {
  name: 'scene-builder',
  props: {
    selectedObject: {type: String},
    editingMode: {type: Boolean, default: true},
    selectedScene: {type: Object, default: null}
  },
  destroyed () {
    while(this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.renderer.dispose()
  },
  mounted () {
    this.container = document.querySelector('#scene-builder')
    let aspect = window.innerWidth / window.innerHeight
    this.camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 0.1, 9000)
    this.camera.position.y = 400
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('cyan')
    if (this.editingMode) {
      let gridHelper = new THREE.GridHelper(10000, 100)
      let axesHelper = new THREE.AxisHelper(1000)
      this.scene.add(axesHelper, gridHelper)
    }
    this.grid = new Grid(12, {
      activeColor: 'red',
      editionEnabled: this.editingMode
    })
    this.grid.attachCamera(this.camera)
    this.grid.attachScene(this.scene)
    window.THREE = THREE
    window.scene = this.scene
    if (this.editingMode) {
      EventBus.$on('grid.clear', () => {
        this.grid.clearGrid()
        this.clearLocalStorage()
      })
      EventBus.$on('grid.export', () => { this.exportGrid() })
      this.grid.updateSelectedObject(this.selectedObject)
      this.initEventsListeners()
    }
    this.initLights()
    if (this.selectedScene) {
      console.log(this.selectedScene.data)
      this.grid.load(this.selectedScene.data)
      this.theta = 0
    }
    if (this.editingMode && window.localStorage.getItem(LS_SAVE_KEY)) {
      let gridData = JSON.parse(window.localStorage.getItem(LS_SAVE_KEY));
      this.grid.load(gridData)
    }
    // let controls = new OrbitControls(this.camera)
    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))

    this.copyPass = new ShaderPass(CopyShader)
    this.composer.addPass(this.copyPass)
    this.fxaaPass = new ShaderPass(THREE.FXAAShader)
    this.fxaaPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight)
    this.fxaaPass.renderToScreen = true
    this.composer.addPass(this.fxaaPass)

    if (!this.editingMode) {
      this.bloomPass = new THREE.UnrealBloomPass({x: window.innerWidth, y: window.innerHeight}, 2, 0.57, 0.80)
      this.bloomPass.renderToScreen = true
      this.composer.addPass(this.bloomPass)
    }

    this.container.appendChild(this.renderer.domElement)

    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    this.onWindowResize()

    this.render()
  },
  watch: {
    selectedObject(newVal) {
      this.grid.updateSelectedObject(newVal)
    }
  },
  methods: {
    exportGrid () {
      let dataGrid = sceneSerializer.serialize(this.grid)
      apiWrapper.post('scenes', { data: dataGrid })
        .then(data => {
          EventBus.$emit('grid.exported', data)
        })
        .catch(error => {
          EventBus.$emit('grid.export_failed', error)
        })
    },
    initLights () {
      var directionalLight = new THREE.DirectionalLight(0xffffff)
      directionalLight.name = 'Light'
      directionalLight.position.x = 1
      directionalLight.position.y += 1
      directionalLight.position.z = 1
      // directionalLight.position.normalize()
      this.scene.add(directionalLight)
    },

    render () {
      this.rafId = requestAnimationFrame(this.render.bind(this))
      if (!this.editingMode) {
        this.theta += 0.0005
        this.camera.position.x = 1000 * Math.cos(this.theta)
        this.camera.position.z = 1000 * Math.sin(this.theta)
        this.camera.lookAt(this.scene.position)
      } else {
        this.camera.position.x = 500
        this.camera.position.z = 500
        this.camera.lookAt(this.scene.position)
      }
      this.composer.render(this.scene, this.camera)
      this.grid.render()
    },

    onWindowResize () {
      let aspect = window.innerWidth / window.innerHeight

      this.camera.left = -frustumSize * aspect / 2
      this.camera.right = frustumSize * aspect / 2
      this.camera.top = frustumSize / 2
      this.camera.bottom = -frustumSize / 2

      this.camera.updateProjectionMatrix()

      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.fxaaPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight)
    },

    saveToLocalStorage () {
      let dataGrid = sceneSerializer.serialize(this.grid)
      window.localStorage.setItem(LS_SAVE_KEY, JSON.stringify(dataGrid))
      console.log(dataGrid, 'SAVED ')
    },

    clearLocalStorage () {
      window.localStorage.removeItem(LS_SAVE_KEY)
    },

    initEventsListeners () {
      window.onbeforeunload = () => {
        this.saveToLocalStorage()
      }
      this.grid.addEventListener('caseclicked', (e, tile) => {
        let childrens = tile.children.filter(child => !child.name.includes('preview'));
        if (e.which === 3 && childrens.length > 0) {
          tile.children = []
          console.log('SUPPRIME')
          EventBus.$emit('grid.item_removed')
          return
        }
        if (e.which !== 1) return
        if (childrens.length > 0) {
          if (childrens[0].name !== this.selectedObject) {
            tile.children = []
            objectManager.loadObject(this.selectedObject)
              .then(object => {
                object.name = this.selectedObject
                this.grid.addObjectToTile(object, tile)
              })
          }
        } else {
          objectManager.loadObject(this.selectedObject)
            .then(object => {
              EventBus.$emit('grid.item_added')
              object.name = this.selectedObject
              this.grid.addObjectToTile(object, tile)
              this.grid.lastObjectRotation = object.rotation
            })
        }
      })
      this.grid.addEventListener('editing', (e, tile) => {
        let deltaX = e.clientX - this.grid.lastMousePosition.x
        this.grid.lastMousePosition.x = e.clientX
        this.grid.lastMousePosition.y = e.clientY
        if (tile.children.length > 0) {
          tile.children[0].rotateY(deltaX / 100)
        }
      })
    }
  }
}
</script>

<style lang="scss">
  #scene-builder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
