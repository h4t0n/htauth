# htauth
> A simple Angular module to abstract Social Login (Facebook, Twitter, Google, ...)

## Available Providers
* [Facebook](#Facebook-Login-Provider)
* [Google](#Google-Login-Provider)

## Planned Providers
* Twitter (..future)

## Install
TODO (add the module to bower repository)

## Usage
### Facebook Login Provider
#### Full Example
```javascript
angular
  .module('testapp', ['htauth'])
  .config(['htauth.facebookProvider', function(facebookProvider) {

    facebookProvider.init({
      appId: '174327009577654', //my app id
      locale: 'it_IT' // I'm a proud italian.
    })

  }])
  .controller('testFacebook', [
    'htauth.facebook',
    function(facebook) {
      // you can use:
      // facebook.login()
      // facebook.isLogged()
      // facebook.getAuthResponse()
      // facebook.getAccessToken()

      //NB: the provider automatically check if the user is already logged in your app
      // therefore a common flow may be

      //.. your code
        if(!facebook.isLogged())
          facebook.login().then(function(authResponse){
            // use authResponse.accessToken
          });
        else {
          // use facebook.getAuthResponse()
          // or simply facebook.getAccessToken()
        }
      //.. your code

    }
  ]);
```

#### Provider Configuration
Settings for provider configuration are described in Facebook Official Documentation ([here](https://developers.facebook.com/docs/javascript/reference/FB.init/v2.5) and [here](https://developers.facebook.com/docs/facebook-login/web)).

##### facebookProvider.init(SettingsObject)

```javascript
// Default settings are
{
  appId: false, // specify your APP ID
  cookie: true,
  locale: "en_US",
  status: true,
  version: "v2.5",
  xfbml: false,
  scope: "public_profile,email"
}
```

```javascript
angular   // include htauth as dependecy
  .module('YourAPP', ['htauth'])
  .config(['htauth.facebookProvider', function(facebookProvider){

    // configure the facebookProvider with init settings
    // init settings are the same as Facebook Documentation
    // more info here: https://developers.facebook.com/docs/javascript/reference/FB.init/v2.5
    facebookProvider.init({
      appId : '174327009577654', // your app id
      locale: 'it_IT' // default locale is en_us
    })


  }])
```

#### Provider Instance API

#### facebook.login()
A *Promise* function that resolves when user correctly login to the App and reject if the user does not authorize your app or is not logged to facebbok.  

```javascript
angular   
  // ...something
  .controller('yourController', [
    'htauth.facebook',
    function(facebook) {

      //... code

      // open the facebook login modal
      // and get auth response as a promise
      facebook.login()
        .then(function(authResponse) {
          // user logged in, authResponse is
          // the object coming from Facebook

          // authResponse.accessToken may be useful

        })
        .catch(function(error) {
          // handle error;
        });

      //... code

      }

    }
  ]);
```

#### facebook.isLogged()
**true** if the user is logged in **false** otherwise

#### facebook.getAuthResponse()
get the AuthResponse Object coming from Facebook sdk (if the user is logged in)

#### facebook.getAccessToken()
get the accessToken (same as getAuthResponse().accessToken) if the user is logged in

### Google Login Provider
#### Full Example
```javascript
angular
  .module('testapp', ['htauth'])
  .config(['htauth.googleProvider', function(googleProvider) {

    googleProvider.init({
      client_id: '725412889739-g3iihggrd9ut7m9d8qhs65lal6k8v9q7.apps.googleusercontent.com' // my app id
    })

  }])
  .controller('testGoogle', [
    'htauth.google',
    function(google) {
      // you can use:
      // google.login()
      // google.isLogged()
      // google.getAuthResponse()
      // google.getIdToken()


      //NB: the provider automatically check if the user is already logged in your app
      // therefore a common flow may be

      //.. your code
        if(!google.isLogged())
          google.login().then(function(authResponse){
            // use authResponse (the same object coming from google APIS)
          });
        else {
          // use google.getAuthResponse()
          // or simply google.getIdToken()
        }
      //.. your code

    }  
  ]);
```

#### Provider Configuration
Settings for provider configuration are described in Google Official Documentation ([here](https://developers.google.com/identity/sign-in/web/reference?hl=it#gapiauth2initwzxhzdk19paramswzxhzdk20)).

```javascript
// Default settings are the same as Google init
{
  client_id: false, // specify your APP ID
  cookie_policy: 'single_host_origin',
  fetch_basic_profile: true, // scope is profile, email
  scope:  // optional if fetch_basic_profile is true
}
```

```javascript
angular   // include htauth as dependecy
  .module('YourAPP', ['htauth'])
  .config(['htauth.googleProvider', function(googleProvider){

    // configure the googleProvider with init settings
    // init settings are the same as Google Documentation
    // more info here: https://developers.google.com/identity/sign-in/web/reference?hl=it#gapiauth2initwzxhzdk19paramswzxhzdk20)
    googleProvider.init({
      client_id: '725412889739-g3iihggrd9ut7m9d8qhs65lal6k8v9q7.apps.googleusercontent.com' // your app id here
    })


  }])
```

#### Provider Instance API

#### google.login()
A *Promise* function that resolves when user correctly login to the App and reject if the user does not authorize your app or is not logged to google.  

```javascript
angular   
  // ...something
  .controller('yourController', [
    'htauth.google',
    function(google) {

      //... code

      // open the facebook login modal
      // and get auth response as a promise
      google.login()
        .then(function(authResponse) {
          // user logged in, authResponse is
          // the object coming from Google

          // authResponse.id_token may be useful

        })
        .catch(function(error) {
          // handle error;
        });

      //... code

      }

    }
  ]);
```

#### google.isLogged()
**true** if the user is logged in **false** otherwise

#### google.getAuthResponse()
get the AuthResponse Object coming from Google sdk (if the user is logged in)

#### google.getIdToken()
get the id_token (same as getAuthResponse().id_token) if the user is logged in

## Dev and Build
TODO

## Test
TODO  

## License
MIT © [Andrea Tarquini](http://h4t0n.com) aka [@h4t0n](http://twitter.com/h4t0n)
