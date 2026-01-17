// File Path: pages/api/number.js

export default async function handler(req, res) {
    const number = req.query.num;
    const userKey = req.query.key;

    // --- YAHAN USERS KI LIST BANAYEIN ---
    const KEYS_DB = {
        "user1": { key: "NILOY_XYZ", expiry: "2026-01-25" }, // 25 Jan tak chalega
        "user2": { key: "AKASH_ABC", expiry: "2026-02-15" }, // 15 Feb tak chalega
        "trial": { key: "FREE_TRY", expiry: "2026-01-18" },  // Kal expire ho jayega
    };

    if (!userKey) {
        return res.status(401).json({ error: "API Key missing!" });
    }

    // Key check logic
    const foundUser = Object.values(KEYS_DB).find(u => u.key === userKey);

    if (!foundUser) {
        return res.status(401).json({ error: "Invalid API Key!" });
    }

    // --- DATE CHECK LOGIC ---
    const today = new Date();
    const expiryDate = new Date(foundUser.expiry);

    // Agar aaj ki date expiry date se badi hai toh block kar do
    if (today > expiryDate) {
        return res.status(403).json({ 
            error: "Key Expired!", 
            message: `Aapki key ${foundUser.expiry} ko khatam ho chuki hai.` 
        });
    }

    // --- AAPKA ORIGINAL FETCH LOGIC ---
    if (!number) {
        return res.status(400).json({ error: "number missing" });
    }

    const url = `https://ravan-lookup.vercel.app/api?key=Ravan&type=mobile&term=${number}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Data Clean-up
        delete data.credit;
        delete data.developer;
        if (data.data?.remarks) delete data.data.remarks;

        data.source = "@AKASHHACKER";
        data.powered_by = "@AKASHHACKER";

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
