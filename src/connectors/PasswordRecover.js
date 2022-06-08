import handleError from '../utils/ErrorHandler.js'

// private members
var request = new XMLHttpRequest();
var username = null, result = {};
var devServer = "http://podstruct-api-intg-env.eba-espxmmpg.us-east-1.elasticbeanstalk.com/",
    prodServer = "https://d1vp98nn3zy5j1.cloudfront.net/" ;
var endpointPath = "podstruct/api/user/auth/resetpassword";

/********************
 * Public Methods
 ********************/

function send(requestHeader) {
    if (requestHeader) {
        username = requestHeader;
        _initialize();
        request.send();
    }
    return result;
}

/********************
 * Private Methods
 ********************/

function _initialize() {
    request.open("POST", devServer + endpointPath, false);
    // request.open("POST", prodServer + endpointPath, false);
    request.setRequestHeader("accept", "*/*");
    request.setRequestHeader("username", username);
    request.onload = __execute;
}

/********************
 * Event handlers
 ********************/

function __execute() {
    if (request.status >= 400) {
        var data = JSON.parse(this.response);
        result.isSuccess = false;
        result.message = handleError(request.status, data);
    } else {
        localStorage.setItem('username', username);
        result.isSuccess = true;
    }
}

export default send;
