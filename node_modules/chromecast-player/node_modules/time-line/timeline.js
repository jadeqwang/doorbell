var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

var Timeline = function(len, interval) {
  if (!(this instanceof Timeline)) return new Timeline(len, interval);
  this.len = len;
  this.interval = interval || 250;
  this.state = 'paused';
  this.position = 0;
};

inherits(Timeline, EventEmitter);

// start playback
Timeline.prototype.play = function() {
  if (this.state !== 'paused') return false;
  this.jumpTo(this.position);
};

// jump to a specific position in the timeline
// and start playback there
Timeline.prototype.jumpTo = function(position) {
  if (position >= this.len) {
    this.position = this.len;
    this.emit('position', this._calc());
    this._clear();
    this._setState('ended');
    return;
  }

  this.position = position;
  this.lastUpdate = Date.now();
  this._setState('playing');
  this._reset();
  this.emit('position', this._calc());
};

// reset the tick interval
Timeline.prototype._reset = function() {
  this._clear();
  this.t = setInterval(this._tick.bind(this), this.interval);
};

Timeline.prototype._setState = function(state) {
  this.state = state;
  this.emit(state);
  this.emit('state', state);
};

Timeline.prototype._tick = function() {
  this.jumpTo(this.position + this.interval);
};

Timeline.prototype._clear = function() {
  if (this.t) clearInterval(this.t);
};

Timeline.prototype._calc = function() {
  var ratio = this.position / this.len;
  return {
    position: this.position,
    percent: ratio * 100,
    ratio: ratio
  };
};

Timeline.prototype.pause = function() {
  if (this.state !== 'playing') return false;
  this.jumpTo(this.getPosition());
  this._clear();
  if (this.state !== 'ended') {
    this._setState('paused');
  }
};

Timeline.prototype.getPosition = function() {
  if (this.state !== 'playing') return this.position;
  var pos = this.position + (Date.now() - this.lastUpdate);
  return pos > this.len ? this.len : pos;
};

Timeline.prototype.getProgress = function() {
  return (this.getPosition() / this.len) * 100;
};

// start playback from the beginning
Timeline.prototype.reset = function(len) {
  if (len) this.len = len;
  this.jumpTo(0);
};

module.exports = Timeline;
