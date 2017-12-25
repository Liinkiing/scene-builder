class AppStore {
  constructor () {
    let objects = require('../assets/objects/objects')
    for (let property in objects) {
      for (let subProperty in objects[property]) {
        try {
          if (!subProperty.includes('Path')) continue
          objects[property][subProperty] = require(`../assets/objects/${objects[property][subProperty]}`)
        } catch (ex) {
          objects[property][subProperty] = require(`../assets/objects/default.png`)
        }
      }
    }
    console.log(objects)
    this.state = {
      objects,
      selectedObject: 'christmas_tree'
    }
  }

  setActiveObject (objectKey) {
    this.state.selectedObject = objectKey
  }

  getObjects () {
    return this.state.objects
  }

  getObject (name) {
    return this.state.objects[name]
  }
}

export let appStore = new AppStore()
