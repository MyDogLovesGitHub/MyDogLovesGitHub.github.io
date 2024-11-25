// Manages the switches between level menu, level editor, and other interfaces

class GameManager {
  constructor() {
    
  }
}


const gameManager = new GameManager();
const levelManager = new LevelManager();
const physicsManager = new PhysicsManager();

physicsManager.StartGameLoop();