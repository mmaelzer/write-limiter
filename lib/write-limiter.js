var util = require('util');
var Transform = require('stream').Transform;

function Limiter(options) {
  var interval = typeof options === 'number' ? options : options.interval;
  options = typeof options === 'object' ? options : {};
  Transform.call(this, options);
  this.interval = interval;
  this.lastPush = 0;
}
util.inherits(Limiter, Transform);

Limiter.prototype._transform = function(chunk, encoding, done) {
  var now = Date.now();
  if (now - this.lastPush >= this.interval) {
    this.push(chunk);
    this.lastPush = now;
  }
  done();
};

module.exports = Limiter;