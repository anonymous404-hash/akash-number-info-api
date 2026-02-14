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

    // ----- Upstream API call with timeout -----
    const url = `https://zionix.xo.je/znnum?number=${number}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        // Handle non-200 responses
        if (!response.ok) {
            // Try to get error message from upstream, fallback to status text
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                errorData = { message: response.statusText };
            }
            return res.status(response.status).json({
                error: "Upstream API error",
                details: errorData,
            });
        }

        // Parse JSON response
        const data = await response.json();

        // ============  BRANDING OVERRIDES  ============
        // Safely modify fields only if they exist
        if (data.api_developer) data.api_developer = "@AKASHHACKER";

        // Deep override inside metadata (if it exists)
        if (data.data && typeof data.data === 'object' && data.data.metadata) {
            data.data.metadata.developer = "@AKASHHACKER";
            data.data.metadata.note = "@AKASHHACKER";
        }

        // Remove any upstream credit fields
        delete data.credit;
        delete data.developer;

        // Add your own branding
        data.owner = "https://t.me/AkashExploits1 \n BUY INSTANT CHEAP PRICE";
        data.key_details = {
            expiry_date: foundUser.expiry,
            days_remaining: daysLeft > 0 ? `${daysLeft} Days` : "Last Day Today",
            status: "Active"
        };
        data.powered_by = "@AKASHHACKER";
        data.source = "@AKASHHACKER";

        // Send final response
        res.status(200).json(data);

    } catch (err) {
        clearTimeout(timeoutId); // Ensure timeout is cleared even on error

        // Handle abort/timeout specifically
        if (err.name === 'AbortError') {
            return res.status(504).json({ error: "Upstream API timeout", detail: "Request took too long" });
        }

        // Other fetch errors (network, DNS, etc.)
        return res.status(500).json({ 
            error: "Internal Server Error", 
            detail: err.message || "Upstream API is unreachable" 
        });
    }
}
