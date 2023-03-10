import handleError from '../utils/ErrorHandler.js'
import formatParams from '../utils/ParamFormatter.js';
import { endpointServer } from './Paths.js';

// private members
var request = new XMLHttpRequest();
var result = {}, httpMethod = null;
var endpointPath = "podstruct/api/pods/";
var authorizationToken;

/********************
 * Public Methods
 ********************/

function getPodAnnouncements(podId, lastEvaluatedKey, pageSize) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/announcements";
    var params = {};
    if (lastEvaluatedKey) params.lastEvaluatedKey = lastEvaluatedKey;
    if (pageSize) params.pageSize = pageSize;
    _initialize("GET", endpointPathEXT + formatParams(params));
    request.send();
    return result;
}

function createPodAnnouncement(podId, requestBody) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/announcements";
    _initialize("POST", endpointPathEXT);
    request.send(requestBody);
    return result;
}

function updatePodAnnouncement(podId, announcementDate, requestBody) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/announcements/" + announcementDate;
    _initialize("PUT", endpointPathEXT);
    request.send(requestBody);
    return result;
}

function deletePodAnnouncement(podId, announcementDate) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/announcements/" + announcementDate;
    _initialize("DELETE", endpointPathEXT);
    request.send();
    return result;
}
function getCourseAnnouncements(podId, courseID, lastEvaluatedKey, pageSize) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/courses/" + courseID + "/announcements";
    var params = {};
    if (lastEvaluatedKey) params.lastEvaluatedKey = lastEvaluatedKey;
    if (pageSize) params.pageSize = pageSize;
    _initialize("GET", endpointPathEXT + formatParams(params));
    request.send();
    return result;
}

function createCourseAnnouncement(podId, courseID, requestBody) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/courses/" + courseID + "/announcements";
    _initialize("POST", endpointPathEXT);
    request.send(requestBody);
    return result;
}

function updateCourseAnnouncement(podId, courseId, announcementDate, requestBody) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/courses/" + courseId + "/announcements/" + announcementDate;
    _initialize("PUT", endpointPathEXT);
    request.send(requestBody);
    return result;
}

function deleteCourseAnnouncement(podId, courseID, announcementDate) {
    authorizationToken = localStorage.getItem('token');
    var endpointPathEXT = endpointPath + podId + "/courses/" + courseID + "/announcements/" + announcementDate;
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
        case "PUT":
            request.open("PUT", endpointServer + endpointPathEXT, false);
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
                result.message = "Successfully fetched announcement(s)"
                break;
            case "POST":
                result.message = "Successfully created announcement"
                break;
            case "PUT":
                result.message = "Successfully updated announcement"
                break;
            case "DELETE":
                result.message = "Successfully deleted announcement"
                break;
            default:
                result.message = "Successfully reached announcement endpoint";
        }
    }
}

export {
    getPodAnnouncements,
    createPodAnnouncement,
    updatePodAnnouncement,
    deletePodAnnouncement,
    getCourseAnnouncements,
    createCourseAnnouncement,
    updateCourseAnnouncement,
    deleteCourseAnnouncement
};