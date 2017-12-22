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
var youtube = "v=qZC5gtOw3DU";
var player  = Npm.require('chromecast-player')();
var media   = '../public/dingdong.wav';

// various URL's
// var chromecastURL   = 'http://chromecast-music:8008';
var chromecastURL   = 'chromecast-music';
var chromecastURLYT = 'http://chromecast-music:8008/apps/YouTube';
var requestbinURL   = 'https://requestb.in/y2sxnry2';


// plays audio on chromecast
var playChromecast = function(){

  player.attach({address:chromecastURL} ,function(err, p) {
    p.launch(media, function(err, p) {
      p.once('playing', function() {
        console.log('playback has started.');
      });
      console.log('foo');
    });
    //p.play();
  });
  
  console.log('bar');
}

// sends an HTTP request to chromecast
var sendHTTPRequest = function(){
  HTTP.call( 'POST', chromecastURLYT, {
    headers: {
      "User-Agent": "doorbell-meteor-app",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    content: youtube
  }, function( error, response ) {
    if ( error ) {
      console.log( error );
    } else {
      console.log( response );
    }
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
  console.log('Button Pressed!');
  sendDoorbellSMS();
  // sendHTTPRequest();
  playChromecast();
}));


Meteor.methods({
  sendBit: function() {
    sendToArduino(new Buffer([2]));
  }
});

