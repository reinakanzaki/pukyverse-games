"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const completeButton = document.getElementById(
        "investigationCompleteButton"
    );

    const glitchScreen = document.getElementById(
        "endingGlitch"
    );

    const glitchCode = document.getElementById(
        "endingGlitchCode"
    );

    const glitchMessage = document.getElementById(
        "endingGlitchMessage"
    );

    const glitchProgress = document.getElementById(
        "endingGlitchProgress"
    );

    if (
        !completeButton ||
        !glitchScreen ||
        !glitchCode ||
        !glitchMessage ||
        !glitchProgress
    ) {
        return;
    }

    const chatRoomPath =
        "../chat/mushroom-room.html";

    let transitionStarted = false;

    const wait = (milliseconds) => {
        return new Promise((resolve) => {
            window.setTimeout(resolve, milliseconds);
        });
    };

    const setGlitchText = (code, message) => {
        glitchCode.textContent = code;
        glitchMessage.textContent = message;
    };

    const setProgress = (percentage) => {
        glitchProgress.style.width =
            `${percentage}%`;
    };

    const runTransition = async () => {
        if (transitionStarted) {
            return;
        }

        transitionStarted = true;

        completeButton.disabled = true;
        completeButton.classList.add(
            "is-corrupted"
        );

        await wait(420);

        document.body.style.overflow = "hidden";

        glitchScreen.classList.add(
            "is-active"
        );

        glitchScreen.setAttribute(
            "aria-hidden",
            "false"
        );

        setProgress(8);

        await wait(360);

        setGlitchText(
            "CASE CLOSED",
            "調査記録を終了しています"
        );

        setProgress(27);

        await wait(520);

        setGlitchText(
            "ERR_0x08F1",
            "終了処理に失敗しました"
        );

        setProgress(41);

        await wait(470);

        setGlitchText(
            "UNKNOWN PROCESS",
            "未確認の接続を検出"
        );

        setProgress(58);

        await wait(560);

        setGlitchText(
            "RECIPIENT : NULL",
            "宛先が見つかりません"
        );

        setProgress(73);

        await wait(620);

        setGlitchText(
            "INCOMING MESSAGE",
            "……ねえ"
        );

        setProgress(86);

        await wait(760);

        setGlitchText(
            "MUSHROOM CAT",
            "やっと、ここまで来た"
        );

        setProgress(100);

        await wait(720);

        glitchScreen.classList.add(
            "is-flashing"
        );

        await wait(300);

        window.location.href =
            chatRoomPath;
    };

    completeButton.addEventListener(
        "click",
        runTransition
    );
});