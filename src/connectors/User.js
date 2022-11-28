import handleError from '../utils/ErrorHandler.js'
import {devServer, prodServer} from './Paths.js';

// private members
var request = new XMLHttpRequest();
var result = {}, httpMethod = null;
var endpointPath = "podstruct/api/user";
var authorizationToken;

/********************
 * Public Methods
 ********************/

function getUser() {
    authorizationToken = localStorage.getItem('token');
    _initialize("GET");
    request.send();
    return result;
}

function createUser(requestBody) {
    authorizationToken = localStorage.getItem('token');
    _initialize("POST");
    request.send(requestBody);
    return result;
}

function updateUser(requestBody) {
    authorizationToken = localStorage.getItem('token');
    _initialize("PUT");
    request.send(requestBody);
    return result;
}

/********************
 * Private Methods
 ********************/

function _initialize(method) {
    httpMethod = method;
    switch (method) {
        case "GET":
            request.open("GET", devServer + endpointPath, false);
            request.setRequestHeader('Authorization', 'Bearer ' + authorizationToken)
            break;
        case "POST":
            request.open("POST", devServer + endpointPath, false);
            break;
        case "PUT":
            request.open("PUT", devServer + endpointPath, false);
            request.setRequestHeader('Authorization', 'Bearer ' + authorizationToken)
            break;
        case "DELETE":
            request.open("DELETE", devServer + endpointPath, false);
            request.setRequestHeader('Authorization', 'Bearer ' + authorizationToken)
            break;
    }
    request.setRequestHeader("accept", "*/*");
    request.setRequestHeader("Content-Type", "application/json");
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
                result.message = "Successfully fetched user"
                break;
            case "POST":
                result.message = "Successfully created user"
                break;
            case "PUT":
                result.message = "Successfully edited user"
                break;
            case "DELETE":
                result.message = "Successfully deleted user"
                break;
            default:
                result.message = "Successfully reached User endpoint.";
        }
    }
}

export { getUser, createUser, updateUser };