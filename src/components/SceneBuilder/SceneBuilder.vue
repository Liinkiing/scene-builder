<template>
  <div id="scene-builder">
  </div>
</template>

<script>
import obj from '../../assets/objects/christmas_tree.obj'
import mtl from '../../assets/objects/christmas_tree.mtl'
import ObjectsManager from '../../Utils/ObjectsManager'
import Grid from './Grid'

let THREE = require('three')
let OrbitControls = require('three-orbit-controls')(THREE)
let frustumSize = 1000

export default {
  name: 'scene-builder',
  mounted () {
    this.container = document.querySelector('#scene-builder')
    let aspect = window.innerWidth / window.innerHeight
    this.camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 2, 9000)
    this.camera.position.y = 400
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xf0f0f0)
    let axesHelper = new THREE.AxisHelper(1000)
    this.scene.add(axesHelper)
    this.grid = new Grid(12)
    this.grid.attachCamera(this.camera)
    this.grid.attachScene(this.scene)
    this.objectManager = new ObjectsManager()
    this.initEventsListeners()
    this.initLights()
    this.loadObjects()
    // eslint-disable-next-line no-unused-vars
    let controls = new OrbitControls(this.camera)
    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.container.appendChild(this.renderer.domElement)

    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    this.onWindowResize()

    this.renderer.animate(this.render.bind(this))
  },
  methods: {
    loadObjects () {
      let objects = require('../../assets/objects/objects')
      Object.keys(objects).forEach(key => {
        this.objectManager.addObject(key, require('../../assets/objects/' + objects[key].mtl), require('../../assets/objects/' + objects[key].obj))
        console.log(this.objectManager)
      })
    },
    initLights () {
      var directionalLight = new THREE.DirectionalLight(0xffffff)
      directionalLight.position.x = 1
      directionalLight.position.y = 1
      directionalLight.position.z = 1
      directionalLight.position.normalize()
      this.scene.add(directionalLight)
    },

    render () {
      this.camera.position.x = 500
      this.camera.position.z = 500
      this.camera.lookAt(this.scene.position)
      this.renderer.render(this.scene, this.camera)
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
    },

    initEventsListeners () {
      this.grid.addEventListener('caseclicked', (e, tile) => {
        if (e.which !== 1) return
        this.objectManager.loadObject('christmas_tree')
          .then(object => {
            this.grid.addObjectToTile(object, tile.userData.tilePosition.x, tile.userData.tilePosition.z)
          })
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
