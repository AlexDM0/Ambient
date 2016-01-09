/**
 * Created by Alex on 26-Oct-14.
 */


function RoomController(container, items) {
  this.containerElement = container;
  this.items = items;

  this.roomPoints = [];
  this.roomPoints.push({x: 57,y: 0});
  this.roomPoints.push({x: 322,y: 0});
  this.roomPoints.push({x: 322,y: 400});
  this.roomPoints.push({x: 242,y: 480});
  this.roomPoints.push({x: 242,y: 580});
  this.roomPoints.push({x: 342,y: 660});
  this.roomPoints.push({x: 342,y: 1060});
  this.roomPoints.push({x: 92,y: 1060});
  this.roomPoints.push({x: 50,y: 980});
  this.roomPoints.push({x: 0,y: 980});
  this.roomPoints.push({x: 0,y: 650});
  this.roomPoints.push({x: 30,y: 580});
  this.roomPoints.push({x: 30,y: 200});
  this.roomPoints.push({x: 57,y: 200});

  this._create();
  this.redraw();
};

RoomController.prototype._create = function() {
  this.frame = document.createElement('div');
  this.frame.className = 'RoomController-frame';
  this.frame.style.position = 'relative';
  this.frame.style.overflow = 'hidden';

  // create the network canvas (HTML canvas element)
  this.frame.canvas = document.createElement( 'canvas' );
  this.frame.canvas.style.position = 'relative';
  this.frame.appendChild(this.frame.canvas);
  if (!this.frame.canvas.getContext) {
    var noCanvas = document.createElement( 'DIV' );
    noCanvas.style.color = 'red';
    noCanvas.style.fontWeight =  'bold' ;
    noCanvas.style.padding =  '10px';
    noCanvas.innerHTML =  'Error: your browser does not support HTML canvas';
    this.frame.canvas.appendChild(noCanvas);
  }

  // add the frame to the container element
  this.containerElement.appendChild(this.frame);

  this.setSize();
  this.bindHammer();
};

RoomController.prototype.getMinMaxHeight = function() {
  var maxX = 0;
  var maxY = 0;
  for (var i = 0; i < this.roomPoints.length; i++) {
    maxX = maxX > this.roomPoints[i].x ? maxX : this.roomPoints[i].x;
    maxY = maxY > this.roomPoints[i].y ? maxY : this.roomPoints[i].y;
  }
  return {x:maxX, y:maxY};
};

RoomController.prototype.setSize = function() {
  var divWidth = this.containerElement.offsetWidth;
  var divHeight = this.containerElement.offsetHeight;

  this.frame.style.width = divWidth + 'px';
  this.frame.style.height = divHeight + 'px';

  this.frame.canvas.width = divWidth;
  this.frame.canvas.height = divHeight;

  var minMax = this.getMinMaxHeight();
  var cushion = 1.2;
  var xScale = minMax.x * cushion / divWidth;
  var yScale = minMax.y * cushion / divHeight;
  this.scale = 1 / Math.max(xScale, yScale);

  this.xOffset = (0.5 * divWidth - 0.5 * minMax.x * this.scale);
  this.yOffset = (0.5 * divHeight - 0.5 * minMax.y * this.scale);
};

RoomController.prototype.bindHammer = function() {
  var me = this;
  this.drag = {};
  this.pinch = {};
  this.hammer = Hammer(this.frame.canvas, {
    prevent_default: true
  });
  this.hammer.on('tap',       me._onTap.bind(me) );
  //this.hammer.on('doubletap', me._onDoubleTap.bind(me) );
  //this.hammer.on('hold',      me._onHold.bind(me) );
  //this.hammer.on('pinch',     me._onPinch.bind(me) );
  this.hammer.on('touch',     me._onTouch.bind(me) );
  this.hammer.on('dragstart', me._onDragStart.bind(me) );
  this.hammer.on('drag',      me._onDrag.bind(me) );
  this.hammer.on('dragend',   me._onDragEnd.bind(me) );
  this.hammer.on('release',   me._onRelease.bind(me) );
  //this.hammer.on('mousewheel',me._onMouseWheel.bind(me) );
  //this.hammer.on('DOMMouseScroll',me._onMouseWheel.bind(me) ); // for FF
  //this.hammer.on('mousemove', me._onMouseMoveTitle.bind(me) );
};

RoomController.prototype._onTap = function(event) {

};

RoomController.prototype._onTouch = function(event) {

};

RoomController.prototype._onDragStart = function(event) {

};

RoomController.prototype._onDrag = function(event) {

};

RoomController.prototype._onDragEnd = function(event) {

};

RoomController.prototype._onRelease = function(event) {

};


RoomController.prototype._drawMap = function(ctx) {
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 5;

  // draw room
  ctx.beginPath();
  ctx.moveTo(this.roomPoints[0].x,this.roomPoints[0].y);
  for (var i = 1; i < this.roomPoints.length; i++) {
    ctx.lineTo(this.roomPoints[i].x,this.roomPoints[i].y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

RoomController.prototype._placeItems = function() {
  for (var itemId in this.items) {
    if (this.items.hasOwnProperty(itemId)) {
      this.items[itemId].draw();
    }
  }
};

RoomController.prototype.applyTimeOfDay = function() {
  var rise = 9 * 60;
  var minOfDay = new Date().getHours() * 60 + new Date().getMinutes();
  // normalize minutes of the day, 0 = rise, 0.5 = set, model as sine
  minOfDay -= rise;
  minOfDay = minOfDay < 0 ? minOfDay + 24 * 60 : minOfDay;
  minOfDay /= 24*60;
  var brightness = 0.5 * (Math.sin(minOfDay * 2 * Math.PI) + 1);
  var minBrightness = 0.3;
  brightness = brightness * (1-minBrightness) + minBrightness;

  var rgb = HSVToRGB(1,0,brightness);


  document.getElementById('fullWrapper').style.backgroundColor = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ")";
};


RoomController.prototype.redraw = function() {
  this.applyTimeOfDay();
  var ctx = this.frame.canvas.getContext('2d');
  ctx.save();
  // clear the canvas
  var w = this.frame.canvas.width;
  var h = this.frame.canvas.height;
  ctx.clearRect(0, 0, w, h);

  ctx.translate(this.xOffset,this.yOffset);
  ctx.scale(this.scale,this.scale);

 // ctx.save();
  this._drawMap(ctx);
  this._placeItems();

  ctx.restore();
};

RoomController.prototype.canvasToDOM = function(pos) {
  var x = pos.x * this.scale + this.xOffset;
  var y = pos.y * this.scale + this.yOffset;
  return {x:x,y:y};
};

RoomController.prototype.DOMtoCanvas = function(pos) {
  var x = (pos.x - this.xOffset) / this.scale;
  var y = (pos.y - this.yOffset) / this.scale;
  return {x:x,y:y};
};
