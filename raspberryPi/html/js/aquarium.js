
var hours = 22;
var minutes = 27;
var seconds = 0;

var port = {pin:C6, brightness:0};
var fadeInterval = 30;

function timestep() {
  seconds += 1;
  if (seconds == 60) {
    seconds = 0;
    minutes += 1;
  }
  if (minutes == 60) {
    minutes = 0;
    hours += 1;
  }
  if (hours == 24) {
    hours = 0;
  }
  updateBehaviourFade();
}

/**
 * This fades in the lights on the port.pin
 * @param {Number} fadeInterval | time in seconds to fade in
 */
function fadeIn(fadeInterval) {
  if (port.brightness == 0) {
    analogWrite(port.pin,1/255);


    var fadeInID = setInterval(function () {
        port.brightness += 1/255;
        if (port.brightness > 1) {
          analogWrite(port.pin,1);
          port.brightness = 1;
          clearInterval(fadeInID);
        }
        else {
          analogWrite(port.pin,port.brightness);
        }
      },
      fadeInterval*1000/255
    );
  }
}

/**
 * This fades out the lights on the port.pin
 * @param {Number} fadeInterval | time in seconds to fade out
 */
function fadeOut(fadeInterval) {
  if (port.brightness == 1) {
    analogWrite(port.pin,1 - 1/255);
    var fadeOutID = setInterval(function () {
        port.brightness -= 1/255;
        if (port.brightness < 0) {
          port.brightness = 0;
          analogWrite(port.pin,0);
          clearInterval(fadeOutID);
        }
        else {
  //        console.log("fading out",port.brightness, fadeInterval, fadeInterval*1000/255);
          analogWrite(port.pin,port.brightness);
        }
      },
      fadeInterval*1000/255
    );
  }
}

function updateBehaviourFade() {
  if (hours >= 8 && hours < 23) {
    fadeIn(fadeInterval);
  }
  else {
    fadeOut(fadeInterval);
  }
 }



function swapOnDown() {
  if (digitalRead(BTN1) == 1) {
    if (port.brightness == 1) {
      fadeOut(1);
    }
    else {
      fadeIn(1);
    }
  }
}



function onInit() {
  analogWrite(C6,0);
  setInterval(timestep,1000);
  setWatch(swapOnDown, BTN1, true);
}