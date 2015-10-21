// Generated by CoffeeScript 1.10.0
(function() {
  suite('email user password change request', function() {
    var dfd;
    dfd = null;
    suite('successful request', function() {
      setup(function() {
        $httpBackend.expectPOST('/api/auth/password').respond(201, {
          success: true
        });
        dfd = $auth.requestPasswordReset({
          email: validUser.email
        });
        return $httpBackend.flush();
      });
      test('$rootScope should broadcast success event', function() {
        return assert($rootScope.$broadcast.calledWith('auth:password-reset-request-success'));
      });
      return test('promise is resolved', function() {
        var resolved;
        resolved = false;
        dfd.then(function() {
          return resolved = true;
        });
        $timeout.flush();
        return assert(resolved);
      });
    });
    suite('directive access', function() {
      var args;
      args = {
        email: validUser.email
      };
      return test('$rootScope should broadcast success event', function() {
        $httpBackend.expectPOST('/api/auth/password').respond(201, {
          success: true
        });
        sinon.spy($auth, 'requestPasswordReset');
        $rootScope.requestPasswordReset(args);
        return $httpBackend.flush();
      });
    });
    return suite('failed request', function() {
      var errorResp;
      errorResp = {
        success: false,
        errors: ['blehg']
      };
      setup(function() {
        $httpBackend.expectPOST('/api/auth/password').respond(401, errorResp);
        dfd = $auth.requestPasswordReset({
          email: validUser.email
        });
        return $httpBackend.flush();
      });
      test('$rootScope should broadcast error event with response', function() {
        return assert($rootScope.$broadcast.calledWithMatch('auth:password-reset-request-error', errorResp));
      });
      return test('promise is rejected', function() {
        var caught;
        caught = false;
        dfd["catch"](function() {
          return caught = true;
        });
        $timeout.flush();
        return assert(caught);
      });
    });
  });

}).call(this);
