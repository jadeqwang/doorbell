// send message to Arduino
var sendToArduino = function(message) {
  serialPort.write(message);
  console.log('Sent to device:', message);
};

// serialport variables

var serialportpkg = require('serialport');
var SerialPort    = serialportpkg.SerialPort;
var serialPort    = new SerialPort('/dev/tty.usbmodem1421', {
  baudrate: 9600,
  parser: serialportpkg.parsers.readline('\r\n')
});




// read settings.json using fs
const fs = require('fs');
// Twilio variables
var mySettings = JSON.parse(fs.readFileSync('/Users/jadewang/meteor-package-serialport/doorbell/settings.json', 'utf8'));
var Twilio = require('twilio');
// var twilio = Twilio(mySettings.private.TWILIO_ACCOUNT_SID, mySettings.private.TWILIO_AUTH_TOKEN);

var client = new Twilio(mySettings.private.TWILIO_ACCOUNT_SID, mySettings.private.TWILIO_AUTH_TOKEN);



// sends SMS via Twilio
var sendDoorbellSMS = function() {
  client.messages.create({
      body: 'Doorbell rang!',
      to: mySettings.private.recipient_number,  // Text this number
      from: mySettings.private.sender_number // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));

  /*
  twilio.sendSms({
    to: mySettings.private.recipient_number, // Any number Twilio can deliver to
    from: mySettings.private.sender_number, // A number you bought from Twilio and can use for outbound communication
    body: 'Doorbell rang!' // body of the SMS message
  }, function(err, responseData) { //this function is executed when a response is received from Twilio
    if (!err) { // "err" is an error received during the request, if any
      console.log(responseData.body); 
    } else {
      console.log('error', err);
    }
  });
*/
};

// variables for chromecastURL and youtube video url
var player  = require('chromecast-player')();
var media   = 'http://10.0.4.4:3000/dingdong2.mp3';

// some vars for playing audio locally
var lame    = require('lame');
var Speaker = require('speaker'); // fs = require('fs');
// var audioOptions = {channels: 2, bitDepth: 16, sampleRate: 44100};
var decoder = lame.Decoder();

// play audio locally
var playAudio = function(){
  var stream = fs.createReadStream('public/dingdong2.mp3').pipe(new lame.Decoder()).on("format", function (format) {
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
  // playChromecast();
  sendDoorbellSMS();
  playAudio();
  console.log('data', data);
});


