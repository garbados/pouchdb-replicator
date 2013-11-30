var replicator = require('../'),
    pouchdb = replicator(require('pouchdb')),
    async = require('async'),
    fs = require('fs');

var docs = [
  {
    'omg': 1
  }, {
    'dom': 2
  }
];

async.series([
  function (done) {
    var db1 = new pouchdb('db1');
    db1.bulkDocs({docs: docs}, done);
  },
  function (done) {
    pouchdb.replicator().post({
      source: 'db1',
      target: 'db2',
      create_target: true,
      complete: done
    });
  }
], function (err) {
  if (err) {
    throw err;
  } else {
    var results = new pouchdb('db2');

    results.allDocs(function (err, res) {
      if (err) {
        throw err;
      } else if (res.rows.length !== docs.length) {
        console.log(res.rows.length, '!==', docs.length);
      }
    });
  }
});