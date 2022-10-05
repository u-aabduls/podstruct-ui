import handleError from '../utils/ErrorHandler.js'

// private members
var request = new XMLHttpRequest();
var result = {}, httpMethod = null;
var devServer = "http://podstruct-api-intg-env.eba-espxmmpg.us-east-1.elasticbeanstalk.com/",
    prodServer = "https://d1vp98nn3zy5j1.cloudfront.net/";
var endpointPath = "podstruct/api/pods/";
var authorizationToken = localStorage.getItem('token');

/********************
 * Public Methods
 ********************/

function getPods() {
    var endpointPathEXT = endpointPath
    _initialize("GET", endpointPathEXT);
    request.send();
    return result;
}

function getPod(podID) {
    var endpointPathEXT = endpointPath + podID
    _initialize("GET", endpointPathEXT);
    request.send();
    return result;
}

function createPod(requestBody) {
    var endpointPathEXT = endpointPath
    _initialize("POST", endpointPathEXT);
    request.send(requestBody);
    return result;
}

function editPod(podID, requestBody) {
    var endpointPathEXT = endpointPath + podID
    _initialize("PUT", endpointPathEXT);
    request.send(requestBody);
    return result;
}

function deactivatePod(podID) {
    var endpointPathEXT = endpointPath + podID
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
                result.message = "Successfully fetched pods."
                break;
            case "POST":
                result.message = "Successfully created pod."
                break;
            case "PUT":
                result.message = "Successfully edited pod."
                break;
            case "DELETE":
                result.message = "Successfully deleted pod."
                break;
            default:
                result.message = "Successfully reached pod endpoint.";
        }
    }
}

export { getPods, getPod, createPod, editPod, deactivatePod };
