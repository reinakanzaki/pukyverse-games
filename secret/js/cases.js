"use strict";

const AUTHENTICATION_KEY = "pukyverseEmployeeAuthenticated";
const EMPLOYEE_ID_KEY = "pukyverseEmployeeId";

const REQUIRED_EMPLOYEE_ID = "PG-1028";
const LOGIN_PAGE = "../login.html";

const logoutButton = document.getElementById("logout-button");

function verifyAuthentication() {
    const isAuthenticated =
        sessionStorage.getItem(AUTHENTICATION_KEY) === "true";

    const employeeId =
        sessionStorage.getItem(EMPLOYEE_ID_KEY);

    if (!isAuthenticated || employeeId !== REQUIRED_EMPLOYEE_ID) {
        window.location.replace(LOGIN_PAGE);
    }
}

logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem(AUTHENTICATION_KEY);
    sessionStorage.removeItem(EMPLOYEE_ID_KEY);

    window.location.href = LOGIN_PAGE;
});

verifyAuthentication();