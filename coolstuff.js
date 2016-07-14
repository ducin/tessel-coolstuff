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


var LIGHT_LEVEL = 0.4;
var DARK_LEVEL = 0.2;

function isLight(value) {
  return value > LIGHT_LEVEL;
}
function isDark(value) {
  return value < DARK_LEVEL;
}

function clear() {
  tessel.led[0].on();
  tessel.led[1].off();
  tessel.led[2].off();
  tessel.led[3].off();
}

// an array of available LEDs
var leds = tessel.led;

// ERR - Red
var red = leds[0];

// WLAN - Amber
var amber = leds[1];

// LED0 - Green
var green = leds[2];

// LED1 - Blue
var blue = leds[3];

/////////////////////////////////////////////

//var ws = require("nodejs-websocket");
//
//// Scream server example: "hi" -> "HI!!!"
//var server = ws.createServer(function (conn) {
//  console.log("New connection");
//  //conn.on("text", function (str) {
//  //  console.log("Received "+str);
//  //  conn.sendText(str.toUpperCase()+"!!!")
//  //});
//  ws.sendSound = function(value) {
//    conn.send(value+"!!!");
//    console.log("sent"+value);
//  };
//  conn.on("close", function (code, reason) {
//    console.log("Connection closed")
//  })
//}).listen(8001);

var path = require('path');
var av = require('tessel-av');
var mp3 = path.join(__dirname, 'silence.mp3');
var speaker = new av.Speaker(mp3);

//speaker.play();
//
//speaker.on('end', function(seconds) {
//  speaker.play();
//});

////////////////////////////////////////

clear();

var QUIET_LEVEL = 0.06;
var NOISE_LEVEL = 0.09;
var LOUD_LEVEL = 0.12;

var isPlaying = false;
speaker.on('end', function (seconds) {
  isPlaying = false;
  clear();
});

ambient.on('ready', function () {
  // Get points of light and sound data.
  setInterval( function () {
    //ambient.getLightLevel( function(err, lightdata) {
    //  if (err) throw err;
      ambient.getSoundLevel( function(err, sounddata) {
        if (err) throw err;
        //var light = lightdata.toFixed(8);
        var sound = sounddata.toFixed(8);
        console.log(
          //"Light level:", light, " ",
          "Sound Level:", sound
        );
        //ws.sendSound(sound);
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
            blue.on();
            green.on();
            amber.on();
            red.on();

            console.log("Silence I kill U");
            speaker.play();
            isPlaying = true;
          }
        }

        //if (light > LIGHT_LEVEL) {
        //  tessel.led[2].on();
        //} else if (light < DARK_LEVEL) {
        //  tessel.led[2].off();
        //}
      });
    //});
  }, 200); // The readings will happen every .5 seconds
});

//setInterval(function () {
  //tessel.led[1].toggle();
  //tessel.led[2].toggle();
  //tessel.led[3].toggle();
//}, 300);
