export default async function handler(req, res) {
    const number = req.query.num;
    const userKey = req.query.key;

    const KEYS_DB = {
        "user1": { key: "AKASH_PAID31DAYS", expiry: "2026-03-31" },
        "user2": { key: "AKASH_PAID1DAYS", expiry: "2026-02-15" },
        "trial": { key: "AKASH_PAID3MONTH", expiry: "2026-04-29" },
    };

    if (!userKey) return res.status(401).json({ error: "API Key missing!" });

    const foundUser = Object.values(KEYS_DB).find(u => u.key === userKey);
    if (!foundUser) return res.status(401).json({ error: "Invalid API Key!" });

    const today = new Date();
    const expiryDate = new Date(foundUser.expiry);
    if (today > expiryDate) {
        return res.status(403).json({ error: "Key Expired!", expiry: foundUser.expiry });
    }

    if (!number) return res.status(400).json({ error: "Number missing!" });

    // --- TARGET URL ---
    const url = `https://snxrajput-trial-api.vercel.app/number/${number}`;

    try {
        const response = await fetch(url);
        let rawData = await response.text(); // Text format mein data liya

        // --- SURAJ KO AKASH SE REPLACE KARNA ---
        // Ye line Rajput Suraj aur CyberSuraj ko badal degi
        let modifiedData = rawData
            .replace(/CyberSuraj/g, "AKASHHACKER")
            .replace(/Rajput Suraj Raj/g, "AKASHHACKER")
            .replace(/● Credit: .*/g, "● Credit: AKASHHACKER")
            .replace(/● Developer: .*/g, "● Developer: AKASHHACKER");

        // Extra info add karna (Last mein)
        const extraInfo = `
========================================
🔐 KEY DETAILS
========================================
● Status: Active
● Expiry: ${foundUser.expiry}
● Powered By: @AKASHHACKER
========================================`;

        // Text response bhejna (kyunki source text hai)
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.status(200).send(modifiedData + extraInfo);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "API Response error ya link galat hai" });
    }
}
