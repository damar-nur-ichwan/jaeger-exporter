const GetTraces = require('./GetTraces.util')
const ToTimestamp = require('../ToTimestamp/ToTimestamp.util')

test('Get Traces', async () => {
    const indexDate = '2022-04-19'

    const param = {
        indexDate,
        time: {
            gt: ToTimestamp(indexDate.replace(/-/,' '))
        }
    }
    const data = await GetTraces(param)
    
    expect(data.length).not.toBe(0)
    
    data.map(element => {
        expect(element).not.toEqual({traceID: undefined, spanID: undefined});
    })
});
