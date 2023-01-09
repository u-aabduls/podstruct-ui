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

function getAssignments(podID, courseID, pageSize) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podID + "/courses/" + courseID + "/assignment";
    var params = {};
    if (pageSize) params.pageSize = pageSize
    _initialize("GET", endpointPathEXT + formatParams(params));
    request.send();
    return result;
}

function getAssignment(podID, courseID, assignmentID) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podID + "/courses/" + courseID + "/assignment/" + assignmentID;
    _initialize("GET", endpointPathEXT);
    request.send();
    return result;
}

function createAssignment(podID, courseID, requestBody) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podID + "/courses/" + courseID + "/assignment";
    _initialize("POST", endpointPathEXT);
    request.send(requestBody);
    return result;
}

function deleteAssignment(podID, courseID, assignmentID) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podID + "/courses/" + courseID + "/assignment/" + assignmentID;
    _initialize("DELETE", endpointPathEXT);
    request.send();
    return result;
}

function publishAssignment(podID, courseID, assignmentID) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podID + "/courses/" + courseID + "/assignment/" + assignmentID;
    _initialize("POST", endpointPathEXT);
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
                result.message = "Successfully fetched assignment(s)"
                break;
            case "POST":
                result.message = "Successfully created/published assignment"
                break;
            case "PUT":
                result.message = "Successfully edited assignment"
                break;
            case "DELETE":
                result.message = "Successfully deleted assignment"
                break;
            default:
                result.message = "Successfully reached assignment endpoint";
        }
    }
}

export { getAssignments, getAssignment, createAssignment, deleteAssignment, publishAssignment};