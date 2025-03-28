chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!changeInfo.url) return;

    let url = new URL(changeInfo.url);
    if (!url.hostname.includes("google.com") || !url.searchParams.has("q")) return; // Ensure it's a search

    chrome.storage.sync.get("enabled", (data) => {
        if (!data.enabled) return;

        let params = new URLSearchParams(url.search);
        let query = params.get("q");

        if (query && !query.includes("-ai")) {
            params.set("q", query + " -ai");
            url.search = params.toString();
            chrome.tabs.update(tabId, { url: url.toString() });
        }
    });
});

chrome.commands.onCommand.addListener((command) => {
    if (command === "toggle-ai-filter") {
        chrome.storage.sync.get("enabled", (data) => {
            let newState = !data.enabled;
            chrome.storage.sync.set({ enabled: newState });

            chrome.notifications.create({
                type: "basic",
                iconUrl: "icon.png",
                title: "AI Filter",
                message: `AI Filter is now ${newState ? "ON" : "OFF"}`,
            });
        });
    }
});
