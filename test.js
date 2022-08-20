var assert = require('assert'),
    getpid = require('./');

getpid('node')
  .then((pids) => {
    assert(pids?.includes(process.pid), 'Failed to find this process in list of pids.');

    console.log('PID for this process found OK!');
  }, (err) => {
    assert.ifError(err);
  });

getpid(`not-a-real-process-${Math.floor(Math.random() * 1e10).toString(36)}`)
  .then((pids) => {
    assert(pids?.length === 0, 'Expected not to find a pid for a fake process name.');

    console.log('PID for unknown process not found');
  }, (err) => {
    assert.ifError(err);
  });
