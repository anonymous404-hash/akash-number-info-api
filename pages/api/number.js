// File Path: pages/api/number.js

export default async function handler(req, res) {
    const number = req.query.num;
    const userKey = req.query.key;

    const KEYS_DB = {
        "user1": { key: "AKASH_PAID31DAYS", expiry: "2026-02-31" },
        "user2": { key: "AKASH_PAID1DAYS", expiry: "2026-02-3" },
        "trial": { key: "AKASH_PAID3MONTH", expiry: "2026-04-29" },
    };

    if (!userKey) {
        return res.status(401).json({ error: "API Key missing!" });
    }

    const foundUser = Object.values(KEYS_DB).find(u => u.key === userKey);

    if (!foundUser) {
        return res.status(401).json({ error: "Invalid API Key!" });
    }

    const today = new Date();
    const expiryDate = new Date(foundUser.expiry);

    // Calculate Days Remaining
    const timeDiff = expiryDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (today > expiryDate) {
        return res.status(403).json({ 
            error: "Key Expired!", 
            expiry_date: foundUser.expiry,
            status: "Expired",
            message: `Aapki key ${foundUser.expiry} ko khatam ho chuki hai.` 
        });
    }

    if (!number) {
        return res.status(400).json({ error: "number missing" });
    }

    const url = `https://original.proportalxc.workers.dev/?num=${number}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Data Clean-up
        delete data.credit;
        delete data.developer;
        if (data.data?.remarks) delete data.data.remarks;

        // --- ADDING KEY INFO TO RESPONSE ---
        data.key_details = {
            expiry_date: foundUser.expiry,
            days_remaining: daysLeft > 0 ? `${daysLeft} Days` : "Last Day Today",
            status: "Active"
        };
        
        data.source = "@AKASHHACKER";
        data.powered_by = "@AKASHHACKER";

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
