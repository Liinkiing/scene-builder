let OBJLoader = require('three-obj-loader')
let MTLLoader = require('three-mtl-loader')
let THREE = require('three')
OBJLoader(THREE)

export default class ObjectsManager {
  constructor () {
    this.loader = new THREE.OBJLoader()
    this.mtlLoader = new MTLLoader()
    this.objects = []
  }

  addObject (name, mtl, obj) {
    this.objects[name] = {
      mtl, obj
    }
  }

  getObject (name) {
    return this.objects[name]
  }

  loadObject (name) {
    return new Promise(resolve => {
      this.mtlLoader.load(this.getObject(name).mtl, materials => {
        materials.preload()
        this.loader.setMaterials(materials)
        this.loader.load(this.getObject(name).obj, object => {
          resolve(object)
        })
      })
    })
  }
}
