import express from "express";
import mongoose from "mongoose";
import Customer from "./Customer.js";

const app = express();
const PORT = 3004;
const dbUrl = "mongodb://localhost:27017/sessional";

app.use(express.json());

mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.post("/customers/update-points", async (req, res) => {
  const { customerId, points } = req.body;

  try {
    const customer = await Customer.findOneAndUpdate(
      { customerId },
      { $inc: { loyalityPoints: points } },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error("Error updating loyalty points:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/customers/:customerId", async (req, res) => {
  const customerId = req.params.customerId;
  // Find customer id
  const result = Customer.findById(customerId);
  res.json(result);
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
