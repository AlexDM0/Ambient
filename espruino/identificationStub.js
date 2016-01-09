
function collectMessage(data) {
  console.log(data);
}
function onInit() {
  USB.setConsole();
  clearInterval();
  clearTimeout();
  clearWatch();
  identifyMe();
}

function startSerial() {
  Serial1.removeAllListeners();
  Serial1.on('data', collectMessage);
}

var identificationBuffer = "";
function identifyData(data) {
  var slave = data.indexOf("0");
  var central = data.indexOf("1");
  if (slave !== -1) {
    groups = {

    }
    startSerial();
  }
  else if (central !== -1) {
    groups = {

    }
    startSerial();
  }
}

function identifyMe() {
  Serial1.removeAllListeners();
  Serial1.on('data', identifyData);
  Serial1.print("AT+ROLE?");
}

onInit();