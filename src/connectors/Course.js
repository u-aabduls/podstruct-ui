import handleError from '../utils/ErrorHandler.js'

// private members
var request = new XMLHttpRequest();
var result = {};
var devServer = "http://podstruct-api-intg-env.eba-espxmmpg.us-east-1.elasticbeanstalk.com/",
    prodServer = "https://d1vp98nn3zy5j1.cloudfront.net/" ;
var endpointPath = "podstruct/api/pods";
var authorizationToken = localStorage.getItem('token');

/********************
 * Public Methods
 ********************/

function getCourses(podID, subject) {
    endpointPath = "podstruct/api/pods";
    endpointPath += subject? "/" + podID + "/courses?subject=" + subject  : "/" + podID + "/courses"
    _initialize("GET");
    request.send();
    return result;
}

function getCourse(podID, courseID){
    endpointPath = "podstruct/api/pods";
    endpointPath += "/" + podID + "/courses/" + courseID;
    _initialize("GET");
    request.send();
    return result;
}

function addCourse(podID, requestBody){
    endpointPath = "podstruct/api/pods";
    endpointPath += "/" + podID + "/courses";
    _initialize("POST");
    request.send(requestBody);
    return result;
}

function editCourse(podID, courseID, requestBody){
    endpointPath = "podstruct/api/pods";
    endpointPath += "/" + podID + "/courses/" + courseID;
    _initialize("PUT");
    request.send(requestBody);
    return result;
}

/********************
 * Private Methods
 ********************/

 function _initialize(method) {
    switch (method){
        case "GET":
            request.open("GET", devServer + endpointPath, false);
            break;
        case "POST":
            request.open("POST", devServer + endpointPath, false);
            break;
        case "PUT":
            request.open("PUT", devServer + endpointPath, false);
            break;
        case "DELETE":
            request.open("DELETE", devServer + endpointPath, false);
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

export { getCourses, getCourse, addCourse, editCourse};