/**
 * Created by Alex on 30-Oct-14.
 */
var eve = require("evejs");
var util = require("util");

function AquariumAgent(id, serialConnection) {
  // execute super constructor
  eve.Agent.call(this, id);

  // extend the agent with RPC functionality
  this.rpc = this.loadModule('rpc', this.rpcFunctions);               // option 1

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll());

  this.color = {h:1,s:0,v:1};


  this.init();
}

// extend the eve.Agent prototype
AquariumAgent.prototype = Object.create(eve.Agent.prototype);
AquariumAgent.prototype.constructor = AquariumAgent;

AquariumAgent.prototype.rpcFunctions = {};


module.exports = AquariumAgent;