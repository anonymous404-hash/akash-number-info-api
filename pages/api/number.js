Const axios = require("axios");

const DEVELOPER = "@AKASHHACKER"; // Aapka handle
const KEYS_DB = {
  "AKASH_PAID31DAYS": { expiry: "2026-03-31", status: "Premium" },
  "AKASH_PAID1DAYS": { expiry: "2026-02-15", status: "Basic" },
  "FREE": { expiry: "2026-02-12", status: "Premium" }
};

module.exports = async (req, res) => {
  // Query parameters: ?num=...&key=...
  const { num, key } = req.query; 

  // 1️⃣ Key Validation
  if (!key || !KEYS_DB[key]) {
    return res.status(401).json({ success: false, message: "Invalid Key!", developer: DEVELOPER });
  }

  // 2️⃣ Expiry Logic
  const today = new Date();
  const expiryDate = new Date(KEYS_DB[key].expiry);
  const timeDiff = expiryDate - today;
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (today > expiryDate) {
    return res.status(403).json({
      success: false,
      message: "Key Expired!",
      expiry_date: KEYS_DB[key].expiry,
      developer: DEVELOPER
    });
  }

  if (!num) {
    return res.status(400).json({ success: false, message: "Phone number (num) required" });
  }

  try {
    // 3️⃣ Fetch data as Text (Kyuki source API text design bhej rahi hai)
    const apiRes = await axios.get(`https://snxrajput-trial-api.vercel.app/number/${num}`, {
      responseType: 'text' 
    });

    let data = apiRes.data;

    // 4️⃣ Replace Names (Suraj hatao, Akash lagao)
    let cleanData = data
      .replace(/CyberSuraj/g, "AKASHHACKER")
      .replace(/Rajput Suraj Raj/g, "AKASHHACKER")
      .replace(/● Credit: .*/g, "● Credit: AKASHHACKER")
      .replace(/● Developer: .*/g, "● Developer: AKASHHACKER");

    // 5️⃣ Final JSON Response
    return res.status(200).json({
      success: true,
      developer: DEVELOPER,
      key_status: KEYS_DB[key].status,
      expiry_date: KEYS_DB[key].expiry,
      days_left: daysLeft > 0 ? `${daysLeft} days` : "Last day today",
      result: cleanData // Yaha wo modified text design aayega
    });

  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: "Source API Offline hai ya response error", 
      developer: DEVELOPER 
    });
  }
};
