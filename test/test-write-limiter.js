var Limiter = (function(coverage) {
  return coverage
    ? require('../index-cov')
    : require('../');
})(process.env.USE_COVERAGE);

exports.limiterNumConstructorTest = function(t) {
  var limit = new Limiter(100);
  var called = 0;
  limit.on('data', function(data) {
    called++;
  });

  for (var i = 0; i < 10; i++) {
    limit.write('hi');
  }

  setTimeout(function() {
    t.equal(called, 1);
    t.done();
  }, 50);
};

exports.limiterObjConstructorTest = function(t) {
  var limit = new Limiter({
    interval: 50,
    objectMode: true
  });
  var called = 0;
  limit.on('data', function(data) {
    called++;
  });

  var timeout;
  (function exec() {
    for (var i = 0; i < 10; i++) {
      limit.write('hi');
    }
    timeout = setTimeout(exec, 50);
  })();

  setTimeout(function() {
    t.equal(called, 4);
    clearTimeout(timeout);
    t.done();
  }, 210);
};

exports.limiterFinish = function(t) {
  var limit = new Limiter(50);
  var called = 0;
  var msg;
  limit.on('data', function(data) {
    called++;
    msg = data.toString();
  });

  (function exec() {
    for (var i = 0; i < 10; i++) {
      limit.write('hi');
    }
    if (called == 4) {
      limit.write('boop');
      // This will clear the last write from ever being called
      limit.emit('finish');
      return;
    }
    setTimeout(exec, 50);
  })();

  setTimeout(function() {
    t.equal(called, 4);
    t.equal(msg, 'hi');
    t.done();
  }, 210);
};
