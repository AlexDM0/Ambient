/**
 * Created by Alex on 11-Oct-14.
 */

var selectedMode = 'presets';
var presets = ['candles','disco'];
var candleColor = 0;
var selectedPreset = 0;
var presetChanger = 0;

var RED = C6;
var GREEN = C7;
var BLUE = C8;

var color = {r:255,g:255,b:255};

var clicked = false;
var clickCount = 0;
var clickStart = 0;
var clickThreshold = 1000;

var periodicUpdate;
var selectingModes = true;
var direction = 1;
var haveInterval = false;
var presetTimeout;
var hasPresetTimeout = false;
var dontFlicker = false;




function setColor(customColor) {
  if (customColor !== undefined) {
    analogWrite(RED,customColor.r/255);
    analogWrite(GREEN,customColor.g/255);
    analogWrite(BLUE,customColor.b/255);
  }
  else {
    analogWrite(RED,color.r/255);
    analogWrite(GREEN,color.g/255);
    analogWrite(BLUE,color.b/255);
  }
}

function doCandle() {
  var candleColors = [
    {r:255,g:180,b:0},
    {r:255,g:138,b:0},
    {r:255,g:222,b:0},
    {r:255,g:150,b:0}
  ]
  var newCandleColor = candleColor +1 % candleColors.length;
  color = candleColors[newCandleColor];
  console.log("new candle color!");
  hasPresetTimeout = true;
  presetTimeout = setTimeout(doCandle,Math.random()*200 + 50);
}

function doDisco() {
  var hsv = RGBToHSV(color.r,color.g, color.b);
  hsv.h = Math.random();
  hsv.s = Math.random()*0.5 + 0.5;
  hsv.v = Math.random()*0.5 + 0.5;
  color = HSVtoRGB(hsv.h, hsv.s, hsv.v);
  setColor();
  console.log("new disco color!");
  hasPresetTimeout = true;
  presetTimeout = setTimeout(doDisco,500);
}

function doModeOnHold() {
  switch (selectedMode) {
    case 'presets': // do nothing
      presetChanger += 0.05;
      if (presetChanger > 1) {
        presetChanger = 0;
        selectedPreset += 1;
        console.log("switch Preset");
        if (hasPresetTimeout == true) {
          hasPresetTimeout = false;
          clearTimeout(presetTimeout);
        }
        if (selectedPreset > presets.length - 1) {
          selectedPreset = 0;
        }
        select();
      }
      break;
    case 'hue':
      console.log(color);
      var hsv = RGBToHSV(color.r,color.g, color.b);
      console.log(hsv)
      hsv.h += direction * 0.05;
      if (hsv.h > 1) {
        hsv.h = 1;
        direction = -1;
      }
      else if (hsv.h < 0) {
        hsv.h = 0;
        direction = 1;
      }
      console.log("hue:", hsv, direction * 0.05, direction);
      color = HSVtoRGB(hsv.h, hsv.s, hsv.v);
      setColor();
      break;
    case 'saturation':
      var hsv = RGBToHSV(color.r,color.g, color.b);
      hsv.s += direction * 0.05;
      if (hsv.s > 1) {
        hsv.s = 1;
        direction = -1;
      }
      else if (hsv.s < 0) {
        hsv.s = 0;
        direction = 1;
      }
      console.log("saturation:", hsv);
      color = HSVtoRGB(hsv.h, hsv.s, hsv.v);
      setColor();
      break;
    case 'brightness':
      var hsv = RGBToHSV(color.r,color.g, color.b);
      hsv.v += direction * 0.05;
      if (hsv.v > 1) {
        hsv.v = 1;
        direction = -1;
      }
      else if (hsv.v < 0) {
        hsv.v = 0;
        direction = 1;
      }
      console.log("brightness:", hsv);
      color = HSVtoRGB(hsv.h, hsv.s, hsv.v);
      setColor();
      break
  }
}

