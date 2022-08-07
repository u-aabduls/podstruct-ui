import React from 'react';
import { Input } from 'reactstrap';
import Select from 'react-select';
import swal from '@sweetalert/with-react';
//import "../../../styles/app/modals/pod-creation.css";

var subject = "",
    teacher = "",
    daysOfWeekInterval = "",
    startTime = "",
    endTime = "",
    description = "",
    pods = [],
    selectedPod = "",
    options = [],
    error = {
        found: false,
        message: ""
    };

var colourStyles = {
    placeholder: (provided) => ({
        ...provided,
        color: "#b7bac9",
    })
}

function resetValues() {
    subject = "";
    teacher = "";
    daysOfWeekInterval = "";
    startTime = "";
    endTime = "";
    description = "";
}

function constructRequestPayload(subject, teacher, daysOfWeekInterval, startTime, endTime, description,) {
    var payload = {
        subject: subject,
        teacher: teacher,
        daysOfWeekInterval: daysOfWeekInterval,
        startTime: startTime,
        endTime: endTime,
    }
    if (description) {
        payload.description = description;
    }
    return JSON.stringify(payload);
}

function setOptions() {
    options = pods.map(function (pod) {
        return { value: pod.id, label: pod.podName }
    })
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

function isInvalidsubject(input, value) {
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

function renderSwal(event, pod) {
    pods = pod;
    setOptions();
    swal({
        text: "Create a Course",
        buttons: {
            cancel: "Cancel",
            create: {
                text: "Create Course",
                value: true
            }
        },
        content: (
            <form name="courseCreate">
                <div className="form-group">
                    <label className="text-muted" htmlFor="id-pod">Pod</label>
                    <Select
                        name="podSelector"
                        placeholder="Select a Pod..."
                        simpleValue
                        styles={colourStyles}
                        value={options.find(o => o.value === selectedPod)}
                        onChange={(e) => { selectedPod = e.value }}
                        options={[
                            { value: '01', label: 'Jan' },
                            { value: '02', label: 'Feb' },
                            { value: '03', label: 'Mar' },
                            { value: '04', label: 'Apr' },
                            { value: '05', label: 'May' },
                            { value: '06', label: 'Jun' },
                            { value: '07', label: 'Jul' },
                            { value: '08', label: 'Aug' },
                            { value: '09', label: 'Sept' },
                            { value: '10', label: 'Oct' },
                            { value: '11', label: 'Nov' },
                            { value: '12', label: 'Dec' }
                          ]}
                    />
                </div>
                <div className="form-group">
                    <label className="text-muted" htmlFor="id-subject">Subject</label>
                    <div className="input-group with-focus">
                        <Input
                            type="text"
                            id="id-subject"
                            name="subject"
                            className="border-right-0"
                            placeholder="Name"
                            defaultValue={subject ? subject : ""}
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
                    <label className="text-muted" htmlFor="id-daysOfWeekInterval">daysOfWeekInterval</label>
                    <div className="input-group with-focus">
                        <Input
                            type="text"
                            id="id-daysOfWeekInterval"
                            name="daysOfWeekInterval"
                            className="border-right-0"
                            placeholder="(XXX) XXX-XXXX"
                            defaultValue={daysOfWeekInterval ? daysOfWeekInterval : ""}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text text-muted bg-transparent border-left-0">
                                <em className="fa fa-daysOfWeekInterval"></em>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label className="text-muted" htmlFor="id-startTime">startTime</label>
                    <div className="input-group with-focus">
                        <Input
                            type="text"
                            id="id-startTime"
                            name="startTime"
                            className="border-right-0"
                            placeholder="startTime"
                            defaultValue={startTime ? startTime : ""}
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

                subject = document.getElementById("id-subject").value;
                description = document.getElementById("id-description").value;
                daysOfWeekInterval = document.getElementById("id-daysOfWeekInterval").value;
                startTime = document.getElementById("id-startTime").value;

                // validate subject value
                error = isNotEmpty("Pod name", subject);
                error = (error.found) ? error : isWithin45CharLimit("Pod name", subject);
                error = (error.found) ? error : isInvalidsubject("Pod name", subject);
                error = (error.found) ? error : beginsOrEndsWithSpace("Pod name", subject);
                error = (error.found) ? error : containsConsecutiveSpaces("Pod name", subject);

                // validate pod description value
                error = (error.found) ? error : isWithin100CharLimit("Pod description", description);
                error = (error.found) ? error : beginsOrEndsWithSpace("Pod description", description);
                error = (error.found) ? error : containsConsecutiveSpaces("Pod description", description);

                // validate daysOfWeekInterval value


                // validate startTime
                // TODO: validation when requirements are defined

                // if (!error.found) {
                //    var result = send(constructRequestPayload(subject, description, parsedaysOfWeekIntervalNumber(daysOfWeekInterval), startTime));
                //     if (result.isSuccess) {
                //         swal({
                //             title: "Successfully created pod",
                //             icon: "success",
                //             buttons: {
                //                 create: {
                //                     text: "OK",
                //                     value: true
                //                 }
                //             },
                //         }).then(
                //             (acknowledged) => {
                //                 window.location.href = (acknowledged) ? window.location.href : window.location.href;
                //                 resetValues();
                //             }
                //         )
                //     } else {
                //         swal({
                //             title: "Failed to create pod",
                //             text: result.message,
                //             icon: "error",
                //             buttons: {
                //                 create: {
                //                     text: "OK",
                //                     value: true
                //                 }
                //             },
                //         }).then(
                //             (acknowledged) => {
                //                 resetValues();
                //             }
                //         );
                //     }
                // } else {
                //     swal({
                //         title: "Error found",
                //         text: error.message,
                //         icon: "error",
                //         buttons: {
                //             cancel: "Cancel",
                //             create: {
                //                 text: "Edit",
                //                 value: true
                //             }
                //         },
                //     }).then(
                //         (acknowledged) => {
                //             if (acknowledged) {
                //                 renderSwal();
                //             } else {
                //                 resetValues();
                //             }
                //         }
                //     );
                // }
            }
        }
    )
}

export default renderSwal;