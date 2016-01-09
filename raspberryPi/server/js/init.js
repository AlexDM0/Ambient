/**
 * Created by Alex on 21-Dec-14.
 */

eve.system.init({
  transports: [
    { type: 'local'},
    {
      type: 'ws',
      url: 'ws://localhost:3001/agents/:id'
    }
  ]
});


var items = {};
var container;
var roomController;
var proxyAgent;

function onLoad() {
  items = {};
  container = document.getElementById('container');
  roomController = new RoomController(container, items);
  items['light1'] = new LightAgent('light1', {x: 230, y: 400}, roomController);
  items['light2'] = new LightAgent('light2', {x: 245, y: 595}, roomController);
  items['light3'] = new LightAgent('light3', {x: -20, y: 940}, roomController);
  items['light4'] = new LightAgent('light4', {x: 300, y: 1020}, roomController);
  items['light5'] = new LightAgent('light5', {x: 260, y: 10}, roomController);
  items['aquarium'] = new AquariumAgent('aquarium', {x: 260, y: 100}, roomController);
  roomController.redraw();

  proxyAgent = new ProxyAgent('webProxy').then(function (reply) {
    for (var itemId in items) {
      if (items.hasOwnProperty(itemId)) {
        items[itemId].register();
      }
    }
  });

  var colorwheel = new ColorWheel(document.getElementById('colorwheelContainer'))
  colorwheel._create();

  // bind the resize event to redrawing
  window.onresize = function() {roomController.setSize(); roomController.redraw();}
}