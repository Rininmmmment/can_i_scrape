// robots.txtから判定
async function checkRobotsTxt() {
	try {
		const robotsTxtUrl = `${window.location.origin}/robots.txt`;
		const response = await fetch(robotsTxtUrl);
		const robotsTxt = await response.text();
  
		if (robotsTxt.includes("Disallow: /")) {
			return { scrapingAllowed: false, reason: "Disallowed by robots.txt" };
		} else {
			return { scrapingAllowed: true, reason: "Allowed by robots.txt" };
		}
	} catch (error) {
	  	return { scrapingAllowed: false, reason: "robots.txt not found" };
	}
}
  
// Metaタグから判定
function checkMetaTags() {
	const metaTags = document.querySelectorAll('meta[name="robots"]');
	for (let tag of metaTags) {
		if (tag.content.includes("noindex") || tag.content.includes("nofollow")) {
			return { scrapingAllowed: false, reason: "Disallowed by meta tag" };
		}
	}
	return { scrapingAllowed: true, reason: "Allowed by meta tags" };
}
  
// スクレイピングチェック
async function checkScrapingPermission() {
	const robotsResult = await checkRobotsTxt();
	if (!robotsResult.scrapingAllowed) {
		return robotsResult;
	}

	const metaResult = checkMetaTags();
	if (!metaResult.scrapingAllowed) {
		return metaResult;
	}

	return { scrapingAllowed: true, reason: "Allowed by both robots.txt and meta tags" };
}

// ページを開いたときにチェックし、background.js に結果を送信
checkScrapingPermission().then(result => {
	chrome.runtime.sendMessage({ action: "scrapingCheckResult", result: result });  // sendMessage()でbackgroundに送信
});
  