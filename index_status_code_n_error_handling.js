//how to handle the errors if repsonse status code is above 300
'use strict';
const request = require('request-promise');
//for debug: output to console details about every request
request.debug = 1;

(async () => {
    try {
        let status = await request({
            uri: 'https://httpbin.org/status/300',
            resolveWithFullResponse: true
        });
    } catch (response) {
        if (response.statusCode === 300) {
            console.log('everything is OK');
        } else {
            console.log(`something happened: ${response}`);
            process.exit(1);
        }
    }
})();