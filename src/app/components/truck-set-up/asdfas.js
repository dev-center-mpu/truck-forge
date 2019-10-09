var FORGE_CLIENT_ID = "MSKuogyPaWygG9PQAMGBQK1fIoAbd3ES";
var FORGE_CLIENT_SECRET = "6esaVpljx0GL4QL9";
access_token;
get('/oauth', function (req, res) {
    Axios({
        method: 'POST',
        url: 'https://developer.api.autodesk.com/authentication/v1/..',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        data: querystring.stringify({
            client_id: FORGE_CLIENT_ID,
            client_secret: FORGE_CLIENT_SECRET,
            grant_type: 'client_credentials',
            scope: scopes
        })
    })
        .then(function (response) {
            // Success 
            access_token = response.data.access_token;
            res.send(response.data)
        })
        .catch(function (error) {
            // Failed 
            console.log(error);
            res.send('Failed to authenticate');
        });
});