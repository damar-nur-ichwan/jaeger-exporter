const GetIndices = require('./GetIndices.util')

test('Get All Indices', async () => {
    const data = await GetIndices()
    data.forEach((res) => {
        expect(res).toMatch(/jaeger-span-/);
    })
});