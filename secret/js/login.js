"use strict";

const loginForm = document.getElementById("employee-login-form");
const employeeIdInput = document.getElementById("employee-id");
const employeePasswordInput = document.getElementById("employee-password");
const loginMessage = document.getElementById("login-message");
const loginSubmitButton = document.getElementById("login-submit-button");
const passwordToggle = document.getElementById("password-toggle");

/*
 * 正解情報はそのまま文字列で保存せず、
 * SHA-256ハッシュで照合します。
 *
 * 社員ID：PG-1028
 * パスワード：enya0417
 */
const VALID_EMPLOYEE_ID_HASH =
    "a5bf03c4e64a7914eeaf7fd95a9c7515ef78a33031d026da568fb06544567dca";

const VALID_PASSWORD_HASH =
    "f2fc467914a181ce792ccbe82f6b189e1eeb1f3969e2be32b2ccf871980d47bf";

const LOGIN_DESTINATION = "employee/dashboard.html";

function normalizeEmployeeId(value) {
    return value
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "");
}

function normalizePassword(value) {
    return value.trim();
}

async function createSha256Hash(value) {
    const encodedValue = new TextEncoder().encode(value);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedValue);

    return Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

function setLoginMessage(type, message) {
    loginMessage.className = "portal-login-message";

    if (!message) {
        loginMessage.textContent = "";
        return;
    }

    loginMessage.classList.add(`is-${type}`);
    loginMessage.textContent = message;
}

function setLoadingState(isLoading) {
    loginSubmitButton.disabled = isLoading;
    loginForm.setAttribute("aria-busy", String(isLoading));

    loginSubmitButton.classList.toggle("is-loading", isLoading);

    employeeIdInput.disabled = isLoading;
    employeePasswordInput.disabled = isLoading;
    passwordToggle.disabled = isLoading;
}

function validateInputs(employeeId, password) {
    if (!employeeId && !password) {
        return "社員IDとパスワードを入力してください。";
    }

    if (!employeeId) {
        return "社員IDを入力してください。";
    }

    if (!password) {
        return "パスワードを入力してください。";
    }

    if (!/^PG-\d{4}$/.test(employeeId)) {
        return "社員IDは「PG-0000」の形式で入力してください。";
    }

    return "";
}

passwordToggle.addEventListener("click", () => {
    const isPasswordVisible =
        employeePasswordInput.type === "text";

    employeePasswordInput.type =
        isPasswordVisible ? "password" : "text";

    passwordToggle.textContent =
        isPasswordVisible ? "表示" : "非表示";

    passwordToggle.setAttribute(
        "aria-label",
        isPasswordVisible
            ? "パスワードを表示する"
            : "パスワードを非表示にする"
    );

    passwordToggle.setAttribute(
        "aria-pressed",
        String(!isPasswordVisible)
    );
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    setLoginMessage("", "");

    const employeeId =
        normalizeEmployeeId(employeeIdInput.value);

    const password =
        normalizePassword(employeePasswordInput.value);

    const validationMessage =
        validateInputs(employeeId, password);

    if (validationMessage) {
        setLoginMessage("error", validationMessage);
        return;
    }

    setLoadingState(true);

    try {
        await new Promise((resolve) => {
            window.setTimeout(resolve, 900);
        });

        const employeeIdHash =
            await createSha256Hash(employeeId);

        const passwordHash =
            await createSha256Hash(password);

        const isValidEmployeeId =
            employeeIdHash === VALID_EMPLOYEE_ID_HASH;

        const isValidPassword =
            passwordHash === VALID_PASSWORD_HASH;

        if (!isValidEmployeeId || !isValidPassword) {
            setLoginMessage(
                "error",
                "社員IDまたはパスワードが正しくありません。"
            );

            employeePasswordInput.value = "";
            employeePasswordInput.focus();

            return;
        }

        setLoginMessage(
            "success",
            "認証が完了しました。ダッシュボードを読み込んでいます。"
        );

        sessionStorage.setItem(
            "pukyverseEmployeeAuthenticated",
            "true"
        );

        sessionStorage.setItem(
            "pukyverseEmployeeId",
            employeeId
        );

        window.setTimeout(() => {
            window.location.href = LOGIN_DESTINATION;
        }, 1100);

    } catch (error) {
        console.error("Login authentication failed:", error);

        setLoginMessage(
            "error",
            "認証処理中にエラーが発生しました。もう一度お試しください。"
        );

    } finally {
        setLoadingState(false);
    }
});