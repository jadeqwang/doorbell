
Template.main.helpers({
});

Template.main.events({
  'click #startDoorbell': function(e, t) {
    e.preventDefault();
    Meteor.call('sendBit');
  },
});

Template.main.onCreated(function() {
  Meteor.call('sendBit');
});
