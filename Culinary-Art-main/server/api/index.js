const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "../public")));

// MongoDB connection with caching for serverless
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  const connection = await mongoose.connect(process.env.MONGODB_URI);
  cachedConnection = connection;
  return connection;
}

app.get("/", (req, res) => {
  res.send("Culinary Art server is running!");
});

// Routes
const UserRoutes = require("../src/routes/UserRoutes");
const RecipeRoutes = require("../src/routes/RecipeRoutes");
const ProductRoutes = require("../src/routes/ProductRoutes");
const OrderRoutes = require("../src/routes/OrderRoutes");

app.use("/api/users", UserRoutes);
app.use("/api/recipes", RecipeRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/orders", OrderRoutes);

// Serverless handler for Vercel
module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};
