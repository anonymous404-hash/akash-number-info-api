// File Path: pages/api/number.js

export default async function handler(req, res) {
    const number = req.query.num;

    if (!number) {
        return res.status(400).json({ error: "number missing" });
    }

    const url = `https://numapi.anshapi.workers.dev/?num=${number}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        delete data.credit;
        delete data.developer;

        if (data.data?.remarks) delete data.data.remarks;

        data.source = "@AKASHHACKERREPLYBOT";
        data.powered_by = "@AKASHHACKERREPLYBOT";

        res.status(200).json(data);

    } catch (err) {
        res.status(500).json({ error: "API fetch failed" });
    }
}
