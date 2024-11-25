// Provides a base template for collisions and drawing

class object {
  constructor(xPos, yPos, drawWidth, drawHeight, hitboxOffsetX, hitboxOffsetY, hitboxWidth, hitboxHeight, fillColor) {
    /*
    xPos: left of object
    yPos: bottom of object
    drawWidth: width of drawing
    drawHeight: height of drawing
    hitboxOffsetX: hitbox x offset from xPos
    hitboxOffsetY: hitbox y offset from yPos
    hitboxWidth: width of hitbox
    hitboxHeight: height of hitbox
    fillColor: color of draw fill (string)
    */
    
    this.hitboxOffsetX = hitboxOffsetX; // offset from the draw start point of the object
    this.hitboxOffsetY = hitboxOffsetY;
    this.hitboxWidth = hitboxWidth;
    this.hitboxHeight = hitboxHeight;
    
    this.drawWidth = drawWidth;
    this.drawHeight = drawHeight;
    
    this.fillColor = fillColor;
    this.collisionPriority = false; // lets cube do stuff first when colliding
    
    this.xPos = xPos; // x pos of object (left)
    this.yPos = yPos; // y pos of object (bottom) (For drawing using drawYPos)
  }
  
  IsColliding(otherObject, customSelfPos, customOtherPos) {
    // Checks if this object's hitbox is collding with another objects hitbox, or if they would be colliding if they were in different positions
    // customSelfPos: [x,y]
    // customOtherPos: [x,y]
    
    
    if (customSelfPos!=null) {
      var originalSelfPos = [this.xPos, this.yPos];
      this.xPos = customSelfPos[0];
      this.yPos = customSelfPos[1];
    }
    
    if (customOtherPos!=null) {
      var originalOtherPos = [otherObject.xPos, otherObject.yPos];
      otherObject.xPos = customOtherPos[0];
      otherObject.yPos = customOtherPos[1];
    }
    
    var colliding = (this.WithinSameColumn(otherObject) && this.WithinSameRow(otherObject));
    
    if (customSelfPos!=null) {
      this.xPos = originalSelfPos[0];
      this.yPos = originalSelfPos[1];
    }
    
    if (customOtherPos!=null) {
      otherObject.xPos = originalOtherPos[0];
      otherObject.yPos = originalOtherPos[1];
    }
    
    return colliding;
  }
  
  
  WithinSameColumn(otherObject) {
    // Comumn is |
    
    if (this.hitboxRight>otherObject.hitboxLeft) {
      // right wall past left wall of other
      
      if (this.hitboxLeft<otherObject.hitboxRight) {
        // Left wall behind right wall of other
        
        return true;
      }
    }
    
    return false;
  }
  
  WithinSameRow(otherObject) {
    // Row is -
    
    if (this.hitboxTop>otherObject.hitboxBottom) {
      // top wall higher than bottom of other
      
      if (this.hitboxBottom<otherObject.hitboxTop) {
        // bottom wall below top wall of other
        
        return true;
      }
    }
    
    return false;
  }
  
  ColorScan(leftPixel, topPixel, width, height) {
    leftPixel = Math.round(leftPixel);
    topPixel = Math.round(topPixel);
    var imageData = ctx.getImageData(leftPixel, topPixel, width||1, height||1).data;
    //tracker.innerHTML = imageData.data;
    var formattedData = [];
    for (let i=0;i<imageData.length/4;i++) {
      formattedData.push([]);
      for (let i1=0;i1<4;i1++) {
        formattedData[i].push(imageData[4*i+i1]);
      }
    }
    return formattedData;
  }
  
  GetObjectCoveringPixel(pixelX, pixelY) {
    // Takes a pixel position (x,y) y is from top to y and returns objects whose hitboxes cover that position
    var object = 0;
    
    physicsManager.loadedObstacles.forEach((n)=>{
      if (object!=0) {return;}
    
      var collideX = false;
      var collideY = false;
      
      if (n.hitboxRight>=pixelX) {
        if (n.hitboxLeft<=pixelX) {
          collideX = true;
        }
      }
      
      if (n.hitboxTop>=pixelY) {
        if (n.hitboxBottom<=pixelY) {
          collideY = true;
        }
      }
      
      if (collideY && collideY) {
        object = n;
        return;
      }
    });
    
    return object;
  }
  
  Update() {
    
  }
  
  OnCollision() {
    
  }
  
  DrawHitbox() {
    ctx.fillStyle = "red";
    
    ctx.fillRect(this.hitboxPosX, this.drawYPosHitbox, this.hitboxWidth, this.hitboxHeight);
    
    ctx.fillStyle = "black";
  }
  
  Draw() {
    ctx.fillStyle = this.fillColor;
  }
  
  // Image positions
  
  get drawYPosHitbox() {
    let bottom = canvasHeight-this.yPos;
    return bottom-this.hitboxOffsetY-this.hitboxHeight;
  }
  
  get drawCenterX() {
    return this.drawLeft+(this.drawWidth/2);
  }
  
  get drawCenterY() {
    return this.drawBottom+(this.drawHeight/2);
  }
  
  get drawLeft() {
    return this.xPos;
  }
  
  get drawRight() {
    return this.xPos+this.drawWidth;
  }
  
  get drawTop() {
    return this.yPos+this.drawHeight;
  }
  
  get drawBottom() {
    return this.yPos;
  }
  
  get drawYPos() {
    // Converts y pos to be used in ctx.fillRect
    return this.drawYPosCustom(this.yPos+this.drawHeight);
  }
  
  drawYPosCustom(y) {
    return (canvasHeight - y);
  }
  
  // Hitbox positions
  
  get hitboxPosX() {
    return this.xPos+this.hitboxOffsetX;
  }
  
  get hitboxPosY() {
    return this.yPos+this.hitboxOffsetY;
  }
  
  get hitboxCenterX() {
    this.hitboxLeft+(this.hitboxWidth/2);
  }
  
  get hitboxCenterY() {
    this.hitboxBottom+(this.hitboxHeight/2);
  }
  
  get hitboxLeft() {
    return this.hitboxPosX;
  }
  
  get hitboxRight() {
    return this.hitboxPosX+this.hitboxWidth;
  }
  
  get hitboxTop() {
    return this.hitboxPosY+this.hitboxHeight;
  }
  
  get hitboxBottom() {
    return this.hitboxPosY;
  }
}

class Square extends object {
  constructor(xPos, yPos, width, height, color) {
    super(xPos, yPos, width, height, 0, 0, width, height, color||"black");
  }
  
  Draw() {
    super.Draw();
    ctx.fillRect(this.xPos, this.drawYPos, this.drawWidth, this.drawHeight);
    // var data = ctx.getImageData(10, 190, 1, 1);
    // tracker.innerHTML = data.data;
  }
}



