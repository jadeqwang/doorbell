var sendToArduino = function(message) {
  serialPort.write(message);
};
var serialPort = new SerialPort.SerialPort('/dev/tty.usbmodem1421', {
  baudrate: 9600,
  parser: SerialPort.parsers.readline('\r\n')
});

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
      console.log('Button Pressed!')
    };
    /*
    Lights.update({
      pin: parsedData.pin
    }, {
      $set: {
        state: parsedData.state
      }
    });
*/
  }
  
}));


Meteor.methods({
  message: function(newDoc) {
    messagePub.added('messages', Random.id(), newDoc);
  },
  toggleLight: function(light) {
    var newState = light.state ? false : true;
    sendToArduino(new Buffer([newState]));
  },
  getLightState: function() {
    sendToArduino(new Buffer([2]));
  },
  removeMessage: function(_id) {
    messagePub.removed('messages', _id);
  }
});
