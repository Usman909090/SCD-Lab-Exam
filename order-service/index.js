import express from "express";
import mongoose from "mongoose";
import Item from "./Order.js";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = 3002;
const dbUrl = "mongodb://localhost:27017/sessional";
app.use(cors());
app.use(express.json());

mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.post("/order", async (req, res) => {
  // Post contains a list of objects with their item name and prices
  const { order } = req.body;
  if (!order || !Array.isArray(order)) {
    return res.status(400).json({ error: "Invalid order format" });
  }
  try {
    // FIrst validate items by quering menu service, checks customer id, through cutomer service and calculates total price and stote the order
    const items = await axios.get("http://localhost:3001/menu");
    // if all items are available in the menu
    const itemIds = order.map((item) => item.itemId);
    const itemPrices = order.map((item) => item.price);
    const itemQuantities = order.map((item) => item.quantity);
    const totalPrice = itemPrices.reduce((acc, price) => acc + price, 0);
    const orderId = `order-${Date.now()}`;
    const customerId = order[0].customerId;
    const customers = await axios.get(
      `http://localhost:3004/customers/${customerId}`
    );
    if (!customers.data) {
      return res.status(404).json({ error: "Customer not found" });
    }
    const orderData = {
      orderId,
      itemIds,
      itemQuantities,
      customerId,
      totalPrice,
    };
    const orders = new Item(orderData);

    axios.post("http://localhost:3005/inventory/update", {
      order,
    });

    axios.post("http://localhost:3004/customers/update-points", {
      order,
    });
    res.status(201).json(orders);
  } catch (error) {
    console.error("Error creating order:", error);
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
