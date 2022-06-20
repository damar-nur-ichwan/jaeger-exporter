const ToTimestamp = require('./StringDate2Timestamp.util')

test('Convert date to timestamp', async () => {
    expect(ToTimestamp('02/13/2009 23:31:30')).toBe(1234542690);
    expect(ToTimestamp('2009 02 13 23:31:30')).toBe(1234542690);
    expect(ToTimestamp('2009 02 13')).toBe(1234458000);
});