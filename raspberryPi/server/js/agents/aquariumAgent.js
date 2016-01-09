/**
 * Created by Alex on 30-Oct-14.
 */

function AquariumAgent(id, data, roomController) {
  // execute super constructor
  eve.Agent.call(this, id);
  // extend the agent with RPC functionality
  this.rpc = this.loadModule('rpc', this.rpcFunctions);               // option 1

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll());

  if (data !== undefined) {
    this.x = data.x || 0;
    this.y = data.y || 0;
    this.h = data.h || 1;
    this.s = data.s || 1;
    this.v = data.v || 1;
  }
  else {
    this.x = 0;
    this.y = 0;
    this.h = 1;
    this.s = 1;
    this.v = 1;
  }


  this.dom = {};
  this.roomController = roomController;
}

// extend the eve.Agent prototype
AquariumAgent.prototype = Object.create(eve.Agent.prototype);
AquariumAgent.prototype.constructor = AquariumAgent;

AquariumAgent.prototype.rpcFunctions = {};



AquariumAgent.prototype.register = function() {
  var me = this;
  this.rpc.request("webProxy", {
    method: "register", params: {
      id: this.id,
      x: this.x,
      y: this.y,
      h: this.h,
      s: this.s,
      v: this.v
    }
  }).done(function (reply) {
    if (reply) {
      //me.x = reply.x;
      //me.y = reply.y;
      //me.h = reply.h;
      //me.s = reply.s;
      //me.v = reply.v;
      me.roomController.redraw();
    }
  })
};

AquariumAgent.prototype.create = function() {
  var div = document.createElement('div');
  div.className = 'aquariumContainer';
  this.roomController.containerElement.appendChild(div);
  this.dom['frame'] = div;
}


AquariumAgent.prototype.draw = function() {
  if (this.dom['frame'] === undefined) {
    this.create();
  }

  var pos = this.roomController.canvasToDOM({x:this.x, y:this.y});
  var rect = this.roomController.containerElement.getBoundingClientRect();
  this.dom['frame'].style.left = rect.left + pos.x + "px";
  this.dom['frame'].style.top  = rect.top + pos.y + "px";
};