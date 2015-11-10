(function (module, document) {
  "use strict";

  module.
  provider('htauth.google', function htauthFacebookProvider() {

    var _GA_INITIALIZED = false;

    // the Google Auth Object used to sign in the user and initialized
    // by the gapi init function
    var GoogleAuth;

    // general settings for facebook sdk
    // they can be initialized during htauth.facebookProvider config phase
    var _settings = {};

    this.init = function (settings) {
      []
      .forEach(function (st) {
        if (settings[st])
          _settings[st] = settings[st];
      });
    };

    this.getSettings = function () {
      // return a copy of the object to avoid external side effects
      return JSON.parse(JSON.stringify(_settings));
    };

    this.$get = [
      '$window', '$q', '$timeout',
      function ($window, $q, $timeout) {

        $window.onLoadCallback = function () {
          // Executed when the SDK is loaded

          gapi.load('auth2', function () {
            GoogleAuth = gapi.auth2.init(_settings);

            // the Google Auth is ready and initialized
            _GA_INITIALIZED = true;
          });

        };

        (function (d) {
          // async load the Facebook javascript SDK
          var js,
            id = 'google-jssdk',
            ref = d.getElementsByTagName('script')[0];

          if (d.getElementById(id)) {
            // google already loaded
            return;
          }

          js = d.createElement('script');
          js.id = id;
          js.async = true;
          js.defer = true;
          js.src = "//apis.google.com/js/platform.js?onload=onLoadCallback";

          ref.parentNode.insertBefore(js, ref);
        }(document));


        function _login() {
          var deferred = $q.defer();

          function check_init() {
            if (!_GA_INITIALIZED)
              return $timeout(check_init, 500);
            else
              _inner_login();
          }
          check_init();

          function _inner_login() {

            console.log("inner login");

          }

          return deferred.promise;
        }

        return {
          login: _login,
        };

      }
    ];

  });

})(angular.module("htauth"), document);
