import handleError from '../utils/ErrorHandler.js'

// private members
var request = new XMLHttpRequest();
var result = {};
var devServer = "http://podstruct-api-intg-env.eba-espxmmpg.us-east-1.elasticbeanstalk.com/",
    prodServer = "https://d1vp98nn3zy5j1.cloudfront.net/" ;
var endpointPath = "podstruct/api/pods/";
var authorizationToken = localStorage.getItem('token');

/********************
 * Public Methods
 ********************/

function getCourseAnnouncements(podID, courseID, epochSeconds) {
    var endpointPathEXT = endpointPath + podID + "/courses/" + courseID + "/announcements?endDateTimeEpochSeconds=" + epochSeconds
    _initialize("GET", endpointPathEXT);
    request.send();
    return result;
}

function addCourseAnnouncement(podID, courseID, requestBody) {
    var endpointPathEXT = endpointPath + podID + "/courses/" + courseID + "/announcements"
    _initialize("POST", endpointPathEXT);
    request.send(requestBody);
    return result;
}

/********************
 * Private Methods
 ********************/

 function _initialize(method,  endpointPathEXT) {
    switch (method){
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
        result.message = "Successfully reached Course endpoint.";
    }
}

export { getCourseAnnouncements, addCourseAnnouncement};