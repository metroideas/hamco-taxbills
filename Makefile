REPORTER = spec
MOCHA    = ./node_modules/mocha/bin/mocha
TEST_ENV = @NODE_ENV=test

test:
		$(TEST_ENV) $(MOCHA) test/ \
				--reporter $(REPORTER) \
				--recursive

test-app:
		$(TEST_ENV) $(MOCHA) test/test-app.js \
				--reporter $(REPORTER) \
				--recursive

test-api:
		$(TEST_ENV) $(MOCHA) test/test-api.js \
				--reporter $(REPORTER) \
				--recursive

test-models:
		$(TEST_ENV) $(MOCHA) test/test-models.js \
				--reporter $(REPORTER) \
				--recursive

.PHONY: test test-app test-api test-models
