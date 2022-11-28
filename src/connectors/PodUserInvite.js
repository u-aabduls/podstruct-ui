import handleError from '../utils/ErrorHandler.js'
import formatParams from '../utils/ParamFormatter.js';
import {devServer, prodServer} from './Paths.js';

// private members
var request = new XMLHttpRequest();
var result = {}, httpMethod = null, email = null;
var endpointPath = "podstruct/api/pods/";
var authorizationToken;

/********************
 * Public Methods
 ********************/

function acceptInvite(podID) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podID + '/users' + '/invite'
    _initialize("PUT", endpointPathEXT);
    request.send();
    return result;
}

function denyInvite(podID) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podID + '/users' + '/invite'
    _initialize("DELETE", endpointPathEXT);
    request.send();
    return result;
}

function resendInvite(podID, username) {
    authorizationToken = localStorage.getItem('token');
    email = username;
    var endpointPathEXT = endpointPath + podID + '/users' + '/invite'
    _initialize("POST", endpointPathEXT);
    request.send();
    return result;
}

/********************
 * Private Methods
 ********************/

function _initialize(method, endpointPathEXT) {
    httpMethod = method;
    switch (method) {
        case "GET":
            request.open("GET", devServer + endpointPathEXT, false);
            break;
        case "POST":
            request.open("POST", devServer + endpointPathEXT, false);
            break;
        case "PUT":
            request.open("PUT", devServer + endpointPathEXT, false);
            break;
        case "DELETE":
            request.open("DELETE", devServer + endpointPathEXT, false);
            break;
    }
    // request.open("POST", prodServer + endpointPath, false);
    request.setRequestHeader("accept", "*/*");
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader('Authorization', 'Bearer ' + authorizationToken)
    if(email) request.setRequestHeader('username', email)
    request.onload = __execute;
}

/********************
 * Event handlers
 ********************/

function __execute() {
    if (this.response) var data = JSON.parse(this.response);
    if (request.status >= 400) {
        result.isSuccess = false;
        result.message = handleError(request.status, data);
    } else {
        result.isSuccess = true;
        result.data = data;
        switch (httpMethod) {
            case "GET":
                result.message = ""
                break;
            case "POST":
                result.message = "Successfully sent invitation"
                break;
            case "PUT":
                result.message = "Successfully accepted invitation"
                break;
            case "DELETE":
                result.message = "Successfully denied invitation"
                break;
            default:
                result.message = "Successfully reached podUser invitation endpoint";
        }
    }
}

export {acceptInvite, denyInvite, resendInvite };