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
    this.container = new THREE.Group()
    this.container.name = 'Floor'
    this.size = size
    this.listeners = []
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.selectedObjectName = null
    this.lastObjectRotation = null
    this.selectedObject = null
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
          roughness: 1,
          flatShading: true,
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
    object.position.x = 0
    object.position.y = posY + (object.userData.yOffset || 0)
    object.position.z = 0
    if (this.lastObjectRotation) object.rotation.set(this.lastObjectRotation.x, this.lastObjectRotation.y, this.lastObjectRotation.z)
    tile.add(object)
    tile.userData.active = true
  }

  setPreviewObjectToTile (object, tile) {
    let posY = this.options.cubeSize
    object.name = this.selectedObjectName + '_preview'
    object.position.x = 0
    object.position.y = posY + (object.userData.yOffset || 0)
    object.position.z = 0
    if (this.lastObjectRotation) object.rotation.set(this.lastObjectRotation.x, this.lastObjectRotation.y, this.lastObjectRotation.z)
    tile.add(object)
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
    this.init()
  }

  updateSelectedObject (objectName) {
    this.selectedObjectName = objectName
    objectManager.loadObject(this.selectedObjectName)
      .then(object => {
        object.name = objectName
        object.traverse(node => {
          if (node.material) {
            let mat = node.material.clone()
            mat.opacity = 0.5
            mat.transparent = true
            node.material = mat
          }
        })
        this.selectedObject = object
        this.container.children
          .filter(tile => tile.userData['hovering'])
          .forEach(tile => {
            console.log(tile)
            tile.children.forEach(child => {
              tile.remove(child)
            })
          })
      })
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
    this.container.children
      .forEach(tile => { tile.userData['hovering'] = false })
    if (!this.editingTile && intersects.length > 0) {
      for (let i = 0; i < intersects.length; i++) {
        intersects[i].object.userData['hovering'] = i === 0 && 'tag' in intersects[i].object.userData && intersects[i].object.userData.tag === 'FLOOR'
      }
    }
    this.container.children
      .filter(tile => tile.userData['hovering'])
      .forEach(tile => {
        tile.material.color.set(this.options.hoverColor)
      })
    this.container.children
      .filter(tile => tile.userData['hovering'])
      .forEach(tile => {
        if (this.selectedObject && tile.children.length === 0) {
          this.setPreviewObjectToTile(this.selectedObject, tile)
        }
      })
    this.container.children
      .filter(tile => !tile.userData['hovering'] && tile.children.length > 0 && tile.children[0].name.includes('preview'))
      .forEach(tile => {
        tile.children.forEach(child => {
          tile.remove(child)
        })
      })
  }

  load (gridData) {
    this.clearGrid()
    for (let tileName in gridData.tiles) {
      let tile = this.container.children.filter(tile => tile.name === tileName)[0]
      let tileInformation = gridData.tiles[tileName]
      objectManager.loadObject(tileInformation.objectName)
      .then(object => {
        object.name = tileInformation.objectName
        object.traverse(node => {
          if (node.material) {
            let mat = node.material.clone()
            mat.opacity = 1
            mat.transparent = false
            node.material = mat
          }
        })
        object.rotation.set(tileInformation.rotation.x, tileInformation.rotation.y, tileInformation.rotation.z)
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
