## mutate.js

mutate.js brings function overloading to javascript.

### Sample

```javascript

var sum = mutate(function() {
    return Array.prototype.reduce.call(arguments, function(memo, val) {
        return memo + val;
    }, 0);
})
.method(['array'], function(done, arr) {
    return done.apply(done, arr);
})
.method(['object'], function(done, obj) {
    var arr = [];
    for (var key in obj) {
        arr.push(obj[key]);
    }
    return done.apply(done, arr);
})
.close();

sum(1, 2, 3); // => 6
sum([1, 2, 3]); // => 6
sum({ prop1: 1, prop2: 2, prop3: 3}); // => 6

```

### Installation

```
bower install mutate.js
```


## License
Copyright (c) 2014 Simon Kusterer
Licensed under the MIT license.