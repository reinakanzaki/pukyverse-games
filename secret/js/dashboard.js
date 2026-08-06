"use strict";

const AUTHENTICATION_KEY = "pukyverseEmployeeAuthenticated";
const EMPLOYEE_ID_KEY = "pukyverseEmployeeId";

const REQUIRED_EMPLOYEE_ID = "PG-1028";
const LOGIN_PAGE = "../login.html";

const searchForm = document.getElementById("case-search-form");
const searchInput = document.getElementById("case-search-input");
const searchButton = document.getElementById("case-search-button");

const searchProgress = document.getElementById(
    "hidden-search-progress"
);

const searchProgressValue = document.getElementById(
    "hidden-search-progress-value"
);

const searchProgressFill = document.getElementById(
    "hidden-search-progress-fill"
);

const searchLog = document.getElementById(
    "hidden-search-log"
);

const searchMessage = document.getElementById(
    "search-message"
);

const searchResults = document.getElementById(
    "search-results"
);

const logoutButton = document.getElementById("logout-button");

/*
 * 検索データは、記事の流れに合わせて後から追加できます。
 */
const hiddenRecords = [
    {
        keywords: [
            "神崎伶奈",
            "神崎 伶奈",
            "かんざきれいな"
        ],

        category: "ARCHIVED COMMUNICATION",
        title: "【制作依頼受付】オリジナルコントローラー制作について",
        documentId: "REQ-260710-017",
        date: "2026.07.10",
        url: "records/custom-order-request.html"
    },

    {
        keywords: [
            "MushroomCat",
            "Mushroom Cat",
            "mushroomcat",
            "mushroom cat",
            "マッシュルームキャット"
        ],

        category: "PERSONAL PRODUCTION LOG",
        title: "【制作記録】Mushroom Cat",
        documentId: "WORKLOG-PC2607-017-01",
        date: "2026.08.05",
        url: "records/mushroomcat-production-log.html"
    },

    {
        keywords: [
            "MC-0807",
            "mc-0807",
            "MC0807",
            "mc0807"
        ],

        category: "PERSONAL INCIDENT NOTE",
        title: "【作業記録】MC-0807 / 画像データ異常",
        documentId: "MC-0807-LOG-02",
        date: "2026.08.06",
        url: "records/mc-0807-incident-log.html"
    },

    {
        keywords: [
            "画像復元方法",
            "画像 復元 方法",
            "画像復元",
            "画像 復元"
        ],

        category: "PERSONAL RESEARCH LOG",
        title: "【調査記録】画像復元方法",
        documentId: "MC-0807-SEARCH-01",
        date: "2026.08.07",
        url: "records/image-recovery-research.html"
    },

    {
        keywords: [
            "画像検索",
            "がぞうけんさく",
            "類似画像検索"
        ],

        title:
            "画像検索",
        category:
            "個人調査記録",
        documentId:
            "PORTAL-020",
        recordId:
            "MC-0807-SEARCH-02",
        description:
            "消失前のスクリーンショットを使った類似画像検索の記録。",
        url:
            "records/image-search.html"
    },

    {
        keywords: [
            "恋獄ぷきゅら",
            "れんごくぷきゅら",
            "rengoku pukyura",
            "rengoku_pukyura"
        ],

        title:
            "恋獄ぷきゅら アカウント調査",

        category:
            "個人調査記録",

        documentId:
            "PORTAL-021",

        recordId:
            "MC-0807-SEARCH-03",

        description:
            "画像の作者と思われる恋獄ぷきゅらのアカウントを調べた記録。",

        url:
            "records/rengoku-pukyura-account.html"
    },

    {
        keywords: [
            "pukyura_abyss",
            "@pukyura_abyss",
            "pukyura abyss"
        ],

        title:
            "pukyura_abyss 調査メモ",

        category:
            "個人調査記録",

        documentId:
            "PORTAL-022",

        recordId:
            "MC-0807-SEARCH-04",

        description:
            "恋獄ぷきゅらの投稿画像に映り込んでいた別アカウントの調査記録。",

        url:
            "records/pukyura-abyss-search.html"
    },

    {
        keywords: [
            "ありがとう",
            "感謝",
            "thank you"
        ],

        title:
            "ありがとう",

        category:
            "個人調査記録",

        documentId:
            "PORTAL-023",

        recordId:
            "MC-0807-SEARCH-05",

        description:
            "pukyura_abyssの投稿を確認した後に保存された個人メモ。",

        url:
            "records/record_x7.html"
    },

    {
        keywords: [
            "必要な存在",
            "必要な存在だった",
            "君は必要な存在",
            "必要"
        ],

        title:
            "必要な存在",

        category:
            "個人調査記録",

        documentId:
            "PORTAL-024",

        recordId:
            "MC-0807-INCIDENT-06",

        description:
            "消失したMushroom Catへ呼びかけを行った際に記録された個人メモ。",

        url:
            "records/cache_442.html"
    },

    {
        keywords: [
            "思い出",
            "二人の思い出",
            "忘れられない思い出",
            "思い出になった"
        ],

        title:
            "思い出",

        category:
            "個人作業記録",

        documentId:
            "PORTAL-025",

        recordId:
            "MC-0807-CLOSE-07",

        description:
            "初回担当案件の完了後に保存された、社内連絡と依頼者からのメッセージ。",

        url:
            "records/log_7c19.html"
    },

];

