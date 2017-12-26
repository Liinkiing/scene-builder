import { objectManager } from '../../utils/ObjectsManager'
let THREE = require('three')

export default class Grid extends THREE.Object3D {
  constructor (size = 20, options) {
    super()
    let defaults = {
      cubeSize: 100,
      hoverColor: 'yellow',
      activeColor: 'violet',
      defaultColor: 'red',
      editionEnabled: true
    }
    this.editingTile = null
    this.lastMousePosition = {x: 0, y: 0}
    this.options = Object.assign({}, defaults, options)
    this.gridHelper = new THREE.GridHelper(10000, 100)
    this.container = new THREE.Group()
    this.container.name = 'Floor'
    this.size = size
    this.listeners = []
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    if (this.options.editionEnabled) {
      document.querySelector('#scene-builder').addEventListener('mousemove', this.onMouseMove.bind(this), false)
      document.querySelector('#scene-builder').addEventListener('mousedown', this.onMouseDown.bind(this), false)
      document.querySelector('#scene-builder').addEventListener('mouseup', () => { this.editingTile = null }, false)
    }
  }

  init () {
    for (let x = -(Math.abs(this.size / 2)); x < Math.abs(this.size / 2); x++) {
      for (let z = -(Math.abs(this.size / 2)); z < Math.abs(this.size / 2); z++) {
        let geometry = new THREE.BoxGeometry(this.options.cubeSize, this.options.cubeSize, this.options.cubeSize)
        let material = new THREE.MeshStandardMaterial({
          color: 'red',
          overdraw: 0.5,
          roughness: 0.4,
          metalness: 0
        })
        let cube = new THREE.Mesh(geometry, material)
        let posX, posY, posZ
        [posX, posY, posZ] = [x * this.options.cubeSize + (this.options.cubeSize / 2), -(this.options.cubeSize / 2), z * this.options.cubeSize + (this.options.cubeSize / 2)]
        cube.position.x = posX
        cube.position.y = posY
        cube.position.z = posZ
        cube.name = `Tile (${posX}, ${posY}, ${posZ})`
        cube.userData['tag'] = 'FLOOR'
        cube.userData['active'] = false
        cube.userData['tilePosition'] = {x, z}
        this.container.add(cube)
      }
    }
    this.scene.add(this.container)
  }

  clearGrid () {
    this.container.children
      .filter(child => child.children.length > 0)
      .forEach(child => { child.children = []; child.userData.active = false })
  }

  onMouseMove (e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    if (this.editingTile && this.listeners['editing'] && this.listeners['editing'].length > 0) {
      this.listeners['editing'].forEach(listener => { listener(e, this.editingTile) })
    }
  }

  addObjectToTile (object, tile) {
    let posY = this.options.cubeSize
    // [posX, posY, posZ] = [tile.userData.tilePosition.x * this.options.cubeSize + (this.options.cubeSize / 2), , tile.userData.tilePosition.z * this.options.cubeSize + (this.options.cubeSize / 2)]
    object.position.x = 0
    object.position.y = posY + (object.userData.yOffset || 0)
    object.position.z = 0
    tile.add(object)
    tile.userData.active = true
  }

  onMouseDown (e) {
    this.lastMousePosition = {x: e.clientX, y: e.clientY}
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    this.raycaster.setFromCamera(this.mouse, this.camera)
    let intersects = this.raycaster.intersectObjects(this.container.children)
    for (let i = 0; i < intersects.length; i++) {
      if (i === 0 && 'tag' in intersects[i].object.userData && intersects[i].object.userData.tag === 'FLOOR') {
        if (e.which === 1) {
          intersects[i].object.userData['active'] = true
          this.editingTile = intersects[i].object
        } else if (e.which === 3) {
          intersects[i].object.children = []
          this.editingTile = null
          intersects[i].object.userData['active'] = false
        }
        if (this.listeners['caseclicked'] && this.listeners['caseclicked'].length > 0) {
          this.listeners['caseclicked'].forEach(listener => { listener(e, intersects[i].object) })
        }
      }
    }
  }

  attachCamera (camera) {
    this.camera = camera
  }

  attachScene (scene) {
    this.scene = scene
    this.scene.add(this.gridHelper)
    this.init()
  }

  render () {
    if (!this.options.editionEnabled) return
    this.raycaster.setFromCamera(this.mouse, this.camera)
    let intersects = this.raycaster.intersectObjects(this.container.children)
    this.container.children
      .filter(tile => !tile.userData['active'])
      .forEach(tile => tile.material.color.set(this.options.defaultColor))
    this.container.children
      .filter(tile => tile.userData['active'])
      .forEach(tile => tile.material.color.set(this.options.activeColor))
    if (!this.editingTile && intersects.length > 0) {
      for (let i = 0; i < intersects.length; i++) {
        if (i === 0 && 'tag' in intersects[i].object.userData && intersects[i].object.userData.tag === 'FLOOR') {
          intersects[i].object.material.color.set(this.options.hoverColor)
        }
      }
    }
  }

  load (gridData) {
    this.clearGrid()
    for (let tileName in gridData.tiles) {
      let tile = this.container.children.filter(tile => tile.name === tileName)[0]
      let objectName = gridData.tiles[tileName]
      objectManager.loadObject(objectName)
      .then(object => {
        object.name = objectName
        this.addObjectToTile(object, tile)
      })
    }
  }

  addEventListener (eventName, callback) {
    if (!this.listeners[eventName]) this.listeners[eventName] = []
    this.listeners[eventName].push(callback)
    console.log(this.listeners)
  }
}
