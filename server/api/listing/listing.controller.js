'use strict';

var _ = require('lodash'),
    unirest = require('unirest'),
    url = require('url');

// Get list of listings
exports.index = function(req, res) {
  var uri = "https://zilyo.p.mashape.com/search",
      parts = url.parse(req.url, true),
      params = { 
        "isinstantbook" : true,
        "nelatitude" : parts.query.nelatitude,
        "nelongitude" : parts.query.nelongitude,
        "swlatitude" : parts.query.swlatitude,
        "swlongitude" : parts.query.swlongitude,
        "resultsperpage" : parts.query.resultsperpage || 20,
        "page" : parts.query.page || 1,
        "provider" : "airbnb%2Chousetrip"
      };

  uri += "?" + _.map(params, function (value, key) { return key + "=" + value; }).join("&");

  unirest.post(uri)
    .header('X-Mashape-Key', 'wtsog55yMfmsh1DuqqwylB6iWuoup1Oyg8DjsngvFfzJek6DcQ')
    .header('Accept', 'application/json')
    .end(function (response) {
      res.json(response.body);
    });
};

exports.count = function (req, res) {
  var uri = "https://zilyo.p.mashape.com/count",
      parts = url.parse(req.url, true),
      params = { 
        "isinstantbook" : true,
        "nelatitude" : parts.query.nelatitude,
        "nelongitude" : parts.query.nelongitude,
        "swlatitude" : parts.query.swlatitude,
        "swlongitude" : parts.query.swlongitude,
        "resultsperpage" : parts.query.resultsperpage || 20,
        "provider" : "airbnb%2Chousetrip"
      };

  uri += "?" + _.map(params, function (value, key) { return key + "=" + value; }).join("&");

  unirest.post(uri)
    .header('X-Mashape-Key', 'wtsog55yMfmsh1DuqqwylB6iWuoup1Oyg8DjsngvFfzJek6DcQ')
    .header('Accept', 'application/json')
    .end(function (response) {
      res.json(response.body);
    });
};