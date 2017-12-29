var sendToArduino = function(message) {
  serialPort.write(message);
  console.log('Sent to device:', message);
};

// serialport variables
var SerialPort = Npm.require('serialport').SerialPort;
var serialPort = new SerialPort.SerialPort('/dev/tty.usbmodem1421', {
  baudrate: 9600,
  parser: SerialPort.parsers.readline('\r\n')
});

// Twilio variables
var Twilio = Npm.require('twilio');
var twilio = Twilio(Meteor.settings.private.TWILIO_ACCOUNT_SID, Meteor.settings.private.TWILIO_AUTH_TOKEN);

// sends SMS via Twilio
var sendDoorbellSMS = function() {
  twilio.sendSms({
    to: Meteor.settings.private.recipient_number, // Any number Twilio can deliver to
    from: Meteor.settings.private.sender_number, // A number you bought from Twilio and can use for outbound communication
    body: 'Doorbell rang!' // body of the SMS message
  }, function(err, responseData) { //this function is executed when a response is received from Twilio
    if (!err) { // "err" is an error received during the request, if any
      console.log(responseData.body); 
    } else {
      console.log('error', err);
    }
  });
};



// variables for chromecastURL and youtube video url
var player  = Npm.require('chromecast-player')();
var media   = 'http://10.0.4.4:3000/dingdong2.mp3';

// some vars for playing audio locally
// var lame = Npm.require('lame'), Speaker = Npm.require('speaker'), fs = require('fs');
//var audioOptions = {channels: 2, bitDepth: 16, sampleRate: 44100};
// var decoder = lame.Decoder();

// todo: npm install lame and speaker (after updating to newer version of Node)
// play audio locally; this doesn't work yet
var playAudio = function(){
  var stream = fs.createReadStream(media).pipe(new lame.Decoder()).on("format", function (format) {
    this.pipe(new Speaker(format))
  })
}


// plays audio on chromecast
var playChromecast = function(){
  player.launch(media, function(err, p) {
    p.once('playing', function() {
      console.log('playback has started.', media);
    });
  });
}

// open serial port to Arduino, sends a bit after 2 s
serialPort.on('open', function() {
  console.log('Port open');
  setTimeout( function() {
    sendToArduino(new Buffer([2]));
  }, 2000);
});

// when a bit is received from Arduino, play a sound and send SMS
serialPort.on('data', function(data) {
  playChromecast();
  sendDoorbellSMS();
  console.log('data', data);
});

/*
Meteor.methods({
  sendBit: function() {
    sendToArduino(new Buffer([2]));
  }
});
*/
