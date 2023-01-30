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

function getCourses(podID, subject) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podID + "/courses"
    var params = {};
    if (subject) params.subject = subject
    _initialize("GET", endpointPathEXT + formatParams(params));
    request.send();
    return result;
}

function getCourse(podID, courseID) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podID + "/courses/" + courseID;
    _initialize("GET", endpointPathEXT);
    request.send();
    return result;
}

function createCourse(podID, requestBody) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podID + "/courses";
    _initialize("POST", endpointPathEXT);
    request.send(requestBody);
    return result;
}

function editCourse(podID, courseID, requestBody) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podID + "/courses/" + courseID;
    _initialize("PUT", endpointPathEXT);
    request.send(requestBody);
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
                result.message = "Successfully fetched course(s)"
                break;
            case "POST":
                result.message = "Successfully created course"
                break;
            case "PUT":
                result.message = "Successfully edited course"
                break;
            case "DELETE":
                result.message = "Successfully deleted course"
                break;
            default:
                result.message = "Successfully reached course endpoint";
        }
    }
}

export { getCourses, getCourse, createCourse, editCourse };