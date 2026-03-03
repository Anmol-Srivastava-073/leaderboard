const express = require("express");
const XLSX = require("xlsx");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// API Endpoint
app.get("/api/leaderboard", (req, res) => {
    try {
        const workbook = XLSX.readFile("data.xlsx");
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(sheet);

        // Expecting columns: Name, Total Points
        const formatted = data.map(row => ({
            name: row["Who're You?"],
            score: Number(row["Total Points"])
        }));

        // Sort descending
        formatted.sort((a, b) => b.score - a.score);

        res.json(formatted.slice(0, 10)); // Top 10
    } catch (error) {
        res.status(500).json({ error: "Error reading Excel file" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
