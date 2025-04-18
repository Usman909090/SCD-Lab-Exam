import express from "express";
import mongoose from "mongoose";
import Payment from "./Payment.js";

const app = express();
const PORT = 3005;
const dbUrl = "mongodb://localhost:27017/sessional";

app.use(express.json());

mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.post("/payments", async (req, res) => {
  const { paymentId, orderId, totalAmount } = req.body;

  try {
    const payment = new Payment({
      paymentId,
      orderId,
      totalAmount,
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create payment" });
  }
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
