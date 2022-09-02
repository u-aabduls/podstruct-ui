import React from 'react';
import { Input } from 'reactstrap';
import swal from '@sweetalert/with-react';
import send from "../../../connectors/PodCreation";
import "../../../styles/app/modals/pod-creation.css";

var podName = "",
    description = "",
    phone = "",
    address = "",
    error = {
        found: false,
        message: ""
    };

function resetValues() {
    podName = "";
    description = "";
    phone = "";
    address = "";
}

function constructRequestPayload(podName, description, phone, address) {
    var payload = {
        podName: podName,
        phone: phone,
        address: address
    }
    if (description) {
        payload.description = description;
    }
    return JSON.stringify(payload);
}

function isNotEmpty(input, value) {
    var errorFound = !(value !== '' && value !== "" && value != null && value !== undefined);
    return {
        found: errorFound,
        message: errorFound ? input + " is required" : ""
    }
}

function isWithin45CharLimit(input, value) {
    var errorFound = value.length > 45;
    return {
        found: errorFound,
        message: errorFound ? input + " must not have more than 45 characters" : ""
    }
}

function isWithin100CharLimit(input, value) {
    var errorFound = value.length > 100;
    return {
        found: errorFound,
        message: errorFound ? input + " must not have more than 100 characters" : ""
    }
}

function isInvalidPODName(input, value) {
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ".split("");
    const num = "0123456789".split("");

    // name not valid if less than 2 characters long
    if (value.length < 2) {
        return {
            found: true,
            message: input + " must contain at least 2 characters"
        };
    }

    var i = value.length;
    value = value.toUpperCase();
    while (i--) {
        var char = value.charAt(i);
        if (!alpha.includes(char) && !num.includes(char)) {
            if (char !== '-') {
                return {
                    found: true,
                    message: input + " must contain alpha, numeric, or hyphen characters only"
                };
            }
        }
    }

    return {
        found: false,
        message: ""
    };
}

function beginsOrEndsWithSpace(input, value) {
    var errorFound = value.substring(0, 1) === " " || value.substring(value.length - 1, value.length) === " ";
    return {
        found: errorFound,
        message: errorFound ? input + " must not begin or end with a space character" : ""
    };
}

function containsConsecutiveSpaces(input, value) {
    var index = value.indexOf(" ");
    if (value < 0 || index === value.length - 1) {
        return {
            found: false,
            message: ""
        }
    } else {
        var errorFound = value.charAt(index + 1) === " ";
        return {
            found: errorFound,
            message: errorFound ? input + " must not contain consecutive space characters" : ""
        }
    }
}

function isInvalidPhoneNumber(input, value) {
    const num = "0123456789".split("");
    const special = "()-".split("");

    if (value.length < 10) {
        return {
            found: true,
            message: input + " must contain exactly 10 digits"
        };
    }

    var i = value.length,
        numbers = 0,
        containsInvalidChar = false;

    while (i-- && !containsInvalidChar) {
        var char = value.charAt(i);
        if (num.includes(char)) {
            numbers++;
        } else if (!special.includes(char)) {
            containsInvalidChar = true;
        }
    }
    var errorFound = numbers !== 10 || containsInvalidChar;
    return {
        found: errorFound,
        message: errorFound ? input + " must contain exactly 10 digits" : ""
    }
}

function parsePhoneNumber(phoneNumber) {
    return "+" + phoneNumber.replaceAll("(", "").replaceAll(")", "").replaceAll("-", "");
}

function renderSwal() {

    swal({
        text: "Create a Pod",
        buttons: {
            cancel: "Cancel",
            create: {
                text: "Create Pod",
                value: true
            }
        },
        content: (
            <form name="podCreate">
                <div className="form-group">
                    <label className="text-muted" htmlFor="id-podName">Name</label>
                    <div className="input-group with-focus">
                        <Input
                            type="text"
                            id="id-podName"
                            name="podName"
                            className="border-right-0"
                            placeholder="Name"
                            defaultValue={podName ? podName : ""}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text text-muted bg-transparent border-left-0">
                                <em className="fa fa-book"></em>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label className="text-muted" htmlFor="id-description">Description</label>
                    <div className="input-group with-focus">
                        <Input
                            type="textarea"
                            id="id-description"
                            name="description"
                            className="border-right-0 no-resize"
                            placeholder="Description"
                            defaultValue={description ? description : ""}
                            rows={5}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text text-muted bg-transparent border-left-0">
                                <em className="fa fa-book"></em>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label className="text-muted" htmlFor="id-phone">Phone Number</label>
                    <div className="input-group with-focus">
                        <Input
                            type="text"
                            id="id-phone"
                            name="phone"
                            className="border-right-0"
                            placeholder="(XXX) XXX-XXXX"
                            defaultValue={phone ? phone : ""}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text text-muted bg-transparent border-left-0">
                                <em className="fa fa-phone"></em>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label className="text-muted" htmlFor="id-address">Address</label>
                    <div className="input-group with-focus">
                        <Input
                            type="text"
                            id="id-address"
                            name="address"
                            className="border-right-0"
                            placeholder="Address"
                            defaultValue={address ? address : ""}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text text-muted bg-transparent border-left-0">
                                <em className="fa fa-book"></em>
                            </span>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
    ).then(
        (createPodButtonClicked) => {
            if (createPodButtonClicked) {

                podName = document.getElementById("id-podName").value;
                description = document.getElementById("id-description").value;
                phone = document.getElementById("id-phone").value;
                address = document.getElementById("id-address").value;

                // validate podName value
                error = isNotEmpty("Pod name", podName);
                error = (error.found) ? error : isWithin45CharLimit("Pod name", podName);
                error = (error.found) ? error : isInvalidPODName("Pod name", podName);
                error = (error.found) ? error : beginsOrEndsWithSpace("Pod name", podName);
                error = (error.found) ? error : containsConsecutiveSpaces("Pod name", podName);

                // validate pod description value
                error = (error.found) ? error : isWithin100CharLimit("Pod description", description);
                error = (error.found) ? error : beginsOrEndsWithSpace("Pod description", description);
                error = (error.found) ? error : containsConsecutiveSpaces("Pod description", description);

                // validate phone value
                error = (error.found) ? error : isNotEmpty("Pod phone number", phone);
                error = (error.found) ? error : isInvalidPhoneNumber("Pod phone number", phone);

                // validate address
                // TODO: validation when requirements are defined

                if (!error.found) {
                    var result = send(constructRequestPayload(podName, description, parsePhoneNumber(phone), address));
                    if (result.isSuccess) {
                        swal({
                            title: "Successfully created pod",
                            icon: "success",
                            buttons: {
                                create: {
                                    text: "OK",
                                    value: true
                                }
                            },
                        }).then(
                            (acknowledged) => {
                                window.location.href = (acknowledged) ? window.location.href : window.location.href;
                                resetValues();
                            }
                        )
                    } else {
                        swal({
                            title: "Failed to create pod",
                            text: result.message,
                            icon: "error",
                            buttons: {
                                create: {
                                    text: "OK",
                                    value: true
                                }
                            },
                        }).then(
                            (acknowledged) => {
                                resetValues();
                            }
                        );
                    }
                } else {
                    swal({
                        title: "Error found",
                        text: error.message,
                        icon: "error",
                        buttons: {
                            cancel: "Cancel",
                            create: {
                                text: "Edit",
                                value: true
                            }
                        },
                    }).then(
                        (acknowledged) => {
                            if (acknowledged) {
                                renderSwal();
                            } else {
                                resetValues();
                            }
                        }
                    );
                }
            }
        }
    )
}

export default renderSwal;