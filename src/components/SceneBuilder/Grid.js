let THREE = require('three')

export default class Grid extends THREE.Object3D {
  constructor (size = 20, options) {
    super()
    let defaults = {
      cubeSize: 100,
      hoverColor: 'yellow',
      activeColor: 'violet',
      defaultColor: 'red'
    }
    this.options = Object.assign({}, defaults, options)
    this.gridHelper = new THREE.GridHelper(10000, 100)
    this.container = new THREE.Group()
    this.container.name = 'Floor'
    this.size = size
    this.listeners = []
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false)
    window.addEventListener('mouseup', this.onMouseClick.bind(this), false)
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

  onMouseMove (e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  }

  addObjectToTile (object, x, z) {
    let posX, posY, posZ
    [posX, posY, posZ] = [x * this.options.cubeSize + (this.options.cubeSize / 2), this.options.cubeSize, z * this.options.cubeSize + (this.options.cubeSize / 2)]
    object.scale.set(200, 200, 200)
    object.position.x = posX
    object.position.y = posY
    object.position.z = posZ
    this.scene.add(object)
  }

  onMouseClick (e) {
    console.log(e)
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    this.raycaster.setFromCamera(this.mouse, this.camera)
    let intersects = this.raycaster.intersectObjects(this.container.children)
    for (let i = 0; i < intersects.length; i++) {
      if (i === 0 && 'tag' in intersects[i].object.userData && intersects[i].object.userData.tag === 'FLOOR') {
        if (e.which === 1) {
          intersects[i].object.userData['active'] = !intersects[i].object.userData['active']
        }
        if (this.listeners['caseclicked'] && typeof this.listeners['caseclicked'] === 'function') {
          this.listeners['caseclicked'](e, intersects[i].object)
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
    this.raycaster.setFromCamera(this.mouse, this.camera)
    let intersects = this.raycaster.intersectObjects(this.container.children)
    this.container.children
      .filter(tile => !tile.userData['active'])
      .forEach(tile => tile.material.color.set(this.options.defaultColor))
    this.container.children
      .filter(tile => tile.userData['active'])
      .forEach(tile => tile.material.color.set(this.options.activeColor))
    if (intersects.length > 0) {
      for (let i = 0; i < intersects.length; i++) {
        if (i === 0 && 'tag' in intersects[i].object.userData && intersects[i].object.userData.tag === 'FLOOR') {
          intersects[i].object.material.color.set(this.options.hoverColor)
        }
      }
    }
  }

  addEventListener (eventName, callback) {
    this.listeners[eventName] = callback
  }
}
