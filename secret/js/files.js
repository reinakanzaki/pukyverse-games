"use strict";

const AUTHENTICATION_KEY = "pukyverseEmployeeAuthenticated";
const EMPLOYEE_ID_KEY = "pukyverseEmployeeId";

const REQUIRED_EMPLOYEE_ID = "PG-1028";
const LOGIN_PAGE = "../login.html";

const logoutButton = document.getElementById("logout-button");
const folderButtons = document.querySelectorAll(".file-browser-folder");
const currentFolderName = document.getElementById("current-folder-name");
const currentFolderCount = document.getElementById("current-folder-count");
const fileBrowserBody = document.getElementById("file-browser-body");

const originalFileRows = fileBrowserBody.innerHTML;

const folderMessages = {
    work: {
        name: "作業フォルダ",
        count: "7個の項目"
    },

    distribution: {
        name: "外部配布用",
        count: "2個の項目"
    },

    shared: {
        name: "制作管理部共有",
        count: "3個の項目"
    },

    recent: {
        name: "最近使用した項目",
        count: "5個の項目"
    }
};

function verifyAuthentication() {
    const isAuthenticated =
        sessionStorage.getItem(AUTHENTICATION_KEY) === "true";

    const employeeId =
        sessionStorage.getItem(EMPLOYEE_ID_KEY);

    if (!isAuthenticated || employeeId !== REQUIRED_EMPLOYEE_ID) {
        window.location.replace(LOGIN_PAGE);
    }
}

function createEmptyFolderRow(message) {
    return `
        <tr>
            <td colspan="4" class="file-browser-empty">
                ${message}
            </td>
        </tr>
    `;
}

function selectFolder(folderName) {
    folderButtons.forEach((button) => {
        button.classList.toggle(
            "is-active",
            button.dataset.folder === folderName
        );
    });

    const selectedFolder = folderMessages[folderName];

    currentFolderName.textContent = selectedFolder.name;
    currentFolderCount.textContent = selectedFolder.count;

    if (folderName === "work") {
        fileBrowserBody.innerHTML = originalFileRows;
        return;
    }

    if (folderName === "distribution") {
        fileBrowserBody.innerHTML = createEmptyFolderRow(
            "外部配布用フォルダの内容は、現在確認中です。"
        );
        return;
    }

    if (folderName === "shared") {
        fileBrowserBody.innerHTML = createEmptyFolderRow(
            "共有フォルダ内のファイルは、後から追加できます。"
        );
        return;
    }

    fileBrowserBody.innerHTML = createEmptyFolderRow(
        "最近使用した項目はありません。"
    );
}

folderButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectFolder(button.dataset.folder);
    });
});

logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem(AUTHENTICATION_KEY);
    sessionStorage.removeItem(EMPLOYEE_ID_KEY);

    window.location.href = LOGIN_PAGE;
});

verifyAuthentication();