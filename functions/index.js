const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "MR.CREAMS backend live 🚀" });
});

// Example order endpoint
app.post("/orders", async (req, res) => {
  const { customer, items } = req.body;

  if (!customer || !items) {
    return res.status(400).json({ error: "Invalid order data" });
  }

  return res.json({
    success: true,
    message: "Order received",
    customer,
    items
  });
});

exports.api = functions.https.onRequest(app);


