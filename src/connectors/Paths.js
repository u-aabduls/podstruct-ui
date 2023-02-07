/* eslint no-unused-vars: 0 */  // --> OFF

var devEndpointServer = "http://podstruct-api-intg-env.eba-espxmmpg.us-east-1.elasticbeanstalk.com/",
    prodEndpointServer = "https://d1vp98nn3zy5j1.cloudfront.net/",
    devWebServer = "http://podstruct-ui-test.s3-website-us-east-1.amazonaws.com/",
    prodWebServer = "";

var endpointServer = devEndpointServer;
var webServer = devWebServer;

export { endpointServer , webServer }