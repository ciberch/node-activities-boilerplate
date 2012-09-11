TESTS = $(shell find test/ -name '*.tobi.js' -o -name '*.test.js')

test:
	@node_modules/.bin/mocha --reporter spec $(TESTS)

.PHONY: test
