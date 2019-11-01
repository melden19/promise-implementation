const axios = require('axios');

global.Promise = require('./Promise');

axios({
    method: 'get',
    url: 'http://jsonplaceholer.typicode.com/todos/1',
    data: {
        firstName: 'Fred',
        lastName: 'Flintstone'
    }
})
    .then(res => console.log(res));
