function handleError(errorValue, data) {
    const location = window.location.pathname
    if (errorValue === 401 && location !== '/login') {
        window.location.href = "/login";
        return "";
    }
    else {
        return (data && data.message) ? data.message : 
                    (data && data.errors && data.errors[0].message) ? data.errors[0].message : 
                        "An unexpected error occurred.";
    }
}

export default handleError