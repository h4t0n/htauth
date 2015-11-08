(function (module,document) {
  "use strict";

  module.
  provider('htauth.facebook', function htauthFacebookProvider() {

    var _FB_INITIALIZED = false,
      _APPID = '174327009577654',
      _STATUS = true,
      _COOKIE = true,
      _XFBML = false,
      _VERSION = 'v2.5',
      _LOCALE = 'en_US',
      _SCOPE = 'public_profile,email';

    var _authResponse = false;

    this.$get = [
      '$window', '$q', '$timeout',
      function ($window, $q, $timeout) {

        $window.fbAsyncInit = function () {
          // Executed when the SDK is loaded
          FB.init({
            appId: _APPID,
            status: _STATUS,
            cookie: _COOKIE,
            xfbml: _XFBML,
            version: _VERSION
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
          js.src = "//connect.facebook.net/"+_LOCALE+"/all.js";

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
              scope: _SCOPE
            });
          }
          return deferred.promise;
        }

        return {
          login: _login,
          getAuthResponse: _authResponse,
          getAccessToken : function(){
            return _authResponse.accessToken || false;
          }
        };

      }
    ];

  });




})(angular.module("htauth"),document);
