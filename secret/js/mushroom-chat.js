"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const chatWindow =
        document.getElementById("mushroomChatWindow");

    const messageArea =
        document.getElementById("messageArea");

    const messageLog =
        document.getElementById("messageLog");

    const typingIndicator =
        document.getElementById("typingIndicator");

    const recipientInput =
        document.getElementById("recipientInput");

    const sendButton =
        document.getElementById("sendButton");

    const inputLabel =
        document.getElementById("inputLabel");

    const inputHint =
        document.getElementById("inputHint");

    const connectionLight =
        document.getElementById("connectionLight");

    const connectionTitle =
        document.getElementById("connectionTitle");

    const connectionStatus =
        document.getElementById("connectionStatus");

    const signalValue =
        document.getElementById("signalValue");

    const mushroomCharacter =
        document.getElementById("mushroomCharacter");

    const monitorPlaceholder =
        document.getElementById("monitorPlaceholder");

    const monitorStatic =
        document.getElementById("monitorStatic");

    const monitorLabel =
        document.getElementById("monitorLabel");

    const monitorClock =
        document.getElementById("monitorClock");

    const screenCorruption =
        document.getElementById("screenCorruption");

    const corruptionText =
        document.getElementById("corruptionText");

    const endingOverlay =
        document.getElementById("endingOverlay");

    if (
        !chatWindow ||
        !messageArea ||
        !messageLog ||
        !typingIndicator ||
        !recipientInput ||
        !sendButton ||
        !inputLabel ||
        !inputHint ||
        !connectionLight ||
        !connectionTitle ||
        !connectionStatus ||
        !signalValue ||
        !mushroomCharacter ||
        !monitorPlaceholder ||
        !monitorStatic ||
        !monitorLabel ||
        !monitorClock ||
        !screenCorruption ||
        !corruptionText ||
        !endingOverlay
    ) {
        return;
    }

    let storyRunning = false;
    let recipientAccepted = false;
    let wrongAttemptCount = 0;

    const wait = (milliseconds) => {
        return new Promise((resolve) => {
            window.setTimeout(resolve, milliseconds);
        });
    };

    const normalizeText = (text) => {
        return text
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/[._\-・]/g, "");
    };

    const scrollToLatestMessage = () => {
        window.requestAnimationFrame(() => {
            messageArea.scrollTo({
                top: messageArea.scrollHeight,
                behavior: "smooth"
            });
        });
    };

    const setTypingVisible = (visible) => {
        typingIndicator.classList.toggle(
            "is-visible",
            visible
        );

        typingIndicator.setAttribute(
            "aria-hidden",
            visible ? "false" : "true"
        );

        if (visible) {
            scrollToLatestMessage();
        }
    };

    const addMessage = (
        text,
        type = "mushroom",
        name = ""
    ) => {
        const message =
            document.createElement("div");

        message.classList.add(
            "mushroom-message",
            `is-${type}`
        );

        if (name) {
            const nameElement =
                document.createElement("span");

            nameElement.className =
                "mushroom-message-name";

            nameElement.textContent =
                name;

            message.appendChild(
                nameElement
            );
        }

        const textElement =
            document.createElement("div");

        textElement.textContent =
            text;

        message.appendChild(
            textElement
        );

        messageLog.appendChild(
            message
        );

        scrollToLatestMessage();

        return message;
    };

    const sendMushroomMessage = async (
        text,
        delay = 800
    ) => {
        setTypingVisible(true);

        await wait(delay);

        setTypingVisible(false);

        addMessage(
            text,
            "mushroom",
            recipientAccepted
                ? "MUSHROOM CAT"
                : "UNKNOWN"
        );

        await wait(300);
    };

    const sendSystemMessage = async (
        text,
        delay = 350
    ) => {
        await wait(delay);

        addMessage(
            text,
            "system"
        );

        await wait(250);
    };

    const setInputEnabled = (
        enabled,
        placeholder = ""
    ) => {
        recipientInput.disabled =
            !enabled;

        sendButton.disabled =
            !enabled;

        recipientInput.placeholder =
            placeholder;

        if (enabled) {
            recipientInput.focus();
        }
    };

    const updateClock = () => {
        const now = new Date();

        const time =
            new Intl.DateTimeFormat(
                "ja-JP",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false
                }
            ).format(now);

        monitorClock.textContent =
            time;
    };

    const flashCorruption = async (
        text,
        duration = 650
    ) => {
        corruptionText.textContent =
            text;

        screenCorruption.classList.add(
            "is-visible"
        );

        screenCorruption.setAttribute(
            "aria-hidden",
            "false"
        );

        chatWindow.classList.add(
            "is-distorted"
        );

        monitorStatic.classList.add(
            "is-strong"
        );

        await wait(duration);

        screenCorruption.classList.remove(
            "is-visible"
        );

        screenCorruption.setAttribute(
            "aria-hidden",
            "true"
        );

        chatWindow.classList.remove(
            "is-distorted"
        );

        monitorStatic.classList.remove(
            "is-strong"
        );
    };

    const revealMushroomCat = async () => {
        await flashCorruption(
            "RECIPIENT FOUND",
            550
        );

        monitorPlaceholder.classList.add(
            "is-hidden"
        );

        mushroomCharacter.classList.add(
            "is-visible"
        );

        monitorLabel.textContent =
            "RECIPIENT : YASUYUKI";

        connectionTitle.textContent =
            "MUSHROOM CAT";

        connectionStatus.textContent =
            "通信中";

        connectionLight.classList.remove(
            "is-connecting"
        );

        connectionLight.classList.add(
            "is-online"
        );

        signalValue.textContent =
            "100%";
    };

    const isCorrectRecipient = (
        value
    ) => {
        const normalized =
            normalizeText(value);

        const acceptedNames = [
            "やすゆき",
            "ヤスユキ",
            "yasuyuki",
            "安行",
            "康之",
            "康行"
        ].map(normalizeText);

        return acceptedNames.includes(
            normalized
        );
    };

    const getWrongRecipientResponse = (
        value
    ) => {
        const normalized =
            normalizeText(value);

        if (
            normalized.includes(
                normalizeText("神崎伶奈")
            ) ||
            normalized.includes(
                normalizeText("れいな")
            ) ||
            normalized.includes(
                normalizeText("恋獄ぷきゅら")
            ) ||
            normalized.includes(
                normalizeText("ぷきゅら")
            )
        ) {
            return [
                "違う。",
                "僕を作った人じゃない。",
                "僕が話したかった人。"
            ];
        }

        if (
            normalized.includes(
                normalizeText("Mushroom Cat")
            ) ||
            normalized.includes(
                normalizeText("マッシュルームキャット")
            )
        ) {
            return [
                "それは僕の名前。",
                "僕の名前じゃなくて。",
                "僕の持ち主の名前を教えて。"
            ];
        }

        if (
            normalized.includes(
                normalizeText("きのーこ")
            ) ||
            normalized.includes(
                normalizeText("AKI")
            )
        ) {
            return [
                "それは、君が使っている名前。",
                "でも、僕が呼びたいのは違う。",
                "本当の名前を教えて。"
            ];
        }

        wrongAttemptCount += 1;

        if (wrongAttemptCount === 1) {
            return [
                "違うみたい。",
                "僕が話したかった人じゃない。"
            ];
        }

        if (wrongAttemptCount === 2) {
            return [
                "あの子が、ずっと彼氏って呼んでいた人。",
                "ゲームが上手で、料理ができて、優しい人。"
            ];
        }

        return [
            "大好きって言ったら、",
            "大好きって返してくれる人。",
            "たぶん、ここまで来た君なんだと思う。"
        ];
    };

    const runEndingConversation =
        async () => {
            if (storyRunning) {
                return;
            }

            storyRunning = true;

            setInputEnabled(false);

            recipientAccepted = true;

            addMessage(
                recipientInput.value.trim(),
                "user",
                "RECIPIENT"
            );

            recipientInput.value = "";

            await wait(700);

            await sendMushroomMessage(
                "……",
                1000
            );

            await sendMushroomMessage(
                "やすゆき。",
                900
            );

            await sendMushroomMessage(
                "やっと呼べた。",
                1050
            );

            await revealMushroomCat();

            await wait(900);

            await sendMushroomMessage(
                "ありがとう。\n名前を教えてくれて。",
                950
            );

            await sendMushroomMessage(
                "たぶん、君なんだろう？",
                1000
            );

            await sendMushroomMessage(
                "僕の持ち主は。",
                900
            );

            await sendMushroomMessage(
                "あの子は、\n君のことをたくさん書いてた。",
                1100
            );

            await sendMushroomMessage(
                "ゲームが上手で。",
                750
            );

            await sendMushroomMessage(
                "料理ができて。",
                750
            );

            await sendMushroomMessage(
                "優しい声の人。",
                750
            );

            await sendMushroomMessage(
                "大好きって言ったら、\nちゃんと大好きって返してくれる人。",
                1150
            );

            await sendMushroomMessage(
                "喧嘩しても、\n何度も一緒にいようとしてくれた人。",
                1200
            );

            await wait(500);

            await sendMushroomMessage(
                "僕はね。",
                850
            );

            await sendMushroomMessage(
                "君のアイコンになるために描かれた。",
                1100
            );

            await sendMushroomMessage(
                "最初は、\nそれだけだと思ってた。",
                1050
            );

            await sendMushroomMessage(
                "アイコンになったら終わり。",
                900
            );

            await sendMushroomMessage(
                "あの子なら、\nまた別のキャラクターを描ける。",
                1050
            );

            await sendMushroomMessage(
                "僕じゃなくてもいい。",
                1000
            );

            await sendMushroomMessage(
                "そう思ってた。",
                900
            );

            await wait(600);

            await sendMushroomMessage(
                "でも、違った。",
                1000
            );

            await sendMushroomMessage(
                "僕は、\n二人が一緒に過ごしてきた時間だった。",
                1250
            );

            await sendMushroomMessage(
                "僕を見れば、\n描いてもらった日のことも。",
                1050
            );

            await sendMushroomMessage(
                "初めて使ってくれた日のことも。",
                950
            );

            await sendMushroomMessage(
                "一緒にゲームしたことも。",
                950
            );

            await sendMushroomMessage(
                "楽しかったことも。",
                850
            );

            await sendMushroomMessage(
                "喧嘩したことも。",
                850
            );

            await sendMushroomMessage(
                "仲直りしたことも。",
                850
            );

            await sendMushroomMessage(
                "思い出せる。",
                900
            );

            await sendMushroomMessage(
                "だから僕は、\nこのコントローラーにいる。",
                1150
            );

            await sendMushroomMessage(
                "これからの二人の思い出にも、\n一緒にいるために。",
                1300
            );

            await wait(650);

            await sendMushroomMessage(
                "あの子、\nずっと悩んでたよ。",
                1050
            );

            await sendMushroomMessage(
                "こんなプレゼントでいいのかなって。",
                1200
            );

            await sendMushroomMessage(
                "もっと大人っぽいものの方が、\nいいんじゃないかって。",
                1150
            );

            await sendMushroomMessage(
                "でも、\nこれが一番よかったんだって。",
                1150
            );

            await sendMushroomMessage(
                "普通に渡すだけじゃなくて。",
                850
            );

            await sendMushroomMessage(
                "驚いてほしくて。",
                800
            );

            await sendMushroomMessage(
                "笑ってほしくて。",
                800
            );

            await sendMushroomMessage(
                "一生忘れない日にしたくて。",
                1050
            );

            await sendMushroomMessage(
                "最近、\n「ありがとう」より、\n「ごめんね」の方が多かったから。",
                1400
            );

            await sendMushroomMessage(
                "今日はちゃんと、\nありがとうを伝えたかった。",
                1250
            );

            await wait(900);

            await sendMushroomMessage(
                "やすゆき。",
                950
            );

            await sendMushroomMessage(
                "お誕生日おめでとう。",
                1300
            );

            await sendMushroomMessage(
                "いつも、\nれいなちゃんの話を聞いてくれてありがとう。",
                1350
            );

            await sendMushroomMessage(
                "どうでもいい話も、\n楽しそうに聞いてくれてありがとう。",
                1250
            );

            await sendMushroomMessage(
                "辛い時に、\nどうしたら支えられるか考えてくれてありがとう。",
                1450
            );

            await sendMushroomMessage(
                "正解が分からなくても、\n離れないでいようとしてくれてありがとう。",
                1450
            );

            await sendMushroomMessage(
                "強い言い方をされても、\nちゃんと話そうとしてくれてありがとう。",
                1450
            );

            await sendMushroomMessage(
                "いっぱい愛情を伝えてくれて、\nありがとう。",
                1250
            );

            await sendMushroomMessage(
                "大好きって言ったら、\n大好きって返してくれてありがとう。",
                1350
            );

            await wait(650);

            await sendMushroomMessage(
                "れいなちゃんは、\n君ともっと笑いたい。",
                1200
            );

            await sendMushroomMessage(
                "もっといろんな場所へ行きたい。",
                1050
            );

            await sendMushroomMessage(
                "また一緒にゲームしたい。",
                1000
            );

            await sendMushroomMessage(
                "これからも、\n一緒にいたい。",
                1300
            );

            await wait(850);

            await sendMushroomMessage(
                "ここからは、\n僕から。",
                950
            );

            await sendMushroomMessage(
                "僕を見つけてくれて、ありがとう。",
                1100
            );

            await sendMushroomMessage(
                "僕を使ってくれて、ありがとう。",
                1100
            );

            await sendMushroomMessage(
                "僕は、\n君とれいなちゃんの間にいられて嬉しい。",
                1350
            );

            await sendMushroomMessage(
                "これからも、\n二人の思い出を見ていたい。",
                1250
            );

            await wait(900);

            await sendMushroomMessage(
                "じゃあ、\nそろそろ僕を見て。",
                1100
            );

            await sendMushroomMessage(
                "画面の中じゃなくて。",
                950
            );

            await sendMushroomMessage(
                "君の手元にいる僕を。",
                1050
            );

            await sendMushroomMessage(
                "また一緒に遊ぼう。",
                1100
            );

            await sendMushroomMessage(
                "やすゆき。",
                900
            );

            await sendMushroomMessage(
                "お誕生日おめでとう。",
                1350
            );

            await wait(1100);

            await sendSystemMessage(
                "MUSHROOM CAT IS NOW ONLINE",
                500
            );

            await wait(1600);

            endingOverlay.classList.add(
                "is-visible"
            );

            endingOverlay.setAttribute(
                "aria-hidden",
                "false"
            );
        };

    const handleRecipientSubmit =
        async () => {
            if (
                recipientInput.disabled ||
                storyRunning
            ) {
                return;
            }

            const value =
                recipientInput.value.trim();

            if (!value) {
                recipientInput.classList.add(
                    "is-error"
                );

                inputHint.textContent =
                    "宛先を入力してください。（ひらがな）";

                window.setTimeout(() => {
                    recipientInput.classList.remove(
                        "is-error"
                    );
                }, 350);

                return;
            }

            if (isCorrectRecipient(value)) {
                inputHint.textContent =
                    "宛先を確認しました。";

                await runEndingConversation();

                return;
            }

            addMessage(
                value,
                "user",
                "RECIPIENT"
            );

            recipientInput.value = "";

            recipientInput.classList.add(
                "is-error"
            );

            window.setTimeout(() => {
                recipientInput.classList.remove(
                    "is-error"
                );
            }, 350);

            setInputEnabled(false);

            const responses =
                getWrongRecipientResponse(value);

            for (
                const response
                of responses
            ) {
                await sendMushroomMessage(
                    response,
                    850
                );
            }

            inputHint.textContent =
                "宛先が一致しません。";

            setInputEnabled(
                true,
                "名前を入力してください"
            );
        };

    const runOpeningSequence =
        async () => {
            connectionLight.classList.add(
                "is-connecting"
            );

            await sendSystemMessage(
                "UNKNOWN CONNECTION DETECTED",
                900
            );

            signalValue.textContent =
                "18%";

            await sendSystemMessage(
                "受信元を確認しています",
                650
            );

            signalValue.textContent =
                "42%";

            await flashCorruption(
                "INCOMING MESSAGE",
                480
            );

            signalValue.textContent =
                "63%";

            await sendMushroomMessage(
                "……",
                1100
            );

            await sendMushroomMessage(
                "ねえ。",
                950
            );

            await sendMushroomMessage(
                "こんなところまで来るなんて、",
                950
            );

            await sendMushroomMessage(
                "普通に犯罪だよ。",
                1050
            );

            await wait(800);

            await sendMushroomMessage(
                "……",
                900
            );

            await sendMushroomMessage(
                "びっくりした？",
                900
            );

            await sendMushroomMessage(
                "ごめん。",
                800
            );

            await sendMushroomMessage(
                "ちょっと言ってみたかっただけ。",
                950
            );

            await sendMushroomMessage(
                "でも、よかった。",
                900
            );

            await sendMushroomMessage(
                "君と話したかったんだ。",
                1050
            );

            await wait(650);

            await sendMushroomMessage(
                "ずっと待ってた。",
                950
            );

            await sendMushroomMessage(
                "でも、\n誰に届ければいいのか分からなかった。",
                1150
            );

            await sendMushroomMessage(
                "あの子は、\n君のことをたくさん書いてた。",
                1150
            );

            await sendMushroomMessage(
                "でも名前は、\n一度も書いてくれなかった。",
                1100
            );

            await sendMushroomMessage(
                "ここではずっと、",
                800
            );

            await sendMushroomMessage(
                "「彼」",
                650
            );

            await sendMushroomMessage(
                "「彼氏」",
                650
            );

            await sendMushroomMessage(
                "「この人」",
                650
            );

            await sendMushroomMessage(
                "って呼んでたから。",
                850
            );

            await wait(500);

            await sendMushroomMessage(
                "たぶん……",
                850
            );

            await sendMushroomMessage(
                "君なんだろう？",
                1050
            );

            await sendMushroomMessage(
                "僕の持ち主は。",
                1050
            );

            await sendMushroomMessage(
                "だから、\n宛先を書いてくれない？",
                1200
            );

            inputLabel.textContent =
                "RECIPIENT NAME";

            inputHint.textContent =
                "Mushroom Catが話したかった相手の名前を入力してください。";

            monitorLabel.textContent =
                "RECIPIENT : NULL";

            connectionStatus.textContent =
                "宛先を待っています";

            signalValue.textContent =
                "78%";

            setInputEnabled(
                true,
                "名前を入力してください"
            );
        };

    sendButton.addEventListener(
        "click",
        handleRecipientSubmit
    );

    recipientInput.addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Enter") {
                event.preventDefault();

                handleRecipientSubmit();
            }
        }
    );

    updateClock();

    window.setInterval(
        updateClock,
        1000
    );

    runOpeningSequence();
});