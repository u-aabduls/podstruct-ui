import handleError from '../utils/ErrorHandler.js'

// private members
var request = new XMLHttpRequest();
var result = {};
var devServer = "http://podstruct-api-intg-env.eba-espxmmpg.us-east-1.elasticbeanstalk.com/",
    prodServer = "https://d1vp98nn3zy5j1.cloudfront.net/" ;
var endpointPath = "podstruct/api/user";
var authorizationToken = localStorage.getItem('token');

/********************
 * Public Methods
 ********************/

function updateUser(requestBody) {
    _initializePUT();
    request.send(requestBody);
    return result;
}
function getUser() {
    _initializeGET();
    request.send();
    return result;
}

/********************
 * Private Methods
 ********************/

function _initializePUT() {
    request.open("PUT", devServer + endpointPath, false);
    // request.open("POST", prodServer + endpointPath, false);
    request.setRequestHeader("accept", "*/*");
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader('Authorization', 'Bearer ' + authorizationToken)
    request.onload = __executePUT;
}

function _initializeGET() {
    request.open("GET", devServer + endpointPath, false);
    // request.open("POST", prodServer + endpointPath, false);
    request.setRequestHeader("accept", "*/*");
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader('Authorization', 'Bearer ' + authorizationToken)
    request.onload = __executeGET;
}

/********************
 * Event handlers
 ********************/

function __executeGET() {
    var data = JSON.parse(this.response);
    if (request.status >= 400) {
        result.isSuccess = false;
        result.message = handleError(request.status, data);
    } else {
        result.isSuccess = true;
        result.data = data;
        result.message = "";
    }
}

function __executePUT() {
    if (request.status >= 400) {
        var data = JSON.parse(this.response);
        result.isSuccess = false;
        result.message = handleError(request.status, data);
    } else {
        result.isSuccess = true;
        result.data = data;
        result.message = "Updated Successfully";
    }
}

export {updateUser, getUser};