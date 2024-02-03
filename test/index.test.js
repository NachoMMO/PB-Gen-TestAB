const assert = require('chai').assert;
const index = require('../src/index');

describe('Index', function() {
  describe('FunctionName', function() {
    it('should return value', function() {
      let result = index.functionName();
      assert.equal(result, 'expected value');
    });
  });
});