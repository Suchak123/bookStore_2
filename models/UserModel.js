import { Schema, model } from "mongoose";

const userSchema = Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    
    token: {
      type: String,
      default: "",
    },
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      sparse: true
    },
    isWalletConnected: {
      type: Boolean,
      default: false,
    },
    hasAppliedDiscount: { 
      type: Boolean, 
      default: false
    },
  },
  { timestamps: true }
);
const User = model("User", userSchema);
export default User;
