import express from "express";
import mongoose from "mongoose";
import Item from "./Inventory.js";

const app = express();
const PORT = 3003;
const dbUrl = "mongodb://localhost:27017/sessional";

app.use(express.json());

mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.post("inventory/update", async (req, res) => {
  // COmes from order service
  const { order } = req.body;
  if (!order || !Array.isArray(order)) {
    return res.status(400).json({ error: "Invalid order format" });
  }
  try {
    const itemIds = order.map((item) => item.itemId);
    const itemQuantities = order.map((item) => item.quantity);

    // Update the inventory for each item
    for (let i = 0; i < itemIds.length; i++) {
      const itemId = itemIds[i];
      const quantity = itemQuantities[i];

      await Item.findOneAndUpdate(
        { itemId },
        { $inc: { stock: -quantity } },
        { new: true }
      );
    }

    res.status(200).json({ message: "Inventory updated successfully" });
  } catch (error) {
    console.error("Error updating inventory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
