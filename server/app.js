var sendToArduino = function(message) {
  serialPort.write(message);
  console.log('Sent to device:', message);
};
var serialPort = new SerialPort.SerialPort('/dev/tty.usbmodem1421', {
  baudrate: 9600,
  parser: SerialPort.parsers.readline('\r\n')
});

var sendDoorbellSMS = function() {
    //twilio = Twilio(Meteor.settings.private.TWILIO_ACCOUNT_SID_TEST, Meteor.settings.private.TWILIO_AUTH_TOKEN_TEST);
    twilio = Twilio(Meteor.settings.private.TWILIO_ACCOUNT_SID, Meteor.settings.private.TWILIO_AUTH_TOKEN);
    twilio.sendSms({
      to: Meteor.settings.private.recipient_number, // Any number Twilio can deliver to
      from: Meteor.settings.private.sender_number, // A number you bought from Twilio and can use for outbound communication
      body: 'Doorbell rang!' // body of the SMS message
      }, function(err, responseData) { //this function is executed when a response is received from Twilio
      if (!err) { // "err" is an error received during the request, if any
        // "responseData" is a JavaScript object containing data received from Twilio.
        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
        // http://www.twilio.com/docs/api/rest/sending-sms#example-1
        // console.log(responseData.from); // outputs "+14506667788"
        console.log(responseData.body); // outputs "word to your mother."
      } else {
        console.log('error', err);
      }
  });
};

// variables for chromecastURL and youtube video url
var player  = Npm.require('chromecast-player')();
var media   = 'http://10.0.4.4:3000/dingdong.mp3';

// plays audio on chromecast
var playChromecast = function(){

  player.launch(media, function(err, p) {
    p.once('playing', function() {
      console.log('playback has started.', media);
    });
  });
}


Meteor.startup(function() {
});

serialPort.on('open', Meteor.bindEnvironment(function() {
  console.log('Port open');
  Meteor.setTimeout( function() {
    sendToArduino(new Buffer([2]));
  }, 2000);
}));


serialPort.on('data', Meteor.bindEnvironment(function(data) {
  playChromecast();
  sendDoorbellSMS();
  // console.log('Button Pressed!');
}));


Meteor.methods({
  sendBit: function() {
    sendToArduino(new Buffer([2]));
  }
});

