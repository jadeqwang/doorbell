# timeline

yet another generic timeline node module.

### usage

```javascript

var timeline = require('time-line');

// create new timeline with a length
// of 10 secs
var tl = timeline(10000);

// start playback
tl.play();

// receive position updates
tl.on('position', function(pos) {
  console.log('current position', pos.position);
});

// get the current position
console.log('current position', tl.getPosition());

// jump to a specific position
tl.jumpTo(5000);

// catch ended event
tl.on('ended', function() {
  console.log('playback ended');
});


```

### Installation

`npm install time-line`

## License
Copyright (c) 2014 Simon Kusterer
Licensed under the MIT license.
