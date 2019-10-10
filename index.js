const cors = require('cors');
const express = require('express');
const request = require('request').defaults({
    baseUrl: 'https://developer.api.autodesk.com'
});

const app = express();

let expireTime = Date.now();
let token = '';

let options = {
    method: 'POST',
    url: '/authentication/v1/authenticate',
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
        client_id: 'MSKuogyPaWygG9PQAMGBQK1fIoAbd3ES',
        client_secret: '6esaVpljx0GL4QL9',
        grant_type: 'client_credentials',
        scope: 'data:read'
    }
};

app.use(express.static('public'));
app.use(cors());

app.get('/auth', (req, res) => {
    if (!token || Date.now() > expireTime) {
        request(options, (e, r, body) => {
            token = body; // use the entire body as token
            expireTime = Date.now() + JSON.parse(body).expires_in;
            console.log(token);
            res.send(token);
        });
    } else {
        res.send(token);
    }
});

app.listen(3000, () => {
    console.log('Server has been started');
});