function verifyAuthentication() {
    const isAuthenticated =
        sessionStorage.getItem(AUTHENTICATION_KEY) === "true";

    const employeeId =
        sessionStorage.getItem(EMPLOYEE_ID_KEY);

    if (!isAuthenticated || employeeId !== REQUIRED_EMPLOYEE_ID) {
        window.location.replace(LOGIN_PAGE);
    }
}

function normalizeQuery(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");
}

function resetSearchDisplay() {
    searchMessage.textContent = "";
    searchMessage.className = "hidden-search-message";

    searchResults.replaceChildren();

    searchProgress.classList.remove("is-active");
    searchProgressValue.textContent = "0%";
    searchProgressFill.style.width = "0%";
    searchLog.textContent = "Waiting for query...";
}

function findRecord(query) {
    const normalizedQuery = normalizeQuery(query);

    return hiddenRecords.find((record) => {
        return record.keywords.some((keyword) => {
            return normalizeQuery(keyword) === normalizedQuery;
        });
    });
}

function wait(milliseconds) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, milliseconds);
    });
}

async function runSearchAnimation() {
    const stages = [
        {
            progress: 18,
            text: "Checking employee permissions..."
        },
        {
            progress: 41,
            text: "Scanning assigned records..."
        },
        {
            progress: 68,
            text: "Searching archived communications..."
        },
        {
            progress: 89,
            text: "Verifying document access..."
        },
        {
            progress: 100,
            text: "Search completed."
        }
    ];

    searchProgress.classList.add("is-active");

    for (const stage of stages) {
        searchProgressValue.textContent =
            `${stage.progress}%`;

        searchProgressFill.style.width =
            `${stage.progress}%`;

        searchLog.textContent = stage.text;

        await wait(260);
    }
}

function showEmptyResult(query) {
    searchMessage.className =
        "hidden-search-message is-empty";

    searchMessage.innerHTML = `
        <span>NO RECORDS FOUND</span>
        <strong>「${escapeHtml(query)}」に一致する記録はありません。</strong>
    `;
}

function showSearchResult(record) {
    searchMessage.className =
        "hidden-search-message is-success";

    searchMessage.innerHTML = `
        <span>RECORD DETECTED</span>
        <strong>1件の関連記録が見つかりました。</strong>
    `;

    const resultLink = document.createElement("a");
    resultLink.href = record.url;
    resultLink.className = "hidden-search-result-card";

    const resultContent = document.createElement("div");

    const category = document.createElement("p");
    category.className = "hidden-search-result-category";
    category.textContent = record.category;

    const title = document.createElement("h3");
    title.textContent = record.title;

    const meta = document.createElement("div");
    meta.className = "hidden-search-result-meta";

    const documentId = document.createElement("span");
    documentId.textContent = `Record ID : ${record.documentId}`;

    const date = document.createElement("span");
    date.textContent = `Recorded : ${record.date}`;

    meta.append(documentId, date);
    resultContent.append(category, title, meta);

    const arrow = document.createElement("span");
    arrow.className = "hidden-search-result-arrow";
    arrow.textContent = "記録を開く →";

    resultLink.append(resultContent, arrow);
    searchResults.append(resultLink);
}

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();

    resetSearchDisplay();

    if (!query) {
        searchMessage.className =
            "hidden-search-message is-error";

        searchMessage.textContent =
            "検索キーワードを入力してください。";

        return;
    }

    searchButton.disabled = true;
    searchInput.disabled = true;

    await runSearchAnimation();

    const record = findRecord(query);

    if (record) {
        showSearchResult(record);
    } else {
        showEmptyResult(query);
    }

    searchButton.disabled = false;
    searchInput.disabled = false;
    searchInput.focus();
});

logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem(AUTHENTICATION_KEY);
    sessionStorage.removeItem(EMPLOYEE_ID_KEY);

    window.location.href = LOGIN_PAGE;
});

verifyAuthentication();