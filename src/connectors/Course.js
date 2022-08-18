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

async function getPods() {
     endpointPath = "podstruct/api/pods";
    _initializeGETPods();
    request.send();
    return result;
}

async function getCourses(podID, subject) {
    endpointPath = "podstruct/api/pods";
    endpointPath += subject? "/" + podID + "/courses?subject=" + subject  : "/" + podID + "/courses"
    _initializeGETCourses();
    request.send();
    return result;
}

async function getCourse(podID, courseID){
    endpointPath = "podstruct/api/pods/" + podID + "/courses/" + courseID;
    _initializeGETCourses();
    request.send();
    return result;
}

function addCourse(podID, requestBody){
    endpointPath = "podstruct/api/pods/" + podID + "/courses";
    _initializePOSTCourse();
    request.send(requestBody);
    return result;
}

function editCourse(podID, courseID, requestBody){
    endpointPath = "podstruct/api/pods/" + podID + "/courses/" + courseID;
    _initializePUTCourse();
    request.send(requestBody);
    return result;
}

/********************
 * Private Methods
 ********************/

 function _initializeGETPods() {
    request.open("GET", devServer + endpointPath, false);
    // request.open("POST", prodServer + endpointPath, false);
    request.setRequestHeader("accept", "*/*");
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader('Authorization', 'Bearer ' + authorizationToken)
    request.onload = __execute;
}

function _initializeGETCourses() {
    request.open("GET", devServer + endpointPath, false);
    // request.open("POST", prodServer + endpointPath, false);
    request.setRequestHeader("accept", "*/*");
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader('Authorization', 'Bearer ' + authorizationToken)
    request.onload = __execute;
}

function _initializePOSTCourse() {
    request.open("POST", devServer + endpointPath, false);
    // request.open("POST", prodServer + endpointPath, false);
    request.setRequestHeader("accept", "*/*");
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader('Authorization', 'Bearer ' + authorizationToken)
    request.onload = __execute;
}

function _initializePUTCourse() {
    request.open("PUT", devServer + endpointPath, false);
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
        result.message = "";
    }
}

export {getPods, getCourses, getCourse, addCourse, editCourse};