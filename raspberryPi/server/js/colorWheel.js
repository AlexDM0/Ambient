/**
 * Created by Alex on 02-Nov-14.
 */

function ColorWheel(container, data) {
  this.containerElement = container;
}

ColorWheel.prototype._create = function() {
  this.frame = document.createElement('div');
  this.frame.className = 'colorWheel-frame';

  this.colorWheelDiv = document.createElement('div');
  this.colorWheelDiv.className = 'colorWheel-color';

  this.colorWheelSelector = document.createElement('div');
  this.colorWheelSelector.className = 'colorWheel-selector';
  this.colorWheelDiv.appendChild(this.colorWheelSelector);

  this.brightnessDiv = document.createElement('div');
  this.brightnessDiv.className = 'colorWheel-brightness';

  this.saturationDiv = document.createElement('div');
  this.saturationDiv.className = 'colorWheel-saturation';

  this.brightnessRange = document.createElement('input');
  this.brightnessRange.type = 'range';
  this.brightnessRange.min = '0';
  this.brightnessRange.max = '100';
  this.brightnessRange.value = '100';
  this.brightnessRange.className = 'brightnessRange';

  this.saturationRange = document.createElement('input');
  this.saturationRange.type = 'range';
  this.saturationRange.min = '0';
  this.saturationRange.max = '100';
  this.saturationRange.value = '100';
  this.saturationRange.className = 'saturationRange';

  this.brightnessDiv.appendChild(this.brightnessRange);
  this.saturationDiv.appendChild(this.saturationRange);

  this.containerElement.appendChild(this.frame);
  this.frame.appendChild(this.colorWheelDiv);

  this.frame.appendChild(this.saturationDiv);
  this.frame.appendChild(this.brightnessDiv);

  this.bindHammer();
}


ColorWheel.prototype.bindHammer = function() {
  var me = this;
  this.drag = {};
  this.pinch = {};
  this.hammer = Hammer(this.colorWheelDiv, {
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

ColorWheel.prototype.moveSelector = function(event) {
  var rect = this.colorWheelDiv.getBoundingClientRect();
  var top = event.gesture.center.pageY - rect.top;
  var left = event.gesture.center.pageX - rect.left;

  var centerY = 0.5 * this.colorWheelDiv.clientHeight;
  var centerX = 0.5 * this.colorWheelDiv.clientWidth;

  var x = left - centerX;
  var y = top - centerY;

  var angle = Math.atan(y/x);
  if (x < 0) {
    angle += Math.PI;
  }
  var radius = Math.min(Math.sqrt(x*x + y*y), centerX);

  var newTop = Math.sin(angle) * radius + centerY;
  var newLeft = Math.cos(angle) * radius + centerX;

  this.colorWheelSelector.style.top = newTop - 0.5*this.colorWheelSelector.clientHeight + 'px';
  this.colorWheelSelector.style.left = newLeft - 0.5*this.colorWheelSelector.clientWidth + 'px';


}

ColorWheel.prototype._onTap = function(event) {
  this.moveSelector(event);
};

ColorWheel.prototype._onTouch = function(event) {
  this.moveSelector(event);
};

ColorWheel.prototype._onDragStart = function(event) {
  this.moveSelector(event);
};

ColorWheel.prototype._onDrag = function(event) {
  this.moveSelector(event);
};

ColorWheel.prototype._onDragEnd = function(event) {
  this.moveSelector(event);
};

ColorWheel.prototype._onRelease = function(event) {

};

ColorWheel.prototype.redraw = function(roomController) {
  if (this.frame === undefined) {
    this._create();
  }
  var pos = roomController.canvasToDOM({x:0, y:0});
  this.frame.style.top = '50px';
  this.frame.style.left = pos.x - 350 + 'px';
}