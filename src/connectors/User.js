import handleError from '../utils/ErrorHandler.js'

// private members
var request = new XMLHttpRequest();
var result = {}, httpMethod = null;
var devServer = "http://podstruct-api-intg-env.eba-espxmmpg.us-east-1.elasticbeanstalk.com/",
    prodServer = "https://d1vp98nn3zy5j1.cloudfront.net/";
var endpointPath = "podstruct/api/user/";
var authorizationToken = localStorage.getItem('token');

/********************
 * Public Methods
 ********************/

function getUser() {
    _initialize("GET");
    request.send();
    return result;
}

function createUser(requestBody) {
    _initialize("POST");
    request.send(requestBody);
    return result;
}

function updateUser(requestBody) {
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
            break;
        case "POST":
            request.open("POST", devServer + endpointPath, false);
            break;
        case "PUT":
            request.open("PUT", devServer + endpointPath, false);
            break;
        case "DELETE":
            request.open("DELETE", devServer + endpointPath, false);
            break;
    }
    request.setRequestHeader("accept", "*/*");
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader('Authorization', 'Bearer ' + authorizationToken)
    request.onload = __execute;
}

/********************
 * Event handlers
 ********************/

function __execute(method) {
    if (this.response) var data = JSON.parse(this.response);
    if (request.status >= 400) {
        result.isSuccess = false;
        result.message = handleError(request.status, data);
    } else {
        result.isSuccess = true;
        result.data = data;
        switch (httpMethod) {
            case "GET":
                result.message = "Successfully fetched account"
                break;
            case "POST":
                result.message = "Successfully created account"
                break;
            case "PUT":
                result.message = "Successfully edited account"
                break;
            case "DELETE":
                result.message = "Successfully deleted account"
                break;
            default:
                result.message = "Successfully reached User endpoint";
        }
    }
}

export { getUser, createUser, updateUser };