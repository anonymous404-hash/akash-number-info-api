// File: pages/api/number.js

export default async function handler(req, res) {
    const number = req.query.num;
    const userKey = req.query.key;

    // API Keys Database (as given)
    const KEYS_DB = {
        "user1": { key: "AKASH_PAID31DAYS", expiry: "2026-03-03" },
        "user2": { key: "AKASH_PAID30DAYS", expiry: "2026-03-14" },
        "trial": { key: "AKASH_PAID3MONTH", expiry: "2026-04-29" },
    };

    // ----- API Key Validation -----
    if (!userKey) {
        return res.status(401).json({ error: "API Key missing! Use ?key=YOUR_KEY" });
    }

    const foundUser = Object.values(KEYS_DB).find(u => u.key === userKey);
    if (!foundUser) {
        return res.status(401).json({ error: "Invalid API Key! Access Denied." });
    }

    const today = new Date();
    const expiryDate = new Date(foundUser.expiry);
    if (today > expiryDate) {
        return res.status(403).json({ 
            error: "Key Expired!", 
            expiry_date: foundUser.expiry,
            status: "Expired",
            message: `Aapki key ${foundUser.expiry} ko khatam ho chuki hai.` 
        });
    }

    if (!number) {
        return res.status(400).json({ error: "Please provide a number (?num=8207...)" });
    }

    // Days remaining calculation
    const timeDiff = expiryDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // ----- ScrapingBee Proxy URL -----
    const apiKey = process.env.SCRAPINGBEE_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "ScrapingBee API key not configured" });
    }

    const targetUrl = `https://zionix.xo.je/znnum?number=${number}`;
    // ScrapingBee endpoint with render_js=true to execute Cloudflare challenge
    const proxyUrl = `https://app.scrapingbee.com/api/v1/?api_key=${apiKey}&url=${encodeURIComponent(targetUrl)}&render_js=true&premium_proxy=true`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 sec timeout (Cloudflare + JS execution takes time)

    try {
        const response = await fetch(proxyUrl, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({
                error: "ScrapingBee API error",
                status: response.status,
                details: errorText.substring(0, 500)
            });
        }

        const data = await response.json(); // ScrapingBee returns the original API response as JSON

        // ============  BRANDING OVERRIDES  ============
        if (data.api_developer) data.api_developer = "@AKASHHACKER";
        if (data.data && typeof data.data === 'object' && data.data.metadata) {
            data.data.metadata.developer = "@AKASHHACKER";
            data.data.metadata.note = "@AKASHHACKER";
        }
        delete data.credit;
        delete data.developer;

        // Tumhara branding
        data.owner = "https://t.me/AkashExploits1 \n BUY INSTANT CHEAP PRICE";
        data.key_details = {
            expiry_date: foundUser.expiry,
            days_remaining: daysLeft > 0 ? `${daysLeft} Days` : "Last Day Today",
            status: "Active"
        };
        data.powered_by = "@AKASHHACKER";
        data.source = "@AKASHHACKER";

        res.status(200).json(data);

    } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
            return res.status(504).json({ error: "Request timeout", detail: "ScrapingBee took too long" });
        }
        return res.status(500).json({ 
            error: "Internal Server Error", 
            detail: err.message 
        });
    }
}
