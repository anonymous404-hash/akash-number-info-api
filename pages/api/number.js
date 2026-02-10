const axios = require("axios");

const DEVELOPER = "@AKASHHACKER";
const KEYS_DB = {
  "AKASH_PAID31DAYS": { expiry: "2026-03-31", status: "Premium" },
  "AKASH_PAID1DAYS": { expiry: "2026-02-15", status: "Basic" },
  "FREE": { expiry: "2026-12-31", status: "Free-User" } // Date badha di hai testing ke liye
};

module.exports = async (req, res) => {
  // Query: ?imei=354273440018310&key=FREE
  const { imei, key } = req.query; 

  // 1️⃣ Key Validation
  if (!key || !KEYS_DB[key]) {
    return res.status(401).json({ success: false, message: "Invalid Key!", developer: DEVELOPER });
  }

  // 2️⃣ Expiry Logic (Fix)
  const today = new Date();
  const expiryDate = new Date(KEYS_DB[key].expiry);
  
  if (today > expiryDate) {
    return res.status(403).json({ success: false, message: "Key Expired!", developer: DEVELOPER });
  }

  if (!imei) {
    return res.status(400).json({ success: false, message: "IMEI number required" });
  }

  try {
    // 3️⃣ Fetch Dynamic Data 
    // Yahan hum external API ko call kar rahe hain jo aapne pehle dikhayi thi
    const apiRes = await axios.get(`https://www.imei.info/api/checkout/basic-imei-check/?imei=${imei}`);
    
    // 4️⃣ Data Customization (Jo aapne manga tha)
    const result = apiRes.data;

    return res.status(200).json({
      success: true,
      developer: DEVELOPER,
      key_info: KEYS_DB[key],
      device_info: {
        model: result.data?.result?.header?.model || "Unknown",
        brand: result.data?.result?.header?.brand || "Unknown",
        specs: result.data?.result?.items || []
      }
    });

  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: "IMEI Service Offline hai", 
      developer: DEVELOPER 
    });
  }
};
