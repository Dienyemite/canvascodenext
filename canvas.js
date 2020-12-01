
class DrawingBoard {
  constructor() {
    // setup canvas
    this.canvas = document.getElementById('my-canvas');
    this.canvas.width = 600;
    this.canvas.height = 400;
    this.ctx = this.canvas.getContext('2d');

    this.setupMouse();
    this.setupErase();
  }

  // helper functions
  getPoint(event) {
    let rect = event.target.getBoundingClientRect();
    let x = event.clientX - rect.left; // x position within the element
    let y = event.clientY - rect.top;  // y position within the element
    return { x, y };
  }

  setupMouse() {
    // keep track of mouse dragging
    let mouseDown = false;
    let lastPoint = undefined;
    document.body.addEventListener('mousedown', (event) => {
      mouseDown = true;
      lastPoint = this.getPoint(event);
    });
    document.body.addEventListener('mouseup', () => {
      mouseDown = false;
      lastPoint = undefined;
    });

    // draw lines between mouse movements
    this.canvas.addEventListener('mousemove', (event) => {
      if (mouseDown) {
        let currPoint = this.getPoint(event);
        if (lastPoint) {
          this.ctx.strokeStyle = 'black';
          this.ctx.beginPath();
          this.ctx.moveTo(lastPoint.x, lastPoint.y);
          this.ctx.lineTo(currPoint.x, currPoint.y);
          this.ctx.closePath();
          this.ctx.stroke();
        }
        lastPoint = currPoint;
      }
    });
  }

  setupErase() {
    // listen for erase button
    document.getElementById('clear').addEventListener('click', () => {
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    });
  }

  toImageData() {
    return this.canvas.toDataURL();
  }
}

class RemoteDisplay {
  constructor(id) {
    this.id = id;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 600;
    this.canvas.height = 400;
    document.body.appendChild(this.canvas);
  }
  update(image) {
    let ctx = this.canvas.getContext('2d');
    let imgObj = new Image();
    imgObj.onload = () => {
      ctx.drawImage(imgObj, 0, 0);
    };
    imgObj.src = image;
  }
  remove() {
    this.canvas.remove();
  }
}

class CanvasManager {
  constructor() {
    this.myId = Math.floor(Math.random() * 1000000);
    this.drawingBoard = new DrawingBoard();
    this.remoteDisplays = {};
  }
  getMyData() {
    return {
      id: this.myId,
      image: this.drawingBoard.toImageData(),
    }
  }
  updateRemoteDisplay(data) {
    let { id, image } = data;
    let display = this.remoteDisplays[id];
    if (!display) {
      display = new RemoteDisplay(id);
      this.remoteDisplays[id] = display;
    }
    display.update(image);
  }
  removeRemoteDisplay(data) {
    let { id } = data;
    let display = this.remoteDisplays[id];
    if (display) {
      display.remove();
      this.remoteDisplays[id] = undefined;
    }
  }
}
