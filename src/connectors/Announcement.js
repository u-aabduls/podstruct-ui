import handleError from '../utils/ErrorHandler.js'
import formatParams from '../utils/ParamFormatter.js';

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

function getPodAnnouncements(podID, lastEvaluatedKey, pageSize) {
    var endpointPathEXT = endpointPath + podID + "/announcements"
    var params = {};
    if (lastEvaluatedKey) params.lastEvaluatedKey = lastEvaluatedKey
    if (pageSize) params.pageSize = pageSize
    console.log(formatParams(params))
    _initialize("GET", endpointPathEXT + formatParams(params));
    request.send();
    return result;
}

function createPodAnnouncement(podID, requestBody) {
    var endpointPathEXT = endpointPath + podID + "/announcements"
    _initialize("POST", endpointPathEXT);
    request.send(requestBody);
    return result;
}

function deletePodAnnouncement(podID, announcementDate) {
    var endpointPathEXT = endpointPath + podID + "/announcements/" + announcementDate
    _initialize("DELETE", endpointPathEXT);
    request.send();
    return result;
}
function getCourseAnnouncements(podID, courseID, lastEvaluatedKey, pageSize) {
    var endpointPathEXT = endpointPath + podID + "/courses/" + courseID + "/announcements"
    var params = {};
    if (lastEvaluatedKey) params.lastEvaluatedKey = lastEvaluatedKey
    if (pageSize) params.pageSize = pageSize
    _initialize("GET", endpointPathEXT + formatParams(params));
    request.send();
    return result;
}

function createCourseAnnouncement(podID, courseID, requestBody) {
    var endpointPathEXT = endpointPath + podID + "/courses/" + courseID + "/announcements"
    _initialize("POST", endpointPathEXT);
    request.send(requestBody);
    return result;
}

function deleteCourseAnnouncement(podID, courseID, announcementDate) {
    var endpointPathEXT = endpointPath + podID + "/courses/" + courseID + "/announcements/" + announcementDate
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
                result.message = "Successfully fetched announcement(s)"
                break;
            case "POST":
                result.message = "Successfully created announcement"
                break;
            case "PUT":
                result.message = "Successfully edited announcement"
                break;
            case "DELETE":
                result.message = "Successfully deleted announcement"
                break;
            default:
                result.message = "Successfully reached announcement endpoint";
        }
    }
}

export { getPodAnnouncements, createPodAnnouncement, deletePodAnnouncement, getCourseAnnouncements, createCourseAnnouncement, deleteCourseAnnouncement };