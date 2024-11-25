// Manages player physics
 
class PhysicsManager {
  constructor() {
    this.cube = new Cube();
    
    this.cubeAlive = true;
    
    this.objects = [];
    this.loadedObstacles = []; // All obstacles that are in view (for faster calculations)
    this.considerFrames = (canvasWidth-(this.cube.hitboxWidth+20))/(distPerFrame); // How many frames it would take for an object to move from out of view to 20px in front of the cube
    
    this.physicsLoop = null;

    this.frameCounter = 0;
  }
  
  MainLoop() {
    this.frameCounter++;
    //tracker.innerHTML = this.frameCounter;
    
    this.ClearScreen();
    
    if (this.cubeAlive) {
      if (this.cube.jumpHeld && this.cube.grounded) {
        this.cube.Jump();
      }
      this.UpdateObjects();
      this.DrawAll();
      this.cube.DetectCollisions();
      
      // Updates the loadedObstacles every amount of frames that it would take for an object to from out of frame to 20 pixels in front of the cube
      if (this.frameCounter%this.considerFrames==0) {
        //tracker.innerHTML = this.frameCounter;
        this.UpdateLoadedObstacles();
      }
      
    }
    if (!this.cubeAlive) {
      ctx.fillStyle = "red";
      ctx.fillRect(0,0,canvasWidth,canvasHeight);
      this.DrawAll();
      this.StopGameLoop();
    }
  }
  
  ResetStage() {
    this.cubeAlive = true;
    this.cube.Reset();
    this.objects = [this.cube];
    //this.frameCounter = 0;
    
    // let spike1 = new Spike(200, 0);
    // this.objects.push(spike1);
    
    //let block1 = new Block(300,0);
    //this.objects.push(block1);
    
    levelManager.LoadLevel(Level1Layout).forEach((n)=>{
      this.objects.push(n);
    });

    this.UpdateLoadedObstacles();
    //tracker.innerHTML = this.objects

  }
  
  UnloadObjects() {
    this.objects.forEach((n)=>{
      n.Delete();
    });
    
    this.cube = null;
    this.objects = [];
    this.loadedObstacles = [];
    this.cubeAlive = true;
    this.frameCounter = 0;
  }
  
  ClearScreen() {
    ctx.fillStyle = "black";
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    //ctx.fillStyle = "rgb(0 0 150)";
    //ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.fillRect(0, canvasHeight-1, canvasWidth, 1);
  }
  
  DrawAll() {
    //Draw all objects
    
    this.objects.forEach((n) => {
      n.Draw();
    });
    
    //tracker.innerHTML = this.cubeAlive;
  }
  
  UpdateObjects() {
    this.objects.forEach((n) => {
      n.Update();
    });
  }
  
  UpdateLoadedObstacles() {
    this.loadedObstacles = [];
    this.objects.forEach((n)=>{
      if (n.drawLeft>500 || n.drawRight<=0 || n.collisionPriority) {
        return;
      }
      
      this.loadedObstacles.push(n);
    });
  }

  StopGameLoop() {
    if (this.physicsLoop) {
      clearInterval(this.physicsLoop);
      this.physicsLoop = null;
    }
  }
  
  StartGameLoop() {
    const delay = (1000/fps);
    this.ResetStage();
    this.physicsLoop = setInterval(()=>{
      this.MainLoop();
    }, delay);
  }
}


