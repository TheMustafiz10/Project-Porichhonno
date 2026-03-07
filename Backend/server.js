const express = require("express");
const cors = require("cors");

const Collection = require("./models/collectionModel");
const Bin = require("./models/binModel");
const Report = require("./models/reportModel");

// Community Leaderboard imports
const leaderboardRoutes = require("./routes/leaderboard");
const earningsRoutes = require("./routes/earnings");
const redeemRoutes = require("./routes/redeem");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
Feature 01
On-Demand Collection Scheduler
========================= */

/* API 1 - On-Demand Collection Scheduler */
app.post("/scheduleCollection", async (req, res) => {
  const newRequest = new Collection({
    name: req.body.name,
    address: req.body.address,
    itemType: req.body.itemType,
    pickupDate: req.body.pickupDate,
  });

  await newRequest.save();

  res.json({
    message: "Collection Scheduled Successfully",
  });
});

/* API 2 - Live Collection Route View */
app.get("/collectionRoute", async (req, res) => {
  const routeData = {
    currentLocation: "Block A",
    nextStop: "Block B",
    estimatedArrival: "15 minutes",
  };

  res.json(routeData);
});

/* =========================
Feature 02
Smart Bin & Issue Reporting
========================= */

/* API 3 - Interactive Bin Locator */
app.get("/bins", async (req, res) => {
  const bins = await Bin.find();
  res.json(bins);
});

/* API 4 - Citizen Issue Reporting */
app.post("/reportIssue", async (req, res) => {
  const report = new Report({
    description: req.body.description,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  });

  await report.save();

  res.json({
    message: "Issue Report Submitted",
  });
});

/* =========================
Feature 03
Community Leaderboard
========================= */

// Leaderboard for individuals & neighborhoods
app.use("/api/leaderboard", leaderboardRoutes);

// View current user's earnings/points
app.use("/api/user/earnings", earningsRoutes);

// Redeem points
app.use("/api/redeem-points", redeemRoutes);

/* ========================= */

app.listen(1642, () => {
  console.log("Server running on port 1642");
});