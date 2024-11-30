import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  book: {
    type: mongoose.ObjectId,
    ref: "Book",
  },
  quantity: {
    type: Number,
    default: 1, 
  },
});

const orderSchema = new mongoose.Schema(
  {
    products: [orderItemSchema], 
    payment: {}, 
    buyer: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
