/**
 * Created by Alex on 19-Oct-14.
 */

var eve = require('evejs');
var Promise = require("promise");
var serialPort = require("serialport");
var SerialPort = require("serialport").SerialPort;

var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var port = process.argv[2] || 80;


// setup webserver
http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname;
  var filename = path.join(process.cwd(), uri);

  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

// init eve
eve.system.init({
  transports: [
    {
      type: 'ws',
      url: 'ws://localhost:3000/agents/:id'
    }
  ]
});
var itemAgents = {};
var serverProxy;


// setup serial
var availablePorts = {};
var connections = {};
var commKey = "";

function updatePorts() {
  return new Promise(function (resolve, reject) {
    serialPort.list(function (err, ports) {
      ports.forEach(function(port) {
        availablePorts[port.comName] = {port:port, connected:false};
      });
      resolve();
    });
  })
}

function connectToPorts() {
  return new Promise(function (resolve, reject) {
    for (var port in availablePorts) {
      if (availablePorts.hasOwnProperty(port)) {
        var portData = availablePorts[port];
        if (portData.connected != true) {
          connections[portData.port.comName] = new SerialPort(portData.port.comName, {baudrate: 9600}, false);
          commKey = portData.port.comName;
        }
      }
    }

    if (!(connections[commKey])) {
      reject("Could not find connected espruino");
    }
    else {
      connections[commKey].open(function (error) {
        if (error) {
          reject('failed to open: '+error);
        }
        else {
          console.log('open');
          resolve();
        }
      });
    }
  })
}

function routeMessage(data) {
  console.log('incoming data'.data);
  var message = JSON.parse(data);
  if (message && message.address) {
    console.log('messageAddress', message.address, message)
    if (itemAgents[message.address]) {
      itemAgents[message.address].incomingMessage(message);
    }
    else {
      throw new Error("Agent: " + message.address + " does not exist. " +  data);
    }
  }
}

updatePorts()
  .then(function () {
    return connectToPorts();
  })
  .then( function() {
    connections[commKey].on('data', routeMessage);

    var proxyAgent = require('./nodeAgents/proxyAgent');
    var LightAgent = require('./nodeAgents/lightAgent');
    var AquariumAgent = require('./nodeAgents/aquariumAgent');

    itemAgents['light1'] = new LightAgent('light1',connections[commKey]);
    itemAgents['light2'] = new LightAgent('light2',connections[commKey]);
    itemAgents['light3'] = new LightAgent('light3',connections[commKey]);
    itemAgents['light4'] = new LightAgent('light4',connections[commKey]);
    itemAgents['light5'] = new LightAgent('light5',connections[commKey]);
    itemAgents['aquarium'] = new LightAgent('aquarium',connections[commKey]);

    serverProxy = new proxyAgent('serverProxy', itemAgents);
  })
  .done();
