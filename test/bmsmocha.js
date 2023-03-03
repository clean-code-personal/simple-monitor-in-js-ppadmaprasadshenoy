const { assert } = require('chai');
const { batteryIsOk } = require('../bmsproduction');

describe('Battery Status', function() {
  it('All parameters are within the range', function() {
    assert.strictEqual(batteryIsOk(25, 50, 0.5), true);
  });
  
  it('Temperature is high', function() {
    assert.strictEqual(batteryIsOk(50, 50, 0.5), false);
  });
  
  it('Temperature is low', function() {
    assert.strictEqual(batteryIsOk(-10, 50, 0.5), false);
  });
  
  it('State of Charge is low', function() {
    assert.strictEqual(batteryIsOk(25, 10, 0.5), false);
  });
  
  it('State of Charge is high', function() {
    assert.strictEqual(batteryIsOk(25, 90, 0.5), false);
  });
  
  it('Charge rate is too low', function() {
    assert.strictEqual(batteryIsOk(25, 50, -0.1), false);
  });
  
  it('Charge rate is too high', function() {
    assert.strictEqual(batteryIsOk(25, 50, 0.9), false);
  });
  
  it('All parameters at minimum value', function() {
    assert.strictEqual(batteryIsOk(0, 20, 0), true);
  });
  
  it('All parameters at maximum value', function() {
    assert.strictEqual(batteryIsOk(45, 80, 0.8), true);
  });
});
