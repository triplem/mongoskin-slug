/*global describe, it */
"use strict";

var should = require('should')
  , async = require('async')
  , db = require('./db')()
  , slug = require('../lib/mongoskin-slug');

describe('mongoskin-slug', function () {

  var description = 'A test Slug (should add and recognize)';
  var descriptionNew = 'A test Slug (should add and recognized later as well)';

  var textSlug = slug.createSlug(description);
  var textSlugNew = slug.createSlug(descriptionNew);

  var testCollectionObject = {
    id: '4711',
    slug: [textSlug],
    description: description
  };

  var testCollectionNewObject = {
    id: '4712',
    slug: [textSlug],
    description: 'another description'
  };

  var collectionName = 'testCollection';
  var testCollection;

  // create an empty collection
  beforeEach(function (done) {
    db.createCollection(collectionName, function (err, collection) {
      if (err) {
        console.log('error during test initialization: ', err);
      }

      testCollection = collection;

      done();
    });
  });

  // drop the collection
  afterEach(function (done) {
    testCollection.drop(function (err) {
      if (err) {
        console.log('error during test teardown: ', err);
      }

      testCollection = null;

      done();
    });
  });

  it('should create slug index if it does not exist', function (done) {

    slug.initSlug(db, collectionName, function (err, info) {
      should.not.exist(err);
      info.should.equal('slug_1');
      done();
    });

  });

  it('should not create slug index if it does already exist', function (done) {

    async.series([
      function (callback) {
        slug.initSlug(db, collectionName, function (err, info) {
          should.not.exist(err);
          info.should.equal('slug_1');

          callback(err, info);
        });
      },
      function (callback) {
        slug.initSlug(db, collectionName, function (err, info) {
          should.not.exist(err);
          info.should.equal('slug_1');

          callback(err, info);
        });
      }
    ],
    function (err, info) {
      should.not.exist(err);
      should.exist(info);

      done();
    });

// async call structure without the usage of "async"
//    slug.initSlug(db, collectionName, function (err, info) {
//      should.not.exist(err);
//      info.should.equal('slug_1');
//
//      slug.initSlug(db, collectionName, function (err, info) {
//        should.not.exist(err);
//        info.should.equal('slug_1');
//        done();
//      });
//
//    });

  });

  it('should add a slug and recognize it', function (done) {
    async.waterfall([
      function (callback) {
        slug.initSlug(db, collectionName, function (err, info) {
          should.not.exist(err);
          info.should.equal('slug_1');

          callback(err, info);
        });
      },
      function (info, callback) {
        testCollection.insert(testCollectionObject, function (err, objects) {
          should.not.exist(err);
          should.exists(objects[0]._id);

          var compareId = objects[0]._id;

          callback(err, compareId);
        });
      },
      function (compareId, callback) {
        slug.findBySlug(db, collectionName, testCollectionObject.slug, function (err, object) {
          should.not.exist(err);
          should.exists(object._id);

          object._id.should.eql(compareId);

          callback(err, object);
        });
      }
    ],
    function (err, object) {
      should.not.exist(err);
      should.exist(object);

      done();
    });

// dunno what is easier, above or this one?
//    slug.initSlug(db, collectionName, function (err, info) {
//      should.not.exist(err);
//      info.should.equal('slug_1');
//
//      testCollection.insert(testCollectionObject, function (err, objects) {
//        should.not.exist(err);
//        should.exists(objects[0]._id);
//
//        var compareId = objects[0]._id;
//
//        slug.findBySlug(db, collectionName, testCollectionObject.slug, function (err, object) {
//          should.not.exist(err);
//          should.exists(object._id);
//
//          object._id.should.eql(compareId);
//
//          done();
//        });
//
//      });
//
//    });

  });

  it('should add a slug and recognize it, even when slug is changed (keep history of slugs)', function (done) {
    slug.initSlug(db, collectionName, function (err, info) {
      should.not.exist(err);
      info.should.equal('slug_1');

      testCollection.insert(testCollectionObject, function (err, objects) {
        should.not.exist(err);
        should.exists(objects[0]._id);

        var compareId = objects[0]._id;

        slug.findBySlug(db, collectionName, textSlug, function (err, object) {
          should.not.exist(err);
          should.exists(object._id);

          object._id.should.eql(compareId);

          object.slug.push(textSlugNew);

          testCollection.save(object, {safe: true}, function (err, object) {
            should.not.exist(err);

            // 1 if updated, obj if inserted, in this case 1
            object.should.equal(1);

            slug.findBySlug(db, collectionName, textSlug, function (err, object) {
              should.not.exist(err);
              should.exists(object._id);

              object._id.should.eql(compareId);

              object.slug[0].should.equal(textSlug);
              object.slug[1].should.equal(textSlugNew);

              done();
            });
          });
        });
      });
    });

  });

  it('should throw error, if the slug is already in the history', function (done) {
    slug.initSlug(db, collectionName, function (err, info) {
      should.not.exist(err);
      info.should.equal('slug_1');

      testCollection.insert(testCollectionObject, function (err, objects) {
        should.not.exist(err);
        should.exists(objects[0]._id);

        testCollection.insert(testCollectionNewObject, function (err, objects) {

          should.exist(err);
          err.code.should.equal(11000);
          err.name.should.equal('MongoError');
          err.err.should.include(textSlug);

          should.not.exists(objects);

          done();
        });
      });
    });

  });

  it('should generate a valid url-slug from a string', function (done) {
    var tests = [
      ['A useful String', 'a-useful-string'],
      ['using a lot of Umlauts öäüÖÜÄ', 'using-a-lot-of-umlauts-oeaeueoeueae'],
      ['using a lot of Special characters !§$%&/()=?*+#-', 'using-a-lot-of-special-characters-and'],
    ];

    for (var t in tests) {
      var test = tests[t];
      slug.createSlug(test[0]).should.equal(test[1]);
    }

    should.not.exist(slug.createSlug(''));
    should.not.exist(slug.createSlug(null));

    done();
  });

});
