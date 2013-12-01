var path = require('path');

exports.dbs = [
  'db1',
  'db2'
];

exports.docs = (function (limit) {
  var results = [];

  for (var i = 0; i < limit; i++) {
    results.push({
      derp: i
    });
  }

  return results;
})(100);