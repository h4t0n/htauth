"use strict";

describe('Test Facebook provider', function () {

  var facebookProvider;
  var facebook;
  var $rootScope;

  // Instanciates the htauth module
  beforeEach(function () {
    module('htauth');
  });

  beforeEach(function () {
    module(['htauth.facebookProvider', function (fbProvider) {
      facebookProvider = fbProvider;
    }]);
  });

  beforeEach(function () {
    inject(['htauth.facebook', '$rootScope', function (fbInstance, _$rootScope) {
      facebook = fbInstance;
      $rootScope = _$rootScope;
    }]);
  });


  // And run your apply here
  afterEach(function () {
    $rootScope.$apply();
  });

  it('should get default settings', function () {
    var default_settings = facebookProvider.getSettings();
    expect(default_settings.appId).toBe(false);
    expect(default_settings.cookie).toBe(true);
    expect(default_settings.status).toBe(true);
    expect(default_settings.xfbml).toBe(false);
    expect(default_settings.version).toBe("v2.5");
    expect(default_settings.locale).toBe("en_US");
    expect(default_settings.scope).toBe("public_profile,email");
  });

  it('should set custom setting', function () {
    facebookProvider.init({
      appId: '174327009577654',
      cookie: true,
      status: true,
      xfbml: false,
      version: 'v2.5',
      locale: 'it_IT',
      scope: 'public_profile'
    });
    var settings = facebookProvider.getSettings();
    expect(settings.appId).toBe('174327009577654');
    expect(settings.cookie).toBe(true);
    expect(settings.status).toBe(true);
    expect(settings.xfbml).toBe(false);
    expect(settings.version).toBe("v2.5");
    expect(settings.locale).toBe("it_IT");
    expect(settings.scope).toBe("public_profile");
  });



});
