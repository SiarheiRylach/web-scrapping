'use strict';

 //proxy: 'http://user:password@ip:port'
 const request = require('request-promise').defaults({
    proxy: 'http://191.37.227.128:8080' 
});

(async () => {
    let response = await request('https://httpbin.org/ip');
    debugger;
})();