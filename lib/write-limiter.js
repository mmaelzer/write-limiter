var util = require('util');
var Transform = require('stream').Transform;

function Limiter(options) {
  var interval = typeof options === 'number' ? options : options.interval;
  options = typeof options === 'object' ? options : {};
  Transform.call(this, options);
  this.interval = interval
  this.lastPush = 0;
  this.timeout = null;
  this.on('finish', function() {
    clearTimeout(this.timeout);
  });
}
util.inherits(Limiter, Transform);

Limiter.prototype._transform = function(chunk, encoding, done) {
  clearTimeout(this.timeout);

  var sinceLastPush = Date.now() - this.lastPush;
  var timeRemaining = this.interval - sinceLastPush;

  this.timeout = setTimeout(function(){
    this.push(chunk);
    this.lastPush = Date.now();
  }.bind(this), timeRemaining < 0 ? 0 : timeRemaining);

  done();
};

module.exports = Limiter;