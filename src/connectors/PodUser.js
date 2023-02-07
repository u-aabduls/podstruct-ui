import handleError from '../utils/ErrorHandler.js'
import formatParams from '../utils/ParamFormatter.js';
import { endpointServer } from './Paths.js';

// private members
var request = new XMLHttpRequest();
var result = {}, httpMethod = null, email = null;
var endpointPath = "podstruct/api/pods/";
var authorizationToken;

/********************
 * Public Methods
 ********************/

function getUsers(podID, name, page, size, sort, role, inviteStatus) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podID + '/users'
    var params = {};
    if (name) params.name = name
    if (page) params.page = page
    if (size) params.size = size
    if (sort) params.sort = sort
    if (role) params.role = role
    if (inviteStatus) params.inviteStatus = inviteStatus
    _initialize("GET", endpointPathEXT + formatParams(params));
    request.send();
    return result;
}

function createUser(podID, requestBody) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podID + '/users'
    _initialize("POST", endpointPathEXT);
    request.send(requestBody);
    return result;
}

function deleteUser(podID, username) {
    authorizationToken = localStorage.getItem('token');
    email = username;
    var endpointPathEXT = endpointPath + podID + '/users'
    _initialize("DELETE", endpointPathEXT);
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
            request.open("GET", endpointServer + endpointPathEXT, false);
            break;
        case "POST":
            request.open("POST", endpointServer + endpointPathEXT, false);
            break;
        case "PUT":
            request.open("PUT", endpointServer + endpointPathEXT, false);
            break;
        case "DELETE":
            request.open("DELETE", endpointServer + endpointPathEXT, false);
            break;
        default:
            break;
    }
    // request.open("POST", prodServer + endpointPath, false);
    request.setRequestHeader("accept", "*/*");
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader('Authorization', 'Bearer ' + authorizationToken)
    if (email) request.setRequestHeader('username', email)
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
                result.message = "Successfully fetched user(s)"
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
                result.message = "Successfully reached podUser endpoint";
        }
    }
}

export { getUsers, createUser, deleteUser };