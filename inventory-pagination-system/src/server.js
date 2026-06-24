const express = require("express");
const cors = require("cors");

const productsRoute = require("./routes/products");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Inventory Pagination API Running"
  });
});

app.use("/api/products", productsRoute);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});