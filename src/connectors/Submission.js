import handleError from '../utils/ErrorHandler.js'
import { endpointServer } from './Paths.js';

// private members
var request = new XMLHttpRequest();
var result = {}, httpMethod = null;
var endpointPath = "podstruct/api/pods/";
var authorizationToken;

/********************
 * Public Methods
 ********************/

function getDocumentSubmissions(podId, courseId, assignmentId) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/courses/" + courseId + "/assignment/" + assignmentId + "/submit/document";
    _initialize("GET", endpointPathEXT);
    request.send();
    return result;
}

function getQuestionSubmissions(podId, courseId, assignmentId, questionId) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/courses/" + courseId + "/assignment/" + assignmentId + "/question/" + questionId + "/submit";
    _initialize("GET", endpointPathEXT);
    request.send();
    return result;
}

function getDocumentSubmission(podId, courseId, assignmentId, fileName) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/courses/" + courseId + "/assignment/" + assignmentId + "/submit/document/" + fileName;
    _initialize("GET", endpointPathEXT);
    request.send();
    return result;
}

// ADMIN GET ENDPOINT
// function getPodDocument(podId, fileName) {
//     authorizationToken = localStorage.getItem('token');
//     var endpointPathEXT = endpointPath + podId + "/document/" + fileName;
//     _initialize("GET", endpointPathEXT);
//     request.send();
//     return result;
// }

function createDocumentSubmission(podId, courseId, assignmentId, requestBody) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/courses/" + courseId + "/assignment/" + assignmentId + "/submit/document";
    _initialize("POST", endpointPathEXT);
    request.send(requestBody);
    return result;
}

function createQuestionSubmission(podId, courseId, assignmentId, questionId, requestBody) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/courses/" + courseId + "/assignment/" + assignmentId + "/question/" + questionId + "/submit";
    _initialize("POST", endpointPathEXT);
    request.send(requestBody);
    return result;
}


function deleteDocumentSubmission(podId, courseId, assignmentId, fileName) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/courses/" + courseId + "/assignment/" + assignmentId + "/submit/document/" + fileName;
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
                result.message = "Successfully fetched document(s)"
                break;
            case "POST":
                result.message = "Successfully created document"
                break;
            case "DELETE":
                result.message = "Successfully deleted document"
                break;
            default:
                result.message = "Successfully reached document endpoint";
        }
    }
}

export {
    getDocumentSubmission,
    getDocumentSubmissions,
    getQuestionSubmissions,
    createDocumentSubmission,
    createQuestionSubmission,
    deleteDocumentSubmission,
};