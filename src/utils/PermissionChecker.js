function isAdmin(role) {
    return role === "ADMIN"
}

function isTeacher(role) {
    return role === "TEACHER"
}

function isStudent(role) {
    return role === "STUDENT"
}

export {isAdmin, isTeacher, isStudent}