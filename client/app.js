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

});
