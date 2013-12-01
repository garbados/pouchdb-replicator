var path = require('path');

var Replicator = function (PouchDB) {
  PouchDB.replicator = function (prefix) {
    var db = new PouchDB(path.join(prefix || '', '_replicator')),
        replications = {};

    function startReplication (change) {
      if (change && change.doc) {
        var doc = change.doc,
            source = doc.source,
            target = doc.target;

        if (source && target) {
          var promise = PouchDB.replicate(source, target, doc);
          replications[doc._id] = promise;
        } else {
          // make a fuss
        }
      }
    }

    db.changes({
      include_docs: true,
      continuous: true,
      onChange: startReplication
    });

    return db;
  }

  return PouchDB;
};

module.exports = Replicator;