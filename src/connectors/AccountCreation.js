// private members
var request = new XMLHttpRequest();
var result = {};
var devServer = "http://podstruct-api-intg-env.eba-espxmmpg.us-east-1.elasticbeanstalk.com/",
    prodServer = "https://d1vp98nn3zy5j1.cloudfront.net/" ;
var endpointPath = "podstruct/api/user";

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
    if (request.status >= 400) {
        var data = JSON.parse(this.response);
        console.log('error code: ' + request.status);
        result.isSuccess = false;
        result.message = (data.message) ? 
                            data.message : (data.errors[0].message) ? 
                                data.errors[0].message : "An unexpected error occurred.";
    } else {
        console.log('Successfully created an account');
        result.isSuccess = true;
        result.message = "Successfully created account! Please check your email to verify your account."
    }
}

export default send;
