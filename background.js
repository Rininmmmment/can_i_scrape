// content.jsから結果を受け取る
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {  // sendMessageの連想配列を受け取っている
    if (request.action === "scrapingCheckResult") {
        const result = request.result;

        let message = "";
        if (result.scrapingAllowed) {
            message = `Scraping Allowed: ${result.reason}`;
            chrome.action.setBadgeText({ text: "OK", tabId: sender.tab.id });
            chrome.action.setBadgeBackgroundColor({ color: "green", tabId: sender.tab.id });
        } else {
            message = `Scraping Not Allowed: ${result.reason}`;
            chrome.action.setBadgeText({ text: "NO", tabId: sender.tab.id });
            chrome.action.setBadgeBackgroundColor({ color: "red", tabId: sender.tab.id });
        }

        // 通知を出す（うざいので却下）
        // chrome.notifications.create({
        // type: "basic",
        // iconUrl: "icon.png",
        // title: "Scraping Permission",
        // message: message
        // });
    }
});
  