var replicator = require('../'),
    fixtures = require('./fixtures'),
    pouchdb = replicator(require('pouchdb')),
    async = require('async'),
    assert = require('assert');

describe('replicator', function () {
  var dbs = fixtures.dbs,
      docs = fixtures.docs;

  beforeEach(function (done) {
    var db1 = new pouchdb(dbs[0]);
    db1.bulkDocs({docs: docs}, done);
  });

  afterEach(function (done) {
    var dbs_to_destroy = dbs
          .concat('_replicator')
          .map(function (db_name) {
            return pouchdb.destroy.bind(pouchdb, db_name);
          });

    async.parallel(dbs_to_destroy, done);
  });

  it('should replicate docs', function (done) {
    async.series([
      function (done) {
        pouchdb.replicator().post({
          source: dbs[0],
          target: dbs[1],
          create_target: true,
          complete: done
        });
      },
      function (done) {
        var results = new pouchdb(dbs[1]);

        results.allDocs(function (err, res) {
          assert.equal(res.rows.length, docs.length);
          done(err);
        });
      }
    ], done);
  });
});