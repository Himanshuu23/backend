const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");

const connectDb = require('./config/connectDB')

// utility routes
const analyzeRoutes = require("./routes/analyze");
const solarRoutes = require("./routes/solarRoutes");
const electricityRoutes = require('./routes/electricityRoutes');
const userRoutes = require('./routes/user')
const vendorRoutes = require('./routes/vendor')

const app = express();

const corsOption = {
  origin: ["http://localhost:5173/", "http://localhost:8081"],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOption));
app.use("/api/analyze", analyzeRoutes);
app.use("/api/api", solarRoutes);
app.use("/api/api", electricityRoutes);
app.use("/api/user", userRoutes)
app.use("/api/vendor", vendorRoutes)

// app.post('/api/submit', (req, res) => {
//     const { name } = req.body;
//     console.log(`Received data: ${name}`);
//     res.json({ message: 'Request was successful!' });
// });

// Connect to db first then the server starts
const startServer = async () => {
  try {
    await connectDb();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT} 🤫🧏`));
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

startServer();