function flicker() {
  if (dontFlicker == false) {
    console.log("flickering")
    setColor({r: 0, g: 0, b: 0});
    setTimeout(setColor, 50);
  }
}

function start() {
  if (clicked == false) {
    clicked = true;
    dontFlicker = false;
    console.log("clicked")
    clickStart = Date.now();
    presetChanger = 0;
    if (selectingModes == false) {
      haveInterval = true;
      console.log('create interval')
      periodicUpdate = setInterval(doModeOnHold, 50);
    }
    else {
      console.log('setting flicker');
      setTimeout(flicker, clickThreshold);
    }
  }
}

function processClick() {
  clicked = false;
  dontFlicker = true;
  var clickDuration = Date.now() - clickStart;
  if (haveInterval == true) {
    haveInterval = false;
    console.log('clear interval')
    clearInterval(periodicUpdate);
  }
  if (hasPresetTimeout == true) {
    hasPresetTimeout = false;
    clearTimeout(presetTimeout);
  }
  if (clickDuration > clickThreshold) {
    console.log('select',clickDuration,periodicUpdate, haveInterval);
    selectingModes = false;
    clickCount = 0;
    select();
  }
  else {
    if (selectingModes == false && clickCount < 1) {
      clickCount += 1;
    }
    else {
      console.log('next',clickDuration, periodicUpdate, haveInterval);
      selectingModes = true;
      nextMode();
    }
  }
}

function nextMode() {
  if (selectedMode == "presets") {
    console.log("next up is: hue")
    selectedMode = 'hue';
    setColor({r:255,g:0,b:0});
  }
  else if (selectedMode == "hue") {
    console.log("next up is: saturation")
    selectedMode = 'saturation';
    setColor({r:0,g:255,b:0});
  }
  else if (selectedMode == "saturation") {
    console.log("next up is: brightness")
    selectedMode = 'brightness';
    setColor({r:0,g:0,b:255});
  }
  else if (selectedMode == "brightness") {
    console.log("next up is: presets")
    selectedMode = 'presets';
    setColor({r:255,g:255,b:255});
  }
}

function select() {
  switch (selectedMode) {
    case 'presets':
      if (selectedPreset == 0) {
        doCandle()
      }
      else {
        doDisco();
      }
      break;
    case 'hue':
      setColor();
      break;
    case 'saturation':
      setColor();
      break;
    case 'brightness':
      setColor();
      break
  }
}

function onInit() {
  setWatch(start, BTN1, { repeat:true, edge:'rising' });
  setWatch(processClick, BTN1, { repeat:true, edge:'falling' });
  select();
}

/**
 * http://www.javascripter.net/faq/rgb2hsv.htm
 *
 * @param red // 0 -- 255
 * @param green // 0 -- 255
 * @param blue // 0 -- 255
 * @returns {*}
 * @constructor
 */
function RGBToHSV(red,green,blue) {
  red=red/255; green=green/255; blue=blue/255;
  var minRGB = Math.min(red,Math.min(green,blue));
  var maxRGB = Math.max(red,Math.max(green,blue));

  // Black-gray-white
  if (minRGB == maxRGB) {
    return {h:0,s:0,v:minRGB};
  }

  // Colors other than black-gray-white:
  var d = (red==minRGB) ? green-blue : ((blue==minRGB) ? red-green : blue-red);
  var h = (red==minRGB) ? 3 : ((blue==minRGB) ? 1 : 5);
  var hue = 60*(h - d/(maxRGB - minRGB))/360;
  var saturation = (maxRGB - minRGB)/maxRGB;
  var value = maxRGB;
  return {h:hue,s:saturation,v:value};
};


/**
 * https://gist.github.com/mjijackson/5311256
 * @param h // 0 -- 1
 * @param s // 0 -- 1
 * @param v // 0 -- 1
 * @returns {{r: number, g: number, b: number}}
 * @constructor
 */
function HSVtoRGB(h, s, v) {
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  return {r:Math.floor(r * 255), g:Math.floor(g * 255), b:Math.floor(b * 255) };
};


onInit();