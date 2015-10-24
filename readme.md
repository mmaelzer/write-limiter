write-limiter
==================
  
A node.js stream implementation that takes a stream and throttles the writes in a time-based fashion.
  
[![build status](https://secure.travis-ci.org/mmaelzer/write-limiter.png)](http://travis-ci.org/mmaelzer/write-limiter)
[![Coverage Status](https://coveralls.io/repos/mmaelzer/write-limiter/badge.svg?branch=master&service=github)](https://coveralls.io/github/mmaelzer/write-limiter?branch=master)

### Install
```
npm install write-limiter
```  
----------------------  

### Usage

```javascript
var Limiter = require("write-limiter");
var limiter = new Limiter(500);
// or
var otherLimiter = new Limiter({
  interval: 500,
  objectMode: true
})
```

**Constructor(Number|Object)**: The constructor takes either a single `number` argument or an `object` with an `interval` property. Passing an `object` allows for passing along node.js `Stream` arguments to the underlying through stream parent class.  
  
The provided `number` or `interval` property represents how long, in milliseconds, to wait between writes.

----------------------  
### Example
Using `write-limiter` to limit jpegs coming from an [mjpeg-consumer](https://github.com/mmaelzer/mjpeg-consumer) stream to, at-most, 5 frames per second:

```javascript
var Limiter = require("write-limiter");

var request = require("request");
var MjpegConsumer = require("mjpeg-consumer");
var FileOnWrite = require("file-on-write");

var writer = new FileOnWrite({
  path: './video',
  ext: '.jpg'
});
var consumer = new MjpegConsumer();

var limiter = new Limiter(200);

request("http://192.168.1.2/videostream.cgi").pipe(consumer).pipe(limiter).pipe(writer);
```
