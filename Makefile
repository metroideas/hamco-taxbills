REPORTER = spec
MOCHA    = ./node_modules/mocha/bin/mocha
TEST_ENV = @NODE_ENV=test

test-app:
		$(TEST_ENV) $(MOCHA) tests/app.js \
				--reporter $(REPORTER) \
				--recursive

test-api:
		$(TEST_ENV) $(MOCHA) tests/api.js \
				--reporter $(REPORTER) \
				--recursive

test-models:
		$(TEST_ENV) $(MOCHA) tests/models.js \
				--reporter $(REPORTER) \
				--recursive

.PHONY: test-app test-api test-models
