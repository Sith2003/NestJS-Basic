const autocannon = require('autocannon');

async function runAutoCannon() {
    const result = await autocannon({
        url: 'http://localhost:3000/api/v1',
        connections: 10,
        duration: 10
    });

    console.log(result);
}

runAutoCannon();