import handleError from '../utils/ErrorHandler.js'

// private members
var request = new XMLHttpRequest();
var result = {};
var devServer = "http://podstruct-api-intg-env.eba-espxmmpg.us-east-1.elasticbeanstalk.com/",
    prodServer = "https://d1vp98nn3zy5j1.cloudfront.net/";
var endpointPath = "podstruct/api/user/auth";

/********************
 * Public Methods
 ********************/

function send(authorizationToken) {
    _initialize(authorizationToken);
    request.send();
    return result;
}

/********************
 * Private Methods
 ********************/

function _initialize(authorizationToken) {
    request.open("DELETE", devServer + endpointPath, false);
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
    if (request.status >= 200 && request.status < 400) {
        result.isSuccess = true;
        localStorage.clear();
    } else {
        result.isSuccess = false;
        result.message = handleError(request.status, data)
    }
}

export default send;
