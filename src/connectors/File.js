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

function getPodDocuments(podId) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/document";
    _initialize("GET", endpointPathEXT);
    request.send();
    return result;
}

function getCourseDocuments(podId, courseId) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/courses/" + courseId + "/document";
    _initialize("GET", endpointPathEXT);
    request.send();
    return result;
}

function getAssignmentDocuments(podId, courseId, assignmentId) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/courses/" + courseId + "/assignment/" + assignmentId + "/document";
    _initialize("GET", endpointPathEXT);
    request.send();
    return result;
}

function getPodDocument(podId, fileName) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/document/" + fileName;
    _initialize("GET", endpointPathEXT);
    request.send();
    return result;
}

function getCourseDocument(podId, courseId, fileName) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/courses/" + courseId + "/document/" + fileName;
    _initialize("GET", endpointPathEXT);
    request.send();
    return result;
}

function getAssignmentDocument(podId, courseId, assignmentId, fileName) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/courses/" + courseId + "/assignment/" + assignmentId + "/document/" + fileName;
    _initialize("GET", endpointPathEXT);
    request.send();
    return result;
}

function createPodDocument(podId, requestBody) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/document";
    _initialize("POST", endpointPathEXT);
    request.send(requestBody);
    return result;
}

function createCourseDocument(podId, courseId, requestBody) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/courses/" + courseId + "/document";
    _initialize("POST", endpointPathEXT);
    request.send(requestBody);
    return result;
}

function createAssignmentDocument(podId, courseId, assignmentId, requestBody) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/courses/" + courseId + "/assignment/" + assignmentId + "/document";
    _initialize("POST", endpointPathEXT);
    request.send(requestBody);
    return result;
}

function deletePodDocument(podId, fileName) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/document/" + fileName;
    _initialize("DELETE", endpointPathEXT);
    request.send();
    return result;
}

function deleteCourseDocument(podId, courseId, fileName) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/courses/" + courseId + "/document/" + fileName;
    _initialize("DELETE", endpointPathEXT);
    request.send();
    return result;
}

function deleteAssignmentDocument(podId, courseId, assignmentId, fileName) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/courses/" + courseId + "/assignment/" + assignmentId + "/document/" + fileName;
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
    getPodDocuments,
    getCourseDocuments,
    getAssignmentDocuments,
    getPodDocument,
    getCourseDocument,
    getAssignmentDocument,
    createPodDocument,
    createCourseDocument,
    createAssignmentDocument,
    deletePodDocument,
    deleteCourseDocument,
    deleteAssignmentDocument
};