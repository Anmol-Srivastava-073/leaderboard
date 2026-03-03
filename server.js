require("dotenv").config();
const express = require("express");
const axios = require("axios");
const XLSX = require("xlsx");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
const EXCEL_URL = process.env.EXCEL_URL;

// API endpoint
app.get("/api/leaderboard", async (req, res) => {
  try {
    // Fetch Excel file from SharePoint
    const response = await axios.get(EXCEL_URL, {
      responseType: "arraybuffer"
    });

    // Parse Excel
    const workbook = XLSX.read(response.data, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const rows = XLSX.utils.sheet_to_json(sheet);

    // Ensure columns:
    //   Name  | Total Points
    const players = rows.map(row => ({
      name: row["Name"] || "",
      score: Number(row["Total Points"]) || 0
    }));

    // Sort descending
    players.sort((a, b) => b.score - a.score);

    // Send top 10
    res.json(players.slice(0, 10));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Excel data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
