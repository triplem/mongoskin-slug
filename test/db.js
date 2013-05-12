"use strict";
var mongoskin = require('mongoskin');

var db = mongoskin.db("localhost:27017/slug_test?auto_reconnect=true", {safe: true});

module.exports = function () {
  return db;
};
