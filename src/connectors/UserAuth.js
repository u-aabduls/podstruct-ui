import handleError from '../utils/ErrorHandler.js'

// private members
var request = new XMLHttpRequest();
var result = {};
var devServer = "http://podstruct-api-intg-env.eba-espxmmpg.us-east-1.elasticbeanstalk.com/",
    prodServer = "https://d1vp98nn3zy5j1.cloudfront.net/";
var endpointPath = "podstruct/api/user/auth/";
var authorizationToken = ""


/********************
 * Public Methods
 ********************/

function loginUser(requestBody) {
    authorizationToken = ""
    _initialize("POST");
    request.send(requestBody);
    return result;
}

function logoutUser() {
    authorizationToken = localStorage.getItem('token');
    _initialize("DELETE");
    request.send();
    return result;
}

/********************
 * Private Methods
 ********************/

function _initialize(method) {
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
    // request.open("POST", prodServer + endpointPath, false);
    request.setRequestHeader("accept", "*/*");
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader('Authorization', 'Bearer ' + authorizationToken)
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
        if (!authorizationToken) {
            localStorage.setItem('token', data.authorizationToken);
            localStorage.setItem('email', data.username);
            return;
        }
        localStorage.clear();
    }
}

export { loginUser, logoutUser };
