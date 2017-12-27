class SceneSerializer {
  serialize (grid) {
    let json = {
      tiles: {}
    }
    grid.container.children
      .filter(tile => tile.children.length > 0)
      .forEach(tile => {
        console.log(tile.children[0])
        json.tiles[tile.name] = {
          objectName: tile.children[0].name,
          rotation: {
            x: tile.children[0].rotation.x,
            y: tile.children[0].rotation.y,
            z: tile.children[0].rotation.z
          }
        }
      })
    return json
  }
}

export let sceneSerializer = new SceneSerializer()

  // [posX, posY, posZ] = [x * this.options.cubeSize + (this.options.cubeSize / 2), -(this.options.cubeSize / 2), z * this.options.cubeSize + (this.options.cubeSize / 2)]
