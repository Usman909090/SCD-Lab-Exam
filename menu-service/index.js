import express from "express";
import mongoose from "mongoose";
import Item from "./Item.js";

const app = express();
const PORT = 3001;
const dbUrl = "mongodb://localhost:27017/sessional";

app.use(express.json());

mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.get("/menu", (req, res) => {
  const items = Item.getAllItems();
  items.filter((item) => {
    return item.stock > 0;
  });

  res.json(items);
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
