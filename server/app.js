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
        console.log(responseData.from); // outputs "+14506667788"
        console.log(responseData.body); // outputs "word to your mother."
      } else {
        console.log('error', err);
      }
  });
};

Meteor.startup(function() {
});


var messagePub;

Meteor.publish('messages', function() {
  messagePub = this;
  return this.ready();
});


serialPort.on('open', Meteor.bindEnvironment(function() {
  console.log('Port open');
  Meteor.setTimeout( function() {
    sendToArduino(new Buffer([2]));
  }, 2000);
}));


serialPort.on('data', Meteor.bindEnvironment(function(data) {
  console.log('message ' + data);
  var parsedData = JSON.parse(data);

  
  if (parsedData.messageType === 'buttonPress') {
    if (parsedData.state === 1) {
      console.log('Button Pressed!');
      sendDoorbellSMS();
    };
  }
  
}));


Meteor.methods({
  message: function(newDoc) {
    messagePub.added('messages', Random.id(), newDoc);
  },
  removeMessage: function(_id) {
    messagePub.removed('messages', _id);
  },
  sendBit: function() {
    sendToArduino(new Buffer([2]));
  }
});

