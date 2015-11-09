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
    var _authResponse = {};

    this.init = function (settings) {
      ['status', 'cookie', 'xfbml', 'appId', 'version', 'locale', 'scope']
      .forEach(function (st) {
        if (settings[st])
          _settings[st] = settings[st];
      });
    };

    this.getSettings = function(){
      // return a copy of the object to avoid external side effects
      return JSON.parse(JSON.stringify(_settings));
    };

    this.$get = [
      '$window', '$q', '$timeout',
      function ($window, $q, $timeout) {

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

            }, {
              scope: _settings.scope
            });
          }

          return deferred.promise;
        }

        return {
          login: _login,
          getAuthResponse: _authResponse,
          getAccessToken: function () {
            return _authResponse.accessToken || false;
          }
        };

      }
    ];

  });

})(angular.module("htauth"), document);
