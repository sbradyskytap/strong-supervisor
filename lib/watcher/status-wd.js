'use strict';
var tracer = require('../tracer');

exports.worker = function(handle) {
  setImmediate(function() {
    var wd = {
      cmd: 'status:wd',
      pwd: process.env.PWD,
      cwd: process.cwd(),
      pid: process.pid,
      isTracing: !!tracer(),
    };
    handle.emit(wd);
  });
};

exports.master = function(handle) {
  handle.on('status:wd', function(msg, worker) {
    // Mix-in the worker identity: startTime is known only in the master, and
    // worker.id is just convenient to do here.
    msg.pst = worker.startTime;
    msg.id = worker.id;
    handle.send(msg);
  });
};