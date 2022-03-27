// private members
var request = new XMLHttpRequest();
var result = {};
var devServer = "http://podstruct-api-intg-env.eba-espxmmpg.us-east-1.elasticbeanstalk.com/",
    prodServer = "https://d1vp98nn3zy5j1.cloudfront.net/" ;
var endpointPath = "podstruct/api/rest/pod";

/********************
 * Public Methods
 ********************/

function send(requestBody) {
    _initialize();
    request.send(requestBody);
    return result;
}

/********************
 * Private Methods
 ********************/

function _initialize() {
    request.open("POST", devServer + endpointPath, false);
    // request.open("POST", prodServer + endpointPath, false);
    request.setRequestHeader("accept", "*/*");
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = __execute;
}

/********************
 * Event handlers
 ********************/

function __execute() {
    // Begin accessing JSON data here
    // this.response.setHeader("Access-Control-Allow-Origin", "*");
    // this.response.setHeader("Access-Control-Allow-Credentials", "true");
    // this.response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    // this.response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    var data = JSON.parse(this.response)

    if (request.status >= 200 && request.status < 400) {
        // TODO:
        console.log('successfully created an account');
        result.isSuccess = true;
    } else {
        console.log('error code: ' + request.status);
        result.isSuccess = false;
    }
    result.message = (data.message) ? data.message : (data.errors[0].message) ? data.errors[0].message : "An unexpected error occurred.";
}

export default send;
