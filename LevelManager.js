// Manages saving and loading of levels

class LevelManager {
  // Saves each obstacle's type, position, and other settings if necessary

  constructor() {

  }

  LoadLevel(LevelLayout) {
    // Returns a list of all obstacles in the requested level
    // ex: LoadLevel(Level1Layout)

    var objects = [];

    LevelLayout.blocks.forEach((n)=>{
      let obj = new Block(n.x, n.y);
      objects.push(obj);
    });

    LevelLayout.spikes.forEach((n)=>{
      let obj = new Spike(n.x, n.y);
      objects.push(obj);
    });

    return objects;
  }
}
