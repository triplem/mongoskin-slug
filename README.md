# mongoskin-slug [![Build Status](https://travis-ci.org/triplem/mongoskin-slug.png?branch=master)](http://travis-ci.org/triplem/mongoskin-slug) [![Dependency Status](https://gemnasium.com/triplem/mongoskin-slug.png)](https://gemnasium.com/triplem/mongoskin-slug) [![NPM version](https://badge.fury.io/js/mongoskin-slug.png)](http://badge.fury.io/js/mongoskin-slug) [![Coverage Status](https://coveralls.io/repos/triplem/mongoskin-slug/badge.png)](https://coveralls.io/r/triplem/mongoskin-slug)

A module to provide some insight into the usage of slugs with mongodb and nodejs. Right now this solution uses [mongoskin](https://github.com/kissjs/node-mongoskin),
but it should be pretty easy adaptable to [mongodb](https://github.com/mongodb/node-mongodb-native) or [monk](https://github.com/LearnBoost/monk) as well.

## Motivation
Slugs are a very common approach to provide urls to articles, products, etc. There are already a couple of generators for these slugs
in nodejs, e.g.

+ [slug](https://github.com/dodo/node-slug)
+ [slugs](https://github.com/Aaronontheweb/node-slugs)
+ [friendlyjs](https://github.com/nakedslavin/FriendlyJs)
+ [urlify](https://github.com/Gottox/node-urlify)

These are generators and do not provide any help with storing and/or fetching these slugs in mongodb. IMHO there is a need for this,
because a slug should provide a couple of features, which should be reflected by the feature set of an application using slugs:

+ uniqueness, so that one slug is used by exactly one thing (be it an article, a product, an event or ...)
+ historic, s slug should only be used by one thing and this over the whole time, so if the thing e.g. changes its name
  the old slug should be still there and provide a 302 or something similar to the latest slug (this is of course
  debateable, since a product with the same name could be established, therefor we should offer a method of offer this
  as well).

Note: with [mongoose](http://mongoosejs.com/) you should be able to use [mongoose-uniqueslugs](https://github.com/punkave/mongoose-uniqueslugs),
which provides an easy way to generate and use slugs, except the history of slugs, but I could be wrong on this one.

To create nice slugs, we are right now using [urlify](https://github.com/Gottox/node-urlify).

## Usage

This module provides basic usage example (speak: tests) to show, how to implement a slug generation and handling with
mongoskin. Probably in the future we are building a framework from these ;-)


## LICENSE

Copyright (c) 2013 Markus M. May

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
