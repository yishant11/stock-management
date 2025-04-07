const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./database/databse');
const cors = require("cors");

const productRoutes = require('./routes/productRoutes');
const stockRoutes = require('./routes/stockRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(bodyParser.json());

app.use(
  cors({
    origin: "https://stock-management-j3ou.vercel.app",
    credentials: true,
  })
);

// Define our routes
app.use('/products', productRoutes);
app.use('/stock', stockRoutes);
app.use('/purchase', transactionRoutes);

// Start the server on port 3000 or your specified environment port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
