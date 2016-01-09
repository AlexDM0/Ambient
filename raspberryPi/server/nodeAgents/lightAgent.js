/**
 * Created by Alex on 30-Oct-14.
 */
var eve = require("evejs");
var util = require("util");

function LightAgent(id, serialConnection) {
  // execute super constructor
  eve.Agent.call(this, id);

  // extend the agent with RPC functionality
  this.rpc = this.loadModule('rpc', this.rpcFunctions);               // option 1

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll());
  this.serial = serialConnection;
  this.color = {h:1,s:0,v:1};
  this.init();
}

// extend the eve.Agent prototype
LightAgent.prototype = Object.create(eve.Agent.prototype);
LightAgent.prototype.constructor = LightAgent;

LightAgent.prototype.rpcFunctions = {};

LightAgent.prototype.incomingMessage = function (data) {
  if (data.type) {
    if (data.type == 'light') {
      this.color = data.content;
      this.updateData();
    }
  }
}

LightAgent.prototype.init = function() {
  var arg = JSON.stringify({address:this.id});
  this.serial.write("getColorData(" + arg + ")\n", function (reply) {console.log(reply)})
}




module.exports = LightAgent;