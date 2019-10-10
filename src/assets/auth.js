var FORGE_CLIENT_ID = "MSKuogyPaWygG9PQAMGBQK1fIoAbd3ES";
var FORGE_CLIENT_SECRET = "6esaVpljx0GL4QL9";

var ACCESS_TOKEN;

auth();

function auth(){
    var app = angular.module('myApp', ["ngResource", "ngRoute", "ngCookies"]);
    app.controller('mainCtrl',
        function ($scope, $resource, $http, $httpParamSerializer, $cookies) {
            $scope.data = {
                grant_type: 'client_credentials',
                client_id: FORGE_CLIENT_ID,
                client_secret: FORGE_CLIENT_SECRET,
                scope: 'data:read data:write data:create bucket:read bucket:create'
            }
            $scope.login = function () {
                var req = {
                    method: 'POST',
                    url: 'https://developer.api.autodesk.com/authentication/v1/authenti..',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                    data: $httpParamSerializer($scope.data)
                }
                $http(req).then(function (data) {
                    $http.defaults.headers.common.Authorization =
                        'Bearer ' + data.data.access_token;
                    ACCESS_TOKEN = data.data.access_token;
                });
            }
        });
}
function getToken(){
    return ACCESS_TOKEN;
}