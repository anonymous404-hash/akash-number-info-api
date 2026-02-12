// File Path: pages/api/number.js

export default async function handler(req, res) {
    const number = req.query.num;
    const userKey = req.query.key;

    const KEYS_DB = {
        "user1": { key: "AKASH_PAID31DAYS", expiry: "2026-03-03" },
        "user2": { key: "AKASH_PAID30DAYS", expiry: "2026-03-14" },
        "trial": { key: "AKASH_PAID3MONTH", expiry: "2026-04-29" },
    };

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

    // 🔁 WORKING API ENDPOINT (Cloudflare Worker)
    const url = `https://num.proportalxc.workers.dev/?mobile=${number}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // ============  🚀 CUSTOM BRANDING OVERRIDE  ============
        // Remove any original developer credits
        if (data.api_developer) data.api_developer = "@AKASHHACKER";
        
        // Deep override inside metadata
        if (data.data && data.data.metadata) {
            data.data.metadata.developer = "@AKASHHACKER";
            data.data.metadata.note = "@AKASHHACKER";   // replaces "ek4nsh.tech"
        }

        // Remove other potential upstream branding fields
        if (data.credit) delete data.credit;
        if (data.developer) delete data.developer;

        // ============  🧠 YOUR OWN BRANDING  ============
        data.owner = "https://t.me/AkashExploits1 \n BUY INSTANT CHEAP PRICE";
        
        // Key validity details
        data.key_details = {
            expiry_date: foundUser.expiry,
            days_remaining: daysLeft > 0 ? `${daysLeft} Days` : "Last Day Today",
            status: "Active"
        };
        
        data.powered_by = "@AKASHHACKER";
        data.source = "@AKASHHACKER";

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error", detail: "Upstream API down" });
    }
}
