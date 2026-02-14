// File Path: pages/api/number.js

export default async function handler(req, res) {
    const number = req.query.num;
    const userKey = req.query.key;

    const KEYS_DB = {
        "user1": { key: "AKASH_PAID31DAYS", expiry: "2026-03-03" },
        "user2": { key: "AKASH_PAID30DAYS", expiry: "2026-03-14" },
        "trial": { key: "AKASH_PAID3MONTH", expiry: "2026-04-29" },
    };

    // ----- API Key validation -----
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

    // ----- Upstream API call with timeout & browser headers -----
    const url = `https://zionix.xo.je/znnum?number=${number}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        clearTimeout(timeoutId);

        // Handle non-200 responses
        if (!response.ok) {
            let errorText = await response.text(); // Try to read as text (could be HTML)
            return res.status(response.status).json({
                error: "Upstream API returned an error",
                status: response.status,
                statusText: response.statusText,
                details: errorText.substring(0, 500) // First 500 chars of the error page
            });
        }

        // Check content-type to ensure it's JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text(); // Read as text (likely HTML)
            return res.status(502).json({
                error: "Upstream API did not return JSON",
                contentType: contentType,
                preview: text.substring(0, 500) // Show first 500 chars to diagnose
            });
        }

        // Safely parse JSON
        const data = await response.json();

        // ============  BRANDING OVERRIDES  ============
        if (data.api_developer) data.api_developer = "@AKASHHACKER";
        if (data.data && typeof data.data === 'object' && data.data.metadata) {
            data.data.metadata.developer = "@AKASHHACKER";
            data.data.metadata.note = "@AKASHHACKER";
        }
        delete data.credit;
        delete data.developer;

        // Your own branding
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
            return res.status(504).json({ error: "Upstream API timeout", detail: "Request took too long" });
        }
        return res.status(500).json({ 
            error: "Internal Server Error", 
            detail: err.message 
        });
    }
}
