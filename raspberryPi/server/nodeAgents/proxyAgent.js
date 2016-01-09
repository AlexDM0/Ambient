/**
 * Created by Alex on 30-Oct-14.
 */

var eve = require("evejs")

function ProxyAgent(id, items) {
  // execute super constructor
  eve.Agent.call(this, id);

  // extend the agent with RPC functionality
  this.rpc = this.loadModule('rpc', this.rpcFunctions);               // option 1

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll());

}

// extend the eve.Agent prototype
ProxyAgent.prototype = Object.create(eve.Agent.prototype);
ProxyAgent.prototype.constructor = ProxyAgent;


ProxyAgent.prototype.rpcFunctions = {};

ProxyAgent.prototype.rpcFunctions.register = function(params, sender) {
  console.log('received', params, sender);
};

module.exports = ProxyAgent;