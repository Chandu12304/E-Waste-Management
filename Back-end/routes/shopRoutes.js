const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.get("/", async (req, res) => {

    /*Raw SQL:
    SELECT *
    FROM shop;
    */

    try {
        const { data, error } = await supabase
            .from("shop")
            .select("*");

        if (error) {
            console.error("Error fetching shop data:", error);
            return res.status(500).json({ error: "Error fetching shop data" });
        }

        console.log("Fetched Shop Data:", data);
        res.json(data);
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Unexpected error occurred" });
    }
});

module.exports = router;
