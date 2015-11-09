htauth
=======
> A simple Angular module to abstract Social Login (Facebook, Twitter, Google, ...)

## Install
TODO (add the module to bower repository)

## Usage

### Facebook Login Provider

#### Simple Example
```javascript
angular   // include htauth as dependecy
  .module('YourAPP', ['htauth'])
  .config(['htauth.facebookProvider',function(facebookProvider){

    // configure the facebookProvider with init settings
    facebookProvider.init({
      appId : '174327009577654',
      locale: 'it_IT'
    })

  }])
  // use the facebook instance controllers/services/..
  .controller('yourController', [
    'htauth.facebook',
    function(facebook) {

      //... code

      // open the facebook login modal
      // and get auth response as a promise
      facebook.login()
        .then(function(authResponse) {

          // authResponse.accessToken

        })
        .catch(function(error) {
          // handle error;
        });

      //... code

      }

    }
  ]);
```



## Planned Providers
* Facebook (...need API documentation)
* Twitter (..future)
* Google (..future)


## License

MIT © [Andrea Tarquini](http://h4t0n.com) aka [@h4t0n](http://twitter.com/h4t0n)
