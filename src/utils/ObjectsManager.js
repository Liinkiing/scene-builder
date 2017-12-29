import { appStore } from '../stores/AppStore'

let OBJLoader = require('three-obj-loader')
let MTLLoader = require('three-mtl-loader')
let THREE = require('three')
OBJLoader(THREE)

class ObjectsManager {
  constructor () {
    this.loader = new THREE.OBJLoader()
    this.mtlLoader = new MTLLoader()
    this.objects = []
  }

  loadObject (name) {
    return new Promise(resolve => {
      let object = appStore.getObject(name)
      if (!object) return
      this.mtlLoader.load(object.mtlPath, materials => {
        materials.preload()
        this.loader.setMaterials(materials)
        this.loader.load(object.objPath, obj => {
          let scale = object.scale || 200
          if (object.yOffset) obj.userData['yOffset'] = object.yOffset
          obj.scale.set(scale, scale, scale)
          resolve(obj)
        })
      })
    })
  }
}

export let objectManager = new ObjectsManager()
