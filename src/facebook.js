(function (module, document) {
  "use strict";

  module.
  provider('htauth.facebook', function htauthFacebookProvider() {

    var _FB_INITIALIZED = false;

    // general settings for facebook sdk
    // they can be initialized during htauth.facebookProvider config phase
    var _settings = {};
    _settings.appId = false;
    _settings.cookie = true;
    _settings.status = true;
    _settings.xfbml = false;
    _settings.version = 'v2.5';
    _settings.locale = 'en_US';
    _settings.scope = 'public_profile,email';

    // once logged this variable stores the FB.login authResponse
    var _authResponse,
      _isLogged = false;

    this.init = function (settings) {
      ['status', 'cookie', 'xfbml', 'appId', 'version', 'locale', 'scope']
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

        $window.fbAsyncInit = function () {
          // Executed when the SDK is loaded
          FB.init({
            appId: _settings.appId,
            status: _settings.status,
            cookie: _settings.cookie,
            xfbml: _settings.xfbml,
            version: _settings.version
          });

          // the FB Global Object is ready and initialized
          _FB_INITIALIZED = true;

          FB.getLoginStatus(function (response) {
            // The response object is returned with a status field that lets the
            // app know the current login status of the person.
            // Full docs on the response object can be found in the documentation
            // for FB.getLoginStatus().
            if (response.status === 'connected') {
              // Logged into your app and Facebook.
              _authResponse = response.authResponse;
              _isLogged = true;
              $rootScope.$digest();
            }
          });
        };



        (function (d) {
          // async load the Facebook javascript SDK
          var js,
            id = 'facebook-jssdk',
            ref = d.getElementsByTagName('script')[0];


          if (d.getElementById(id)) {
            // facebook already loaded
            return;
          }

          js = d.createElement('script');
          js.id = id;
          js.async = true;
          js.src = "//connect.facebook.net/" + _settings.locale + "/all.js";

          ref.parentNode.insertBefore(js, ref);
        }(document));


        function _login() {
          var deferred = $q.defer();

          function check_init() {
            if (!_FB_INITIALIZED)
              return $timeout(check_init, 500);
            else
              _inner_login();
          }
          check_init();

          function _inner_login() {
            FB.login(function (response) {

              var e;

              if (!response.status) {
                e = new Error("response has not any status");
                e.name = "LoginError";
                deferred.reject(e);
              }

              switch (response.status) {
                case "connected":
                  _authResponse = response.authResponse;
                  _isLogged = true;
                  deferred.resolve(_authResponse || "logged");
                  break;
                case "not_authorized":
                  e = new Error("app not authorized");
                  e.name = "AuthorizationError";
                  deferred.reject(e);
                  break;
                default:
                  e = new Error("unknow response status");
                  e.name = "LoginError";
                  deferred.reject(e);
                  break;
              }
              $rootScope.$digest();

            }, {
              scope: _settings.scope
            });
          }

          return deferred.promise;
        }

        return {
          login: _login,
          isLogged: function () {
            return _isLogged;
          },
          getAuthResponse: function () {
            return _authResponse;
          },
          getAccessToken: function () {
            if (!_authResponse) return undefined;
            return _authResponse.accessToken || undefined;
          }
        };

      }
    ];

  });

})(angular.module("htauth"), document);
