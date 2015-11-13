'use strict';

var _ = require('lodash'),
    unirest = require('unirest'),
    url = require('url'),
    API_KEY = 'wtsog55yMfmsh1DuqqwylB6iWuoup1Oyg8DjsngvFfzJek6DcQ';

function post(uri, callback) {
  unirest.post(uri).header('X-Mashape-Key', API_KEY).header('Accept', 'application/json').end(callback);  
}

function search(uri) {
  return url.parse(uri, true).search;
}

// Get list of listings
exports.index = function(req, res) {
  post("https://zilyo.p.mashape.com/search" + search(req.url), function (response) {
    res.json(response.body);
  });
};

exports.count = function (req, res) {
  post("https://zilyo.p.mashape.com/count" + search(req.url), function (response) {
    res.json(response.body);
  });
};