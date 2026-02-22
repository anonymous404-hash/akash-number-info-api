// File Path: pages/api/number.js

export default async function handler(req, res) {
    const number = req.query.num;
    const userKey = req.query.key;

    const KEYS_DB = {
        "user1": { key: "AKASH_PAID1DAY", expiry: "2026-02-17" },
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

    // 🔁 WORKING API ENDPOINT (Cloudflare Worker)
    const url = `https://num.proportalxc.workers.dev/?mobile=${number}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // ============  🚀 COMPLETE BRANDING OVERRIDE - SIRF @AKASHHACKER  ============
        
        // 🔥 1. Main developer credit override
        if (data.api_developer) data.api_developer = "@Akash_Exploits_bot";
        
        // 🔥 2. Fix for api_developer_end field (yeh tumhare response mein @proportalxc dikha raha tha)
        if (data.api_developer_end) data.api_developer_end = "@Akash_Exploits_bot";
        
        // 🔥 3. Agar data.result mein koi developer field ho toh
        if (data.result && typeof data.result === 'object') {
            if (data.result.developer) data.result.developer = "@Akash_Exploits_bot";
            if (data.result.credit) delete data.result.credit;
        }
        
        // 🔥 4. Deep override inside metadata (agar exist kare)
        if (data.data && data.data.metadata) {
            data.data.metadata.developer = "@Akash_Exploits_bot";
            data.data.metadata.note = "@Akash_Exploits_bot";
        }
        
        // 🔥 5. Remove any other possible upstream branding fields
        if (data.credit) delete data.credit;
        if (data.developer) delete data.developer;
        if (data._powered_by) delete data._powered_by;
        if (data.poweredBy) delete data.poweredBy;
        if (data.author) data.author = "@Akash_Exploits_bot";
        if (data.created_by) data.created_by = "@Akash_Exploits_bot";

        // ============  🧠 YOUR OWN BRANDING (YEHI SHOW HOGA)  ============
        data.owner = "https://t.me/Akash_Exploits_bot \n BUY INSTANT CHEAP PRICE";
        
        // Key validity details
        data.key_details = {
            expiry_date: foundUser.expiry,
            days_remaining: daysLeft > 0 ? `${daysLeft} Days` : "Last Day Today",
            status: "Active"
        };
        
        data.powered_by = "@Akash_Exploits_bot";
        data.source = "@Akash_Exploits_bot";

        res.status(200).json(data);
        
    } catch (err) {
        res.status(500).json({ 
            error: "Internal Server Error", 
            detail: "Upstream API down",
            message: err.message 
        });
    }
}
