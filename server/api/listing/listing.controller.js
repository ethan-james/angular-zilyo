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
        "latitude" : parts.query.latitude,
        "longitude" : parts.query.longitude,
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