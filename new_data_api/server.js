const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 10000;

// Middleware
app.use(cors());

// MongoDB connection string
const uri = "mongodb+srv://avnichauhan3622_db_user:tashu@2004@cluster0.pi1m1ve.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

let casesCollection;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    const database = client.db("typhoiddata");   // <-- Your DB name
    casesCollection = database.collection("cases"); // <-- Your collection name
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

// API endpoint to fetch all cases
app.get("/cases", async (req, res) => {
  try {
    const data = await casesCollection.find({}).toArray();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("🚀 Typhoid API is running...");
});

// Start server
app.listen(port, async () => {
  await connectDB();
  console.log(`🚀 Server running on http://localhost:${port}`);
});

