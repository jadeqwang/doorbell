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
var client = new Twilio(mySettings.private.TWILIO_ACCOUNT_SID, mySettings.private.TWILIO_AUTH_TOKEN);

// sends SMS via Twilio
var sendDoorbellSMS = function() {
  client.messages.create({
      body: 'Doorbell rang!',
      to: mySettings.private.recipient_number,  // Text this number
      from: mySettings.private.sender_number // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));

};

// some vars for playing audio locally
var lame    = require('lame');
var Speaker = require('speaker');
var decoder = lame.Decoder();

// play audio locally
var playAudio = function(){
  var stream = fs.createReadStream('public/dingdong3.mp3').pipe(new lame.Decoder()).on("format", function (format) {
    var mySpeaker = new Speaker(format);
    this.pipe(mySpeaker);
    this.on('end', () => {            // speaker is borked a bit, so we close the speaker
      console.log('Closing Speaker'); // before it can execute some illegal instructions
      mySpeaker.close();              // at this.on('end') -- when the audio is done playing
    });
  });
}

// print exceptions to console rather than crash node
// because closing the speaker a bit early causes an error
process.on('uncaughtException', function (err) {
  console.error(err);
});

// open serial port to Arduino, sends a bit after 2 s
serialPort.on('open', function() {
  console.log('Port open');
  setTimeout( function() {
    sendToArduino(new Buffer([2]));
  }, 2000);
});

// when a bit is received from Arduino, play a sound and send SMS
serialPort.on('data', function(data) {
  console.log('data', data);
  sendDoorbellSMS();
  playAudio();
});


