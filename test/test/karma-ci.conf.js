// Generated by CoffeeScript 1.10.0
(function() {
  module.exports = function(config) {
    var customLaunchers;
    customLaunchers = {
      'SL_Chrome': {
        base: 'SauceLabs',
        browserName: 'chrome'
      }
    };
    return config.set({
      basePath: '../../',
      preprocessors: {
        'src/*.coffee': ['coverage'],
        'test/test/**/*.coffee': ['coffee']
      },
      files: ['test/app/bower_components/angular/angular.js', 'test/app/bower_components/angular-cookies/angular-cookies.js', 'test/app/bower_components/angular-mocks/angular-mocks.js', 'src/*.coffee', 'test/test/unit/test-helper.coffee', 'test/test/unit/ng-token-auth/**/*.coffee'],
      autoWatch: true,
      reporters: ['spec', 'saucelabs', 'coverage'],
      frameworks: ['mocha', 'chai', 'sinon', 'chai-as-promised'],
      browsers: Object.keys(customLaunchers),
      colors: true,
      client: {
        mocha: {
          ui: 'tdd'
        }
      },
      sauceLabs: {
        testName: 'ng-token-auth unit tests',
        startConnect: false,
        tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
      },
      customLaunchers: customLaunchers,
      coverageReporter: {
        type: 'lcov',
        dir: 'coverage/'
      }
    });
  };

}).call(this);