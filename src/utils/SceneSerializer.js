class SceneSerializer {
  serialize (grid) {
    let json = {
      tiles: {}
    }
    grid.container.children
      .filter(tile => tile.children.length > 0)
      .forEach(tile => {
        json.tiles[tile.name] = tile.children[0].name
      })
    return json
  }
}

export let sceneSerializer = new SceneSerializer()

  // [posX, posY, posZ] = [x * this.options.cubeSize + (this.options.cubeSize / 2), -(this.options.cubeSize / 2), z * this.options.cubeSize + (this.options.cubeSize / 2)]
