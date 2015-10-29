// Generated by CoffeeScript 1.10.0
(function() {
  suite('multiple concurrent auth configurations', function() {
    var successResp;
    successResp = validUser;
    suite('single unnamed config', function() {
      var defaultConfig;
      defaultConfig = {
        signOutUrl: '/vega/sign_out',
        emailSignInPath: '/vega/sign_in',
        emailRegistrationPath: '/vega',
        accountUpdatePath: '/vega',
        accountDeletePath: '/vega',
        passwordResetPath: '/vega/password',
        passwordUpdatePath: '/vega/password',
        tokenValidationPath: '/vega/validate_token',
        authProviderPaths: {
          github: '/vega/github'
        }
      };
      setup(function() {
        return $authProvider.configure(defaultConfig);
      });
      test('getConfig returns "default" config when no params specified', function() {
        assert.equal(defaultConfig.signOutUrl, $auth.getConfig().signOutUrl);
        assert.equal(defaultConfig.emailSignInPath, $auth.getConfig().emailSignInPath);
        assert.equal(defaultConfig.emailRegistrationPath, $auth.getConfig().emailRegistrationPath);
        assert.equal(defaultConfig.accountUpdatePath, $auth.getConfig().accountUpdatePath);
        assert.equal(defaultConfig.accountDeletePath, $auth.getConfig().accountDeletePath);
        assert.equal(defaultConfig.accountResetPath, $auth.getConfig().accountResetPath);
        assert.equal(defaultConfig.accountUpdatePath, $auth.getConfig().accountUpdatePath);
        return assert.equal(defaultConfig.tokenValidationPath, $auth.getConfig().tokenValidationPath);
      });
      test('authenticate uses only config by default', function() {
        var expectedRoute;
        expectedRoute = "/api/vega/github";
        sinon.stub($auth, 'createPopup').returns({
          closed: false,
          postMessage: function() {
            return null;
          }
        });
        $auth.authenticate('github');
        return assert($auth.createPopup.calledWithMatch(expectedRoute));
      });
      test('submitLogin uses only config by default', function() {
        var args;
        args = {
          email: validUser.email,
          password: 'secret123'
        };
        $httpBackend.expectPOST('/api/vega/sign_in').respond(201, {
          success: true,
          data: validUser
        });
        $rootScope.submitLogin(args);
        return $httpBackend.flush();
      });
      return test('validateUser uses only config by default', function() {
        $httpBackend.expectGET('/api/vega/validate_token').respond(201, successResp, validAuthHeader);
        $cookieStore.put('auth_headers', validAuthHeader);
        $auth.validateUser();
        return $httpBackend.flush();
      });
    });
    return suite('multiple configs', function() {
      var adminConfig, userConfig;
      userConfig = {
        user: {
          signOutUrl: '/rigel/sign_out',
          emailSignInPath: '/rigel/sign_in',
          emailRegistrationPath: '/rigel',
          accountUpdatePath: '/rigel',
          accountDeletePath: '/rigel',
          passwordResetPath: '/rigel/password',
          passwordUpdatePath: '/rigel/password',
          tokenValidationPath: '/rigel/validate_token',
          authProviderPaths: {
            github: '/rigel/github'
          }
        }
      };
      adminConfig = {
        admin: {
          signOutUrl: '/cygni/sign_out',
          emailSignInPath: '/cygni/sign_in',
          emailRegistrationPath: '/cygni',
          accountUpdatePath: '/cygni',
          accountDeletePath: '/cygni',
          passwordResetPath: '/cygni/password',
          passwordUpdatePath: '/cygni/password',
          tokenValidationPath: '/cygni/validate_token',
          authProviderPaths: {
            github: '/cygni/github'
          }
        }
      };
      setup(function() {
        var cs;
        return cs = $authProvider.configure([userConfig, adminConfig]);
      });
      test('getConfig returns first ("user") config when no params specified', function() {
        assert.equal(userConfig.user.signOutUrl, $auth.getConfig().signOutUrl);
        assert.equal(userConfig.user.emailSignInPath, $auth.getConfig().emailSignInPath);
        assert.equal(userConfig.user.emailRegistrationPath, $auth.getConfig().emailRegistrationPath);
        assert.equal(userConfig.user.accountUpdatePath, $auth.getConfig().accountUpdatePath);
        assert.equal(userConfig.user.accountDeletePath, $auth.getConfig().accountDeletePath);
        assert.equal(userConfig.user.accountResetPath, $auth.getConfig().accountResetPath);
        assert.equal(userConfig.user.accountUpdatePath, $auth.getConfig().accountUpdatePath);
        return assert.equal(userConfig.user.tokenValidationPath, $auth.getConfig().tokenValidationPath);
      });
      test('getConfig returns "admin" config when specified', function() {
        assert.equal(adminConfig.admin.signOutUrl, $auth.getConfig("admin").signOutUrl);
        assert.equal(adminConfig.admin.emailSignInPath, $auth.getConfig("admin").emailSignInPath);
        assert.equal(adminConfig.admin.emailRegistrationPath, $auth.getConfig("admin").emailRegistrationPath);
        assert.equal(adminConfig.admin.accountUpdatePath, $auth.getConfig("admin").accountUpdatePath);
        assert.equal(adminConfig.admin.accountDeletePath, $auth.getConfig("admin").accountDeletePath);
        assert.equal(adminConfig.admin.accountResetPath, $auth.getConfig("admin").accountResetPath);
        assert.equal(adminConfig.admin.accountUpdatePath, $auth.getConfig("admin").accountUpdatePath);
        return assert.equal(adminConfig.admin.tokenValidationPath, $auth.getConfig("admin").tokenValidationPath);
      });
      test('default methods still work');
      suite('authenticate', function() {
        test('uses first config by default', function() {
          var expectedRoute;
          expectedRoute = "/api/rigel/github";
          sinon.stub($auth, 'createPopup').returns({
            closed: false,
            postMessage: function() {
              return null;
            }
          });
          $auth.authenticate('github');
          return assert($auth.createPopup.calledWithMatch(expectedRoute));
        });
        return test('uses second config when specified', function() {
          var expectedRoute;
          expectedRoute = "/api/cygni/github";
          sinon.stub($auth, 'createPopup').returns({
            closed: false,
            postMessage: function() {
              return null;
            }
          });
          $auth.authenticate('github', {
            config: 'admin'
          });
          return assert($auth.createPopup.calledWithMatch(expectedRoute));
        });
      });
      suite('submitLogin', function() {
        test('uses first config by default', function() {
          var args;
          args = {
            email: validUser.email,
            password: 'secret123'
          };
          $httpBackend.expectPOST('/api/rigel/sign_in').respond(201, {
            success: true,
            data: validUser
          });
          $rootScope.submitLogin(args);
          return $httpBackend.flush();
        });
        test('uses second config when specified', function() {
          var args;
          args = {
            email: validUser.email,
            password: 'secret123'
          };
          $httpBackend.expectPOST('/api/cygni/sign_in').respond(201, {
            success: true,
            data: validUser
          });
          $rootScope.submitLogin(args, {
            config: 'admin'
          });
          return $httpBackend.flush();
        });
        return test('config name is persisted locally when not using the default config', function() {
          var args;
          args = {
            email: validUser.email,
            password: 'secret123'
          };
          $httpBackend.expectPOST('/api/cygni/sign_in').respond(201, {
            success: true,
            data: validUser
          });
          $rootScope.submitLogin(args, {
            config: 'admin'
          });
          $httpBackend.flush();
          return assert.equal('admin', $auth.getCurrentConfigName());
        });
      });
      suite('signOut', function() {
        setup(function() {
          var args;
          args = {
            email: validUser.email,
            password: 'secret123'
          };
          $httpBackend.expectPOST('/api/cygni/sign_in').respond(201, {
            success: true,
            data: validUser
          });
          $rootScope.submitLogin(args, {
            config: 'admin'
          });
          $httpBackend.flush();
          $httpBackend.expectDELETE('/api/cygni/sign_out').respond(201, {
            success: true
          });
          $rootScope.signOut();
          return $httpBackend.flush();
        });
        test('saved config name ref is deleted', function() {
          return assert.equal(null, $auth.currentConfigName);
        });
        return test('saved config name cookie is deleted', function() {
          return assert.equal(void 0, $auth.retrieveData('currentConfigName'));
        });
      });
      suite('validateUser', function() {
        test('uses saved config if present', function() {
          $auth.setConfigName('admin');
          $httpBackend.expectGET('/api/cygni/validate_token').respond(201, successResp, validAuthHeader);
          $cookieStore.put('auth_headers', validAuthHeader);
          $auth.validateUser();
          return $httpBackend.flush();
        });
        test('uses first config as fallback', function() {
          $httpBackend.expectGET('/api/rigel/validate_token').respond(201, successResp, validAuthHeader);
          $cookieStore.put('auth_headers', validAuthHeader);
          $auth.validateUser();
          return $httpBackend.flush();
        });
        return test('uses named config when specified', function() {
          $httpBackend.expectGET('/api/rigel/validate_token').respond(201, successResp, validAuthHeader);
          $cookieStore.put('auth_headers', validAuthHeader);
          $auth.validateUser('admin');
          return $httpBackend.flush();
        });
      });
      suite('submitRegistration', function() {
        test('uses first config by default', function() {
          $httpBackend.expectPOST('/api/rigel').respond(201, {
            success: true
          });
          $auth.submitRegistration({
            email: validEmail,
            password: 'secret123',
            password_confirmation: 'secret123'
          });
          return $httpBackend.flush();
        });
        return test('uses stored named config when present', function() {
          $httpBackend.expectPOST('/api/cygni').respond(201, {
            success: true
          });
          $auth.submitRegistration({
            email: validEmail,
            password: 'secret123',
            password_confirmation: 'secret123'
          }, {
            config: 'admin'
          });
          return $httpBackend.flush();
        });
      });
      suite('registration confirmation', function() {
        return test('admin user is validated using the correct configuration', function() {
          setValidEmailConfirmQSForAdminUser();
          $httpBackend.expectGET('/api/cygni/validate_token').respond(201, successResp, validAuthHeader);
          $auth.validateUser();
          return $httpBackend.flush();
        });
      });
      suite('password change request confirmation', function() {
        return test('admin user is validated using the correct configuration', function() {
          setValidPasswordConfirmQSForAdminUser();
          $httpBackend.expectGET('/api/cygni/validate_token').respond(201, successResp, validAuthHeader);
          $auth.validateUser();
          return $httpBackend.flush();
        });
      });
      suite('destroyAccount', function() {
        test('uses stored named config when present', function() {
          $auth.setConfigName('admin');
          $httpBackend.expectDELETE('/api/cygni/sign_out').respond(201, successResp);
          $auth.signOut();
          return $httpBackend.flush();
        });
        return test('falls back to default config name', function() {
          $httpBackend.expectDELETE('/api/rigel/sign_out').respond(201, successResp);
          $auth.signOut();
          return $httpBackend.flush();
        });
      });
      suite('requestPasswordReset', function() {
        test('uses first config by default', function() {
          $httpBackend.expectPOST('/api/rigel/password').respond(201, {
            success: true
          });
          $auth.requestPasswordReset({
            email: validUser.email
          });
          return $httpBackend.flush();
        });
        return test('uses stored named config when present', function() {
          $httpBackend.expectPOST('/api/cygni/password').respond(201, {
            success: true
          });
          $auth.requestPasswordReset({
            email: validUser.email
          }, {
            config: 'admin'
          });
          return $httpBackend.flush();
        });
      });
      suite('updatePassword', function() {
        test('uses stored named config', function() {
          $auth.setConfigName('admin');
          $httpBackend.expectPUT('/api/cygni/password').respond(201, {
            success: true
          });
          $auth.updatePassword({
            password: 'secret123',
            password_confirmation: 'secret123'
          });
          return $httpBackend.flush();
        });
        return test('falls back to default config name', function() {
          $httpBackend.expectPUT('/api/rigel/password').respond(201, {
            success: true
          });
          $auth.updatePassword({
            password: 'secret123',
            password_confirmation: 'secret123'
          });
          return $httpBackend.flush();
        });
      });
      return suite('updateAccount', function() {
        test('uses stored named config', function() {
          $auth.setConfigName('admin');
          $httpBackend.expectPUT('/api/cygni').respond(201, successResp);
          $auth.updateAccount({
            operating_thetan: 123
          });
          return $httpBackend.flush();
        });
        return test('falls back to default config name', function() {
          $httpBackend.expectPUT('/api/rigel').respond(201, successResp);
          $auth.updateAccount({
            operating_thetan: 123
          });
          return $httpBackend.flush();
        });
      });
    });
  });

}).call(this);