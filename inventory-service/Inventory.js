import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
    unique: true,
  },
  stock: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Inventory = mongoose.model("Inventory", InventorySchema);
export default Inventory;
