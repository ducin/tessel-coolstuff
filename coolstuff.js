// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
 This ambient module example console.logs
 ambient light and sound levels and whenever a
 specified light or sound level trigger is met.
 *********************************************/

var tessel = require('tessel');
var ambientlib = require('ambient-attx4');

var ambient = ambientlib.use(tessel.port['A']);

ambient.on('error', function (err) {
  console.log(err);
});


// an array of available LEDs
var leds = tessel.led;

var red = leds[0];
var amber = leds[1];
var green = leds[2];
var blue = leds[3];

function clear() {
  red.off();
  amber.off();
  green.off();
  blue.on();
}

var handler;
function blinkStart() {
  red.on();
  amber.off();
  green.on();
  blue.off();
  handler = setInterval(function () {
    red.toggle();
    amber.toggle();
    green.toggle();
    blue.toggle();
  }, 500);
}

function blinkEnd() {
  clearInterval(handler);
}

var path = require('path');
var av = require('tessel-av');
var mp3 = path.join(__dirname, 'silence.mp3');
var speaker = new av.Speaker(mp3);

////////////////////////////////////////

clear();

var QUIET_LEVEL = 0.06;
var NOISE_LEVEL = 0.09;
var LOUD_LEVEL = 0.12;

var isPlaying = false;
speaker.on('ended', function (seconds) {
  console.log('I killed you');
  isPlaying = false;
  clear();
  blinkEnd();
});

ambient.on('ready', function () {
  // Get points of light and sound data.
  setInterval( function () {
      ambient.getSoundLevel( function(err, sounddata) {
        if (err) throw err;
        var sound = sounddata.toFixed(8);
        console.log(
          "Sound Level:", sound
        );
        if (!isPlaying) {
          if (sound < QUIET_LEVEL) {
            blue.on();
            green.off();
            amber.off();
            red.off();
          } else if (sound >= QUIET_LEVEL && sound < NOISE_LEVEL) {
            blue.on();
            green.on();
            amber.off();
            red.off();
          } else if (sound >= NOISE_LEVEL && sound < LOUD_LEVEL) {
            blue.on();
            green.on();
            amber.on();
            red.off();
          } else {
            //blue.on();
            //green.on();
            //amber.on();
            //red.on();
            console.log("Silence I kill U");
            speaker.play();
            blinkStart();
            isPlaying = true;
          }
        }
      });
  }, 200);
});
