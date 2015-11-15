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
    _settings.client_id = false;

    this.init = function (settings) {
      ['client_id', 'cookie_policy', 'scope', 'fetch_basic_profile', 'hosted_domain', 'openid_realm']
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
      '$window', '$q', '$timeout', '$rootScope',
      function ($window, $q, $timeout, $rootScope) {

        $window.onLoadCallback = function () {
          // Executed when the SDK is loaded

          gapi.load('auth2', function () {
            GoogleAuth = gapi.auth2.init(_settings);

            // the Google Auth is ready and initialized
            GoogleAuth.then(function () {
              _GA_INITIALIZED = true;
              $rootScope.$digest();
            });
          });

        };

        (function (d) {
          // async load the Facebook javascript SDK
          var js,
            id = 'google-jssdk',
            ref = d.getElementsByTagName('script')[0];

          if (d.getElementById(id) || $window.gapi) {
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

            GoogleAuth.signIn().then(function (GoogleUser) {
              $rootScope.$digest();
              deferred.resolve(GoogleUser.getAuthResponse());
            }, function (err) {
              if (err.reason)
                switch (err.reason) {
                  case "Access denied.":
                    e = new Error("app not authorized");
                    e.name = "AuthorizationError";
                    deferred.reject(e);
                    break;
                  default:
                    e = new Error(e.reason);
                    e.name = "LoginError";
                    deferred.reject(e);
                    break;
                }

            });

          }

          return deferred.promise;
        }

        function _isLogged() {
          return _GA_INITIALIZED && GoogleAuth.isSignedIn.get();
        }

        function _authResponse() {
          if (!_isLogged())
            return undefined;

          var GoogleUser = GoogleAuth.currentUser.get();
          return GoogleUser.getAuthResponse();
        }

        return {
          login: _login,
          isLogged: _isLogged,
          getAuthResponse: _authResponse,
          getIdToken: function () {
            var authResponse = _authResponse();
            if(authResponse)
              return authResponse.id_token;
            return undefined;
          }
        };

      }
    ];

  });

})(angular.module("htauth"), document);
