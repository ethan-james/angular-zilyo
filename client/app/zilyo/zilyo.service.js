'use strict';

angular.module('angularZilyoApp').service('zilyo', function ($http, $filter) {

  var fetch = function fetch(url, params, callbacks, context) {
    $http.get(url + "?" + $filter("parameterize")(params)).then(function(response) {
      if (callbacks && typeof callbacks.onFetch == "function") {
        callbacks.onFetch.call(context, JSON.parse(response.data));
      }
    }, function(response) {
      console.log(response); // log error
    });
  };

  var Zilyo = function Zilyo() {  
    this.baseUrl = "/api/v1/listings";
    this.countUrl = "/api/v1/listings/count";
  };

  Zilyo.prototype.refresh = function refresh(params, callbacks, context) {
    var baseUrl = this.baseUrl;

    $http.get(this.countUrl + "?" + $filter("parameterize")(params)).then(function(response) {
      var data = JSON.parse(response.data);

      if (callbacks && typeof callbacks.onCountResults == "function") {
        callbacks.onCountResults.call(context, data);
      }

      _.times(data.result.totalPages, function (i) {
        return fetch(baseUrl, angular.extend(params, { resultsperpage : 20, page : i + 1 }), callbacks, context);
      });

    }, function(response) {
      console.log(response); // log error
    });
  };

  return new Zilyo();
});
