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

var color = {r:255,g:0,b:0};

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
    {r:255,g:80,b:0},
    {r:255,g:38,b:0},
    {r:255,g:22,b:0},
    {r:255,g:50,b:0}
  ]
  var newCandleColor = (candleColor + 1) % candleColors.length;
  color = candleColors[newCandleColor];
  candleColor = newCandleColor;

  setColor();

  console.log("new candle color!");
  hasPresetTimeout = true;
  presetTimeout = setTimeout(doCandle,Math.random()*200 + 50);
}

function doLoop() {
  var hsv = RGBToHSV(color.r,color.g, color.b);
  hsv.h = (hsv.h * 360 + direction) / 360;
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
  setTimeout(doLoop,50);
}

function onInit() {
  doLoop()
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