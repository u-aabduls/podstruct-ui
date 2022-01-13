// private members
var request = new XMLHttpRequest();

/********************
 * Public Methods
 ********************/

function send(requestBody) {
    _initialize();
    request.send(requestBody);
}

/********************
 * Private Methods
 ********************/

function _initialize() {
    request.open("POST", "https://d1vp98nn3zy5j1.cloudfront.net/podstruct/api/rest/pod", true);
    request.setRequestHeader("accept", "*/*");
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = __execute;
}

/********************
 * Event handlers
 ********************/

function __execute() {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)

    if (request.status >= 200 && request.status < 400) {
        // TODO:
        console.log('successfully created an account');
    } else {
        console.log('error code: ' + request.status);
    }
}

export default send;
