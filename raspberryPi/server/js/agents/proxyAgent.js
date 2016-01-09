

function ProxyAgent(id) {
  // execute super constructor
  eve.Agent.call(this, id);

  // extend the agent with RPC functionality
  this.rpc = this.loadModule('rpc', this.rpcFunctions);               // option 1

  // connect to all transports provided by the system
  var connection = this.connect(eve.system.transports.getAll());
  return new Promise(function (resolve,reject) {
    connection[1].connect("ws://localhost:3000").done(function () {
      console.log('connected')
      resolve();
    })
  })
}

// extend the eve.Agent prototype
ProxyAgent.prototype = Object.create(eve.Agent.prototype);
ProxyAgent.prototype.constructor = ProxyAgent;


ProxyAgent.prototype.rpcFunctions = {};

ProxyAgent.prototype.rpcFunctions.register = function(params,sender) {
  console.log(params,sender)
  return this.rpc.request("ws://localhost:3000/agents/serverProxy", {method:'register', params:params});
}