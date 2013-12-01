var replicator = require('../'),
    fixtures = require('./fixtures'),
    pouchdb = replicator(require('pouchdb')),
    async = require('async'),
    assert = require('assert');

describe('replicator', function () {
  this.timeout(15000);

  var dbs = fixtures.dbs,
      docs = fixtures.docs,
      replicator = pouchdb.replicator();

  beforeEach(function (done) {
    var db1 = new pouchdb(dbs[0]);

    db1.bulkDocs({docs: docs}, done);
  });

  afterEach(function (done) {
    var dbs_to_destroy = dbs
          .concat('_replicator')
          .map(function (db_name) {
            return function (done) {
              pouchdb.destroy(db_name, function (err) {
                if (err) {
                  if (err.status === 404) {
                    done();
                  } else {
                    done(err);
                  }
                } else {
                  done();
                }
              });
            };
          });

    async.parallel(dbs_to_destroy, done);
  });

  it('should replicate docs', function (done) {
    async.series([
      function (done) {
        replicator.post({
          source: dbs[0],
          target: dbs[1],
          create_target: true,
          complete: done
        });
      },
      function (done) {
        var results = new pouchdb(dbs[1]);

        results.allDocs({
          limit: 0
        }, function (err, res) {
          assert.equal(res.total_rows, docs.length);
          done(err);
        });
      }
    ], done);
  });

  it('should stop replications when their doc is deleted', function (done) {
    async.waterfall([
      function (done) {
        var doc = {
          source: dbs[0],
          target: dbs[1],
          create_target: true
        };
        replicator.post(doc, done);
      },
      function (res, done) {
        replicator.get(res._id, function (err, doc) {
          if (err) throw err;
          replicator.remove(doc, done);
        });
      },
      function (res, done) {
        var results = new pouchdb(dbs[1]);

        results.allDocs({
          limit: 0
        }, function (err, res) {
          assert.notEqual(res.total_rows, docs.length);
          done(err);
        });
      }
    ], function (err) {
      console.log(err);
      done(err);
    });
  });
});