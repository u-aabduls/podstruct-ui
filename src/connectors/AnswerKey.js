import handleError from '../utils/ErrorHandler.js'
import formatParams from '../utils/ParamFormatter.js';
import {devServer, prodServer} from './Paths.js';

// private members
var request = new XMLHttpRequest();
var result = {}, httpMethod = null;
var endpointPath = "podstruct/api/pods/";
var authorizationToken;

/********************
 * Public Methods
 ********************/

function getAnswerKeys(podID, courseID, assignmentID, page, size, sort) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podID + "/courses/" + courseID + "/assignment/" + assignmentID + "/question/";
    var params = {};
    if (page) params.page = page
    if (size) params.size = size
    if (sort) params.sort = sort
    _initialize("GET", endpointPathEXT + formatParams(params));
    request.send();
    return result;
}

function getAnswerKey(podID, courseID, assignmentID, questionID) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podID + "/courses/" + courseID + "/assignment/" + assignmentID + "/question/" + questionID;
    _initialize("GET", endpointPathEXT);
    request.send();
    return result;
}

function createAnswerKey(podID, courseID, assignmentID, requestBody) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podID + "/courses/" + courseID + "/assignment/" + assignmentID + "/question";
    _initialize("POST", endpointPathEXT);
    request.send(requestBody);
    return result;
}

function editAnswerKey(podID, courseID, assignmentID, questionID, requestBody) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podID + "/courses/" + courseID + "/assignment/" + assignmentID + "/question/" + questionID;
    _initialize("PUT", endpointPathEXT);
    request.send(requestBody);
    return result;
}

function deleteAnswerKey(podID, courseID, assignmentID, questionID) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podID + "/courses/" + courseID + "/assignment/" + assignmentID + "/question/" + questionID;
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
                result.message = "Successfully fetched answer Key(s)"
                break;
            case "POST":
                result.message = "Successfully created answer Key"
                break;
            case "PUT":
                result.message = "Successfully edited answer Key"
                break;
            case "DELETE":
                result.message = "Successfully deleted answer Key"
                break;
            default:
                result.message = "Successfully reached answer Key endpoint";
        }
    }
}

export { getAnswerKeys, getAnswerKey, createAnswerKey, editAnswerKey, deleteAnswerKey};