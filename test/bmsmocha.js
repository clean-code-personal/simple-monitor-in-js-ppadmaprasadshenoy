const { assert } = require('chai');
const { batteryIsOk } = require('../bms-monitor');

describe('Battery Status', function() {
  it('All parameters are within the range', function() {
    assert.isFalse(batteryIsOk(25, 50, 0.5));
  });

  it('Temperature is high', function() {
    assert.isFalse(batteryIsOk(50, 50, 0.5));
  });

  it('Temperature is low', function() {
    assert.isFalse(batteryIsOk(-10, 50, 0.5));
  });

  it('State of Charge is low', function() {
    assert.isFalse(batteryIsOk(25, 10, 0.5));
  });

  it('State of Charge is high', function() {
    assert.isFalse(batteryIsOk(25, 90, 0.5));
  });

  it('Charge rate is too low', function() {
    assert.isFalse(batteryIsOk(25, 50, -0.1));
  });

  it('Charge rate is too high', function() {
    assert.isFalse(batteryIsOk(25, 50, 0.9));
  });

  it('All parameters at minimum value', function() {
    assert.isTrue(batteryIsOk(0, 20, 0));
  });

  it('All parameters at maximum value', function() {
    assert.isTrue(batteryIsOk(45, 80, 0.8));
  });
});
