// The thing the player controls

class Cube extends Square {
  constructor() {
    //drawWidth, drawHeight, hitboxOffsetX, hitboxOffsetY, hitboxWidth, hitboxHeight
    super(0, 0, 30, 30);
    this.collisionPriority = true;
    
    this.jumpHeight = 50; // Reaches a max height of jumpHeight
    this.jumpTime = .625; // Lands jumpTime seconds after jumping
    
    this.jumpHeld = false;

    this.grounded = false; // Is cube on ground
    this.yVel = 0; // Y velocity of cube
    
    this.gravity = -2*this.jumpHeight*this.JumpSpeedFuncOut;
    this.jumpVelocity = this.jumpTime*this.jumpHeight*this.JumpSpeedFuncOut;
  }
  
  Update() {
    // Apply gravity and move cube based on velocity, also detects ground collision
    
    if (!this.grounded) {
      this.yVel += this.gravity*timeMultiplier;
    } // dont set to 0 if grounded because it's already set to 0 when hitting ground
    
    let yMovement = this.yVel*timeMultiplier;
    //tracker.innerHTML = this.ColorScan(this.drawWidth/2, this.drawYPos+this.drawHeight+(this.drawBottom>0 ? 1 : 0));
    
    
    if (this.grounded) {
      this.yVel = 0;
    } else if (this.yPos+yMovement<0) {
      this.yPos = 0;
      this.grounded = true;
    } else {
      this.yPos += yMovement;
    }
  }
  
  DetectCollisions() {
    physicsManager.loadedObstacles.forEach((n)=>{
      if (n.obstacleType!="spike" || !physicsManager.cubeAlive) {return;}
      
      if (this.IsColliding(n)) {
        physicsManager.cubeAlive = false;
        return;
      }
    });
    
    if (!physicsManager.cubeAlive) {return;}
    
    var groundObj = null;
    if (this.yPos>0) {
      let below = this.ColorScan(this.hitboxLeft, this.drawYPosCustom(this.hitboxBottom), this.hitboxWidth, 1);
      let landedOnBlock = false;
      for (let i=0;i<below.length;i++) {
        let pixelColor = below[i];
        if (pixelColor[1]==3) {
          // Spike
          physicsManager.cubeAlive = false;
          return;
        } else if (pixelColor[2]==254) {
          // Block
          landedOnBlock = true;
          break;
        }
      };
      
      if (landedOnBlock && physicsManager.cubeAlive) {
        for (let i=0;i<below.length;i++) {
          groundObj = this.GetObjectCoveringPixel(this.hitboxLeft+i, this.hitboxBottom);
          if (groundObj!=0) {
            if (Math.abs(this.hitboxRight-groundObj.hitboxLeft)<Math.abs(this.hitboxBottom-groundObj.hitboxTop)) {
              physicsManager.cubeAlive = false;
              return;
            }
            // if distance from walls is bigger than distance from top and bottoms, then it is landing, otherwise it is colliding (death
            this.grounded = true;
            this.yVel = 0;
            this.yPos = groundObj.hitboxTop;
            break;
          }
        }
      }
    }
    
    let right = this.ColorScan(this.hitboxRight, this.drawYPosCustom(this.hitboxTop), 1, this.hitboxHeight);
    for (let i=0;i<right.length;i++) {
      let pixelColor = right[i];
      if (pixelColor[1]==3) {
        // Spike
        physicsManager.cubeAlive = false;
        return;
      } else if (pixelColor[2]==254) {
        // Block
        if (groundObj==null || this.GetObjectCoveringPixel(this.hitboxRight, this.hitboxTop-i)!=groundObj) {
          physicsManager.cubeAlive = false;
          return;
        }
      }
    }
    
    //tracker.innerHTML = groundObj!=null;
    this.grounded = (groundObj!=null || this.hitboxBottom==0);
  }
  
  Jump() {
    this.grounded = false;
    this.yVel = this.jumpVelocity;
  }
  
  Reset() {
    this.grounded = false;
    this.yVel = 0;
    this.yPos = 0;
  }
  
  get JumpSpeedFuncOut() {
    // f(x) = 4x^(-2)  x: jumpTime
    // I don't remember what it does but it does something important for custom jumping, see gravity sim on desmos for usage example
    
    return 4*(this.jumpTime**(-2));
  }
}

/*
document.onmousedown = (e)=>{
  tracker.innerHTML = e.clientX;
}
*/

document.onkeypress = (e)=>{
  if (e.which==32) { // space bar
    if (!physicsManager.cubeAlive) {
      physicsManager.StartGameLoop();
       return;
    }
    physicsManager.cube.jumpHeld = true;
  }
  if (e.which==13) { // enter key
    physicsManager.ResetStage();
  }
}

document.onkeyup = (e)=>{
  if (e.which==32) {
    if (physicsManager.cube.jumpHeld) {
      physicsManager.cube.jumpHeld = false;
    }
  }
}









