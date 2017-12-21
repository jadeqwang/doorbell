Messages = new Mongo.Collection('messages');
Template.main.helpers({
  lightStateClass: function() {
    return Template.instance().defaultLight().state ? 'success' : 'danger';
  },
  messages: function() {
    return Messages.find({}, {
      sort: {
        created: -1
      }
    });
  },
  isMessageType: function(messageType) {
    return this.messageType === messageType;
  }
});
Template.main.events({
  'click #startDoorbell': function(e, t) {
    e.preventDefault();
    Meteor.call('sendBit');
  },
});

Template.main.onCreated(function() {

  var self = this;
  var defaultLight = Lights.find({
    pin: 13
  });
  self.subscribe('lights');
  self.defaultLight = function() {
    return defaultLight && defaultLight.fetch()[0];
  }

  defaultLight.observe({
    changed: function(newDoc, oldDoc) {
      var tmpDoc = newDoc;
      tmpDoc.created = new Date();
      tmpDoc.messageType = 'pinChange';
      delete tmpDoc._id;
      Meteor.call('message', tmpDoc);
    }
  });
  self.subscribe('messages');
  

});
