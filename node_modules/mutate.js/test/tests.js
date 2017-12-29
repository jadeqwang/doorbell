var expect = require('expect.js');
var mutate = require('../mutate');

describe('mutate tests', function () {

  it('should run the correct method', function () {
    var myMutate = mutate(function (arg) {
      if (arg) {
        return 'default-' + arg;
      }
      return 'default';
    })

      .method(['array', 'string'], function (arr, str) {
        return 'array-string';
      })

      .method(['number', 'object'], function (num, obj) {
        return 'number-object';
      })

      .method(['function'], function (def, fn) {
        return def('function');
      })

      .close();

    expect(myMutate(1, 1, 1)).to.equal('default-1');
    expect(myMutate([], 'test')).to.equal('array-string');
    expect(myMutate(1, {})).to.equal('number-object');
    expect(myMutate(function () {
    })).to.equal('default-function');
  });

  it('should sum the values', function () {

    var sum = mutate(function () {
      return Array.prototype.reduce.call(arguments, function (memo, val) {
        return memo + val;
      }, 0);
    })
      .method(['array'], function (done, arr) {
        return done.apply(done, arr);
      })
      .method(['object'], function (done, obj) {
        var arr = [];
        for (var key in obj) {
          arr.push(obj[key]);
        }
        return done.apply(done, arr);
      })
      .close();

    expect(sum(1, 2, 3)).to.equal(6);
    expect(sum([1, 2, 3])).to.equal(6);
    expect(sum({ prop1: 1, prop2: 2, prop3: 3})).to.equal(6);
  });

  it('should turn the array into a function', function () {

    var somefn = mutate(function (opts) {
      expect(opts.foo).to.equal('test1');
      expect(opts.bar).to.equal('test2');
    })
      .method(['string', 'string'], ['foo', 'bar'])
      .close();

    somefn('test1', 'test2');

  });

});