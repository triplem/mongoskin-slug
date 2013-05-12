"use strict";
var urlify = require('urlify').create({
  addEToUmlauts: true,
  szToSs: true,
  spaces: '-',
  nonPrintable: '-',
  trim: true,
  toLower: true
});

module.exports.initSlug = function (db, collection, callback) {

  db.collection(collection).ensureIndex('slug', {unique: true}, function (err, indexName) {
    callback(err, indexName);
  });

};

module.exports.createSlug = function (string) {
  if (string) {
    return urlify(string);
  } else {
    return null;
  }
};

module.exports.findBySlug = function (db, collection, slug, callback) {

  db.collection(collection).hint = 'slug';
  db.collection(collection).findOne({slug : slug}, function (err, item) {
    callback(err, item);
  });

};
