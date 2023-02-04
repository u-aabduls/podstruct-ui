function disabledText() {
    return { color: '#A9A9A9' };
}

function dangerText() {
    return { color: '#F05050' };
}

function swalConfirm() {
    return '#5D9CEC';
}

function swalConfirmDanger() {
    return '#EC2121';
}

function changedMessageStyling() {
    return {
        color: '#f0ad4e',
        width: '100%',
        marginTop: '0.5rem',
        fontSize: '80%'
    }
}

function errorMessageStyling() {
    return {
        color: '#f05050',
        width: '100%',
        marginTop: '0.25rem',
        fontSize: '80%'
    }
}

function disabledInputStyling() {
    return {
        color: '#B7BAC9',
        backgroundColor: '#EDF1F2'
    }
}

function buttonLightGreyBorder() {
    return {
        borderColor: '#eaeaea'
    }
}

export {
    disabledText,
    dangerText,
    swalConfirm,
    swalConfirmDanger,
    changedMessageStyling,
    errorMessageStyling,
    disabledInputStyling,
    buttonLightGreyBorder
}