// Creates different interactable obstacles, each object must only need x and y positions to be created

class Obstacle extends object {
    constructor(xPos, yPos, drawWidth, drawHeight, hitboxOffsetX, hitboxOffsetY, hitboxWidth, hitboxHeight, fillColor) {
    super(xPos, yPos, drawWidth, drawHeight, hitboxOffsetX, hitboxOffsetY, hitboxWidth, hitboxHeight, fillColor);
  
    this.obstacleType = "UnDesignated"; // For debugging and other things
  }
  
  Update() {
    this.xPos -= distPerFrame;
  }
}

class Spike extends Obstacle {
  constructor(xPos, yPos) {
    super(xPos, yPos, 30, 30, 10, 0, 10, 20, "rgb(255 3 0)");
    this.obstacleType = "spike";
  }
  
  OnCollision() {
    // If cube collides with spike, then kill cube
    
    physicsManager.cubeAlive = false;
    
  }
  
  Draw() {
    super.Draw();
    
    ctx.beginPath();
    ctx.moveTo(this.xPos, (this.drawYPos+this.drawHeight));
    ctx.lineTo((this.xPos+(this.drawWidth/2)), (this.drawYPos));
    ctx.lineTo((this.xPos+this.drawWidth), (this.drawYPos+this.drawHeight));
    ctx.fill();
    
    this.DrawHitbox();
  }
}

// if player will collide with block, check if slope of players movement vector relative to other object is higher or lower than the slope of the center of bother objects


class Block extends Obstacle {
  constructor(xPos, yPos) {
    super(xPos, yPos, 30, 30, 0, 0, 30, 30, "rgb(0 0 254)");
    this.obstacleType = "block";
  }
  
  OnCollision() {
    
  }
  
  Draw() {
    super.Draw();
    
    ctx.fillRect(this.xPos, this.drawYPos, this.drawWidth, this.drawHeight);
    
    //this.DrawHitbox();
  }
}



