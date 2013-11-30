var Replicator = function (PouchDB) {
  PouchDB.replicator = function (prefix) {
    var db = new PouchDB([prefix || '', '_replicator'].join(''));

    function startReplication (change) {
      if (change && change.doc) {
        var doc = change.doc,
            source = doc.source,
            target = doc.target;

        // remove the source and target field
        // so only the options remain
        delete doc.source;
        delete doc.target;

        PouchDB.replicate(source, target, doc);
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