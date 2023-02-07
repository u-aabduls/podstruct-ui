import handleError from '../utils/ErrorHandler.js'
import { endpointServer } from './Paths.js';

// private members
var request = new XMLHttpRequest();
var username = null, result = {}, httpMethod = null;
var endpointPath = "podstruct/api/user/auth/resetpassword";

/********************
 * Public Methods
 ********************/

function recoverPassword(requestHeader) {
    if (requestHeader) {
        username = requestHeader;
        _initialize("POST");
        request.send();
    }
    return result;
}

function resetPassword(requestBody) {
    username = localStorage.getItem('username')
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
            request.open("GET", endpointServer + endpointPath, false);
            break;
        case "POST":
            request.open("POST", endpointServer + endpointPath, false);
            break;
        case "PUT":
            request.open("PUT", endpointServer + endpointPath, false);
            break;
        case "DELETE":
            request.open("DELETE", endpointServer + endpointPath, false);
            break;
        default:
            break;
    }
    // request.open("POST", prodServer + endpointPath, false);
    request.setRequestHeader("accept", "*/*");
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("username", username);
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
        if (!localStorage.getItem('username')) localStorage.setItem('username', username);
        else localStorage.removeItem('username');
        result.isSuccess = true;
        switch (httpMethod) {
            case "POST":
                result.message = "Successfully recovered password."
                break;
            case "PUT":
                result.message = "Successfully reset password."
                break;
            default:
                result.message = "Successfully reached password endpoint.";
        }
    }
}

export { recoverPassword, resetPassword };
