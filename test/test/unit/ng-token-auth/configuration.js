// Generated by CoffeeScript 1.10.0
(function() {
  suite('configuration', function() {
    suite('basic settings', function() {
      var apiUrl;
      apiUrl = '/kronos';
      setup(function() {
        sinon.spy($auth, 'validateUser');
        return $authProvider.configure({
          apiUrl: apiUrl,
          validateOnPageLoad: true,
          proxyIf: function() {
            return true;
          }
        });
      });
      teardown(function() {
        return $authProvider.configure({
          apiUrl: '/api',
          proxyIf: function() {
            return false;
          }
        });
      });
      test('apiUrl has been changed', function() {
        return assert.equal(apiUrl, $auth.getConfig().apiUrl);
      });
      test('$auth proxies to proxy url', function() {
        return assert.equal('/proxy', $auth.apiUrl());
      });
      return test('headers are appended to requests to proxy', function() {
        var successResp;
        successResp = {
          success: true,
          data: validUser
        };
        $cookieStore.put('auth_headers', validAuthHeader);
        $httpBackend.expectGET('/proxy/auth/validate_token', function(headers) {
          console.log('validAuthHeader', validAuthHeader['access-token']);
          console.log('cur', headers['access-token']);
          assert.equal(validAuthHeader['access-token'], headers['access-token']);
          return headers;
        }).respond(201, successResp, {
          'access-token': 'access-token',
          'whatever': 'whatever'
        });
        $auth.validateUser();
        return $httpBackend.flush();
      });
    });
    suite('alternate token format', function() {
      var expectedHeaders;
      expectedHeaders = {
        "Authorization": "token=" + validToken + " expiry=" + validExpiry + " uid=" + validUid
      };
      setup(function() {
        return $authProvider.configure({
          tokenFormat: {
            "Authorization": "token={{token}} expiry={{expiry}} uid={{uid}}"
          },
          parseExpiry: function(headers) {
            return (parseInt(headers['Authorization'].match(/expiry=([^ ]+) /)[1], 10)) || null;
          }
        });
      });
      teardown(function() {
        return $authProvider.configure({
          tokenFormat: {
            "access-token": "{{ token }}",
            "token-type": "Bearer",
            client: "{{ clientId }}",
            expiry: "{{ expiry }}",
            uid: "{{ uid }}"
          },
          parseExpiry: function(headers) {
            return (parseInt(headers['expiry'], 10) * 1000) || null;
          }
        });
      });
      test('auth headers are built according to config.tokenFormat', function() {
        var headers;
        headers = $auth.buildAuthHeaders({
          token: validToken,
          clientId: validClient,
          uid: validUid,
          expiry: validExpiry
        });
        return assert.deepEqual(headers, expectedHeaders);
      });
      return test('expiry should be derived from cached headers', function() {
        var expiry;
        $auth.setAuthHeaders(expectedHeaders);
        expiry = $auth.getExpiry();
        return assert.equal(expiry, validExpiry);
      });
    });
    suite('alternate login response format', function() {
      setup(function() {
        $authProvider.configure({
          handleLoginResponse: function(resp) {
            return resp;
          }
        });
        $httpBackend.expectPOST('/api/auth/sign_in').respond(201, validUser);
        $auth.submitLogin({
          email: validUser.email,
          password: 'secret123'
        });
        return $httpBackend.flush();
      });
      teardown(function() {
        return $authProvider.configure({
          handleLoginResponse: function(resp) {
            return resp.data;
          }
        });
      });
      test('new user is defined in the root scope', function() {
        return assert.equal(validUser.uid, $rootScope.user.uid);
      });
      return test('success event should return user info', function() {
        return assert($rootScope.$broadcast.calledWithMatch('auth:login-success', validUser));
      });
    });
    return suite('alternate token validation response format', function() {
      var dfd, newAuthHeader, successResp;
      successResp = validUser;
      newAuthHeader = {
        "access-token": "(✿◠‿◠)",
        "token-type": 'Bearer',
        client: validClient,
        expiry: validExpiry.toString(),
        uid: validUid.toString()
      };
      dfd = null;
      setup(function() {
        $authProvider.configure({
          handleTokenValidationResponse: function(resp) {
            return resp;
          }
        });
        $httpBackend.expectGET('/api/auth/validate_token').respond(201, successResp, newAuthHeader);
        $cookieStore.put('auth_headers', validAuthHeader);
        $auth.validateUser();
        return $httpBackend.flush();
      });
      teardown(function() {
        return $authProvider.configure({
          handleTokenValidationResponse: function(resp) {
            return resp.data;
          }
        });
      });
      return test('new user is defined in the root scope', function() {
        return assert.equal(validUser.uid, $rootScope.user.uid);
      });
    });
  });

}).call(this);
