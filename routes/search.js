// routes/listings.js or wherever your route file is

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");

// Route for search suggestions (AJAX)
router.get("/", async (req, res) => {
  const query = req.query.q;

  if (!query) return res.json([]);

  const regex = new RegExp(query, "i"); // case-insensitive
  const results = await Listing.find({
    $or: [{ title: regex }, { country: regex }],
  }).limit(10); // Limit suggestions

  res.json(results);
});

module.exports = router;
