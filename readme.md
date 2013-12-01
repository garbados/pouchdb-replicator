# pouchdb.replicator

[![Build Status](https://travis-ci.org/garbados/pouchdb-replicator.png)](https://travis-ci.org/garbados/pouchdb-replicator)
[![Coverage Status](https://coveralls.io/repos/garbados/pouchdb-replicator/badge.png)](https://coveralls.io/r/garbados/pouchdb-replicator)

Create replications that persist across restarts, like CouchDB's [_replicator](https://gist.github.com/fdmanana/832610).

    var pouchdb = require('pouchdb');

    // add replicator object to pouchdb global
    require('pouchdb.replicator')(pouchdb);

    var db1 = new pouchdb('db1'),
        replicator = pouchdb.replicator(),
        docs = [...];

    async.series([
      function (done) {
        db1.bulkDocs({
          docs: docs
        }, done);
      },
      function (done) {
        replicator.post({
          source: 'db1',
          target: 'db2',
          create_target: true,
          complete: done
        });
      },
      function (done) {
        var db2 = new pouchdb('db2');

        db2.allDocs(function (err, res) {
          if (err) {
            done(err);
          } else {
            done(null, res.rows.length === docs.length);
          }
        });
      }
    ], function (err, res) {
      if (err) throw err;

      var replication_success = res.slice(-1)[0];
      console.log(replication_success);
      // true
    });

`replicator` documents are persisted to disk, and restarted whenever the `replicator` is re-instantiated. Deleting documents from the `replicator` cancels those replications.

## Install

For node.js:

    TBD

For the browser

    TBD

## License

[MIT](http://opensource.org/licenses/MIT), yo.