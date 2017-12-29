var Timeline = require('./timeline');
var expect = require('expect.js');

describe('timeline', function(next) {
  it ('should emit the correct events', function(done) {
    var tl = Timeline(1250, 250);
    var current = 0;

    tl.on('position', function(pos) {
      expect(tl.state).to.be.equal('playing');
      expect(pos.position).to.be.equal(current);
      if (current === 1250) return;
      current += 250;
    });

    tl.on('ended', function() {
      expect(current).to.be.equal(1250);
      done();
    });

    tl.play();
  });

  it('should handle pause correctly', function(done) {
    var tl = Timeline(1000, 500);
    tl.play();
    expect(tl.state).to.be.equal('playing');
    setTimeout(function() {
      expect(tl.position).to.be.equal(0);
      tl.pause();
      var lastPos = tl.position;
      expect(lastPos).to.be.above(249);
      expect(lastPos).to.be.below(270);
      expect(tl.state).to.be.equal('paused');
      tl.play();
      tl.once('position', function(pos) {
        expect(tl.state).to.be.equal('playing');
        expect(pos.position).to.be.equal(lastPos + 500);
      });
    }, 250);

    tl.once('ended', function() {
      done();
    });
  });


  it('should handle jumpTo correctly', function(done) {
    var tl = Timeline(1000, 100);
    tl.play();
    tl.jumpTo(900);
    tl.once('position', function(pos) {
      expect(pos.position).to.be.equal(1000);
      done();
    });
  });
});
