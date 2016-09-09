/* global describe, it, expect, require */

describe('Date', function () {
  it('when invalid, dates should toString to "Invalid Date"', function () {
    expect(String(new Date(NaN))).to.equal('Invalid Date');
  });
});
