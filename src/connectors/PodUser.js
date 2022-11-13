import handleError from '../utils/ErrorHandler.js'
import formatParams from '../utils/ParamFormatter.js';

// private members
var request = new XMLHttpRequest();
var result = {}, httpMethod = null, email = null;
var devServer = "http://podstruct-api-intg-env.eba-espxmmpg.us-east-1.elasticbeanstalk.com/",
    prodServer = "https://d1vp98nn3zy5j1.cloudfront.net/";
var endpointPath = "podstruct/api/pods/";
var authorizationToken = localStorage.getItem('token');

/********************
 * Public Methods
 ********************/

function getUsers(podID, page, size, sort, role, inviteStatus) {
    var endpointPathEXT = endpointPath + podID + '/users'
    var params = {};
    if (page) params.page = page
    if (size) params.size = size
    if (sort) params.sort = sort
    if (role) params.role = role
    if (inviteStatus) params.inviteStatus = inviteStatus
    console.log(endpointPathEXT + formatParams(params))
    _initialize("GET", endpointPathEXT + formatParams(params));
    request.send();
    return result;
}

function createUser(podID, requestBody) {
    var endpointPathEXT = endpointPath + podID + '/users'
    _initialize("POST", endpointPathEXT);
    request.send(requestBody);
    return result;
}

function deleteUser(podID, username) {
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

export { getUsers, createUser, deleteUser};