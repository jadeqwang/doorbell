var sendToArduino = function(message) {
  serialPort.write(message);
};
var serialPort = new SerialPort.SerialPort('/dev/tty.usbmodem1421', {
  baudrate: 9600,
  parser: SerialPort.parsers.readline('\r\n')
});

var sendSMS = function(){
  twilio = Twilio(Meteor.settings.private.TWILIO_ACCOUNT_SID, Meteor.settings.private.TWILIO_AUTH_TOKEN);
  twilio.sendSms({
    to: Meteor.settings.private.sender_number, // Any number Twilio can deliver to
    from: Meteor.settings.private.recipient_number, // A number you bought from Twilio and can use for outbound communication
    body: 'Doorbell rang!' // body of the SMS message
  }, function(err, responseData) { //this function is executed when a response is received from Twilio
     if (!err) { // "err" is an error received during the request, if any
      // "responseData" is a JavaScript object containing data received from Twilio.        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
      // http://www.twilio.com/docs/api/rest/sending-sms#example-1
      console.log(responseData.from); // outputs "+18318884815"
      console.log(responseData.body); // outputs "Doorbell rang!"
    }
  });
}

Meteor.startup(function() {
  Lights.remove({});
  Lights.insert({
    pin: 13,
    state: false
  });
});

Meteor.publish('lights', function() {
  return Lights.find();
});
var messagePub;

Meteor.publish('messages', function() {
  messagePub = this;
  return this.ready();
});

serialPort.on('open', function() {
  console.log('Port open');
});

serialPort.on('data', Meteor.bindEnvironment(function(data) {
  //console.log('test foo');
  console.log('message ' + data);
  //console.log('test1');
  var parsedData = JSON.parse(data);
  //console.log('test2');

  
  if (parsedData.messageType === 'buttonPress') {
    if (parsedData.state === 1) {
      console.log('Button Pressed!');
      sendSMS();
    };
  }
  
}));


Meteor.methods({
  message: function(newDoc) {
    messagePub.added('messages', Random.id(), newDoc);
  },
  sendBit: function() {
    sendToArduino(new Buffer([2]));
  },
  removeMessage: function(_id) {
    messagePub.removed('messages', _id);
  }
});
