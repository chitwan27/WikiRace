// ==============================
// ✅ Global Wikipedia API Config
// ==============================
const wikiApiConfig = {
    baseUrl: "https://en.wikipedia.org/w/api.php",
    defaultParams: {
        format: "json",
        origin: "*", // Enables CORS for browser requests
    },
    defaultHeaders: {
        "Content-Type": "application/json",
    },
};

// ==============================
// ⚙️ Utility: Build Wikipedia API URL
// ==============================
function buildQuery(params = {}) {
    const allParams = { ...wikiApiConfig.defaultParams, ...params };
    const query = new URLSearchParams();

    for (const key in allParams) {
        query.append(key, allParams[key]);
    }

    return `${wikiApiConfig.baseUrl}?${query.toString()}`;
}

// ====================================================
// 🔍 Main Function: Search OR get random articles w/ extracts
// ====================================================
async function getArticles(query = "", options = {}) {
    const {
        limit = 10,
        queryPool = ['the', 'of', 'for', 'a', 'this', 'some', 'on'],
        headers = wikiApiConfig.defaultHeaders,
    } = options;

    const isRandom = !query || query.trim() === "";
    const effectiveQuery = isRandom
        ? queryPool[Math.floor(Math.random() * queryPool.length)]
        : query;

    try {
        // Step 1: Search Wikipedia articles
        const searchUrl = buildQuery({
            action: "query",
            list: "search",
            srsearch: effectiveQuery,
            srlimit: limit,
            ...(isRandom ? { srsort: "random" } : {}),
        });

        const searchRes = await fetch(searchUrl, { headers });
        const searchData = await searchRes.json();
        const results = searchData.query?.search;

        if (!results || results.length === 0)
            throw new Error("No search results found.");

        // Step 2: Fetch extracts for the article titles
        const titles = results.map(r => r.title).join("|");

        const extractUrl = buildQuery({
            action: "query",
            prop: "extracts",
            exintro: true,
            explaintext: true,
            titles,
        });

        const extractRes = await fetch(extractUrl, { headers });
        const extractData = await extractRes.json();
        const extractPages = extractData.query?.pages || {};

        // Step 3: Map title → extract
        const extractMap = Object.values(extractPages).reduce((acc, page) => {
            acc[page.title] = page.extract;
            return acc;
        }, {});

        // Step 4: Attach extract to each result
        return results.map(result => ({
            ...result,
            extract: extractMap[result.title] || null,
        }));
    } catch (err) {
        console.error("Error in getArticles:", err.message);
        return [];
    }
}

// ==============================
// 🧪 Optional: Local Test Runner
// ==============================
// (Uncomment for testing in your app/dev environment)

// (async () => {
//     const results = await getArticles("");
//     console.log(results);
// })();

// ==============================
// 📦 Export Functions & Config
// ==============================
export {
    getArticles,
};
