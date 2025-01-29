import { Router } from "express";
import Book from '../models/BookModel.js';
import express from "express";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createBookController,
  deleteBookController,
  getBookController,
  getBookQuantities,
  getSingleBookController,
  bookGenreController,
  bookCountController,
  bookFiltersController,
  bookListController,
  bookPhotoController,
  bookStockUpdate,
  relatedBookController,
  searchBookController,
  updateBookController,
  bookAuthorController,
  getLatestBooks,
  brainTreePaymentController,
  brainTreeTokenController,
  

} from "../controllers/BookController.js";
import formidable from "express-formidable";
import route from "color-convert/route.js";
import dotenv from "dotenv";
import { web3, loyaltyToken } from "../config/blockchain.js";
// import { burnTokens } from "../controllers/loyaltyController.js";
import { message } from "antd";
import {Web3Validator} from "web3-validator";
import User from "../models/UserModel.js";
dotenv.config();
const router = express.Router();

// Create book
router.post(
  "/create-book",
  requireSignIn,
  isAdmin,
  formidable(),
  createBookController
);

//get books
router.get("/get-book", getBookController);

//get one book
router.get("/get-book/:slug", getSingleBookController);

//get photo
router.get("/book-photo/:pid", bookPhotoController);

//delete book
router.delete(
  "/delete-book/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  deleteBookController
);

//update book
router.put(
  "/update-book/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateBookController
);

//filter book
router.post("/book-filters", bookFiltersController);

//book count
router.get("/book-count", bookCountController);

//book per page
router.get("/book-list/:page", bookListController);

//search book
router.get("/search/:keyword", searchBookController);

//similar book
router.get("/related-book/:pid/:cid", relatedBookController);

//genre wise book
router.get("/book-genre/:slug", bookGenreController);

//genre wise book
router.get("/book-author/:slug", bookAuthorController);

router.get("/latest", getLatestBooks);

// Route to update book rating
// router.post("/rate/:bookId", requireSignIn, isDoctor, updateBookRating);

router.post("/getQuantities", getBookQuantities);

//update quantity when users buys
router.put("/updateStock", bookStockUpdate);


router.get("/braintree/token", brainTreeTokenController);

// //payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

// router.post("/stripe-payment", requireSignIn, stripePaymentController);

// POST /api/v1/books/mintTokens
router.post("/mintTokens", async (req, res) => {
  const { userAddress, amount } = req.body;

  if (!userAddress || !amount) {
    return res.status(400).json({ success: false, error: "User address and amount are required" });
  }
  const adminAddress = process.env.ADMIN_WALLET_ADDRESS; // Admin wallet address
  const privateKey = process.env.ADMIN_PRIVATE_KEY; 
  try {

    const amountInWei = web3.utils.toWei(amount.toString(), "ether");

    const tx = await loyaltyToken.methods
      .mint(userAddress, amountInWei)
      const gas = await tx.estimateGas({ from: adminAddress });
      const gasPrice = await web3.eth.getGasPrice(); // Fetch the current gas price

      console.log("current gas price: ", gasPrice);

      const txData = {
        from: adminAddress,
        to: loyaltyToken.options.address,
        data: tx.encodeABI(),
        gas,
        gasPrice,
      };
  
      // Sign and send the transaction
      const signedTx = await web3.eth.accounts.signTransaction(txData, privateKey);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      
      console.log("Mint Transaction Receipt:", receipt);
    res.status(200).json({ success: true, transaction: tx });
  } catch (error) {
    console.error("Error minting tokens:", error);
    res.status(500).json({ success: false, error: "Failed to mint tokens" });
  }
});

router.get("/getBalance", async (req, res) => {
  try {
    
    const { address } = req.query;
    console.log("Request Query:", address);
    if(!address){
      return res.status(400).json({ error: "Address parameter is required" });
    }
  const balance = await loyaltyToken.methods.balanceOf(address).call();
  const humanReadableBalance = web3.utils.fromWei(balance, "ether");

  res.json({ balance: Number(humanReadableBalance).toFixed()});
  } catch (error) {
    console.error("Error in /getBalance route:", error);
    res.status(500).json({ error: "Failed to fetch balance" });
  }
  
});


router.post("/burnTokens", async (req, res) => {
  const { address, tokensToBurn } = req.body;

  const adminAddress = process.env.ADMIN_WALLET_ADDRESS;
  const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT1_ADDRESS;

  if (!address ) {
    return res.status(400).json({
      success: false,
      message: "Invalid input data",
    });
  }
  if(!tokensToBurn || tokensToBurn < 0){
    return res.status(400).json({
      success: false,
      message: "Invalid token amount",
    })
  }
  console.log("Tokens to burn:", tokensToBurn);

  try {

    const decimals = await loyaltyToken.methods.decimals().call();

    const tokensInWei = BigInt(tokensToBurn) * BigInt(10) ** BigInt(decimals);
    console.log("Tokens in Wei: ", tokensInWei.toString());
    // Check user's token balance
    const balance = await loyaltyToken.methods.balanceOf(address).call();
    if (BigInt(balance) < tokensInWei) {
      return res.status(400).json({
        success: false,
        message: "User does not have enough tokens to burn.",
      });
    }

    const block = await web3.eth.getBlock("latest");
    const baseFee = BigInt(block.baseFeePerGas);
    const maxPriorityFee = BigInt(web3.utils.toWei("2", "Gwei"));

    const txData = loyaltyToken.methods.burnFrom(address, tokensInWei.toString()).encodeABI();
    console.log(txData);
    const nonce = await web3.eth.getTransactionCount(adminAddress, "pending");
    // const gasPrice = await web3.eth.getGasPrice();
    const maxFeePerGas = baseFee + maxPriorityFee;
    const gas = await loyaltyToken.methods.burnFrom(address, tokensInWei.toString()).estimateGas({
      from: adminAddress,
    })

    const tx = {
      from: adminAddress,
      to: contractAddress,
      maxPriorityFeePerGas: maxPriorityFee.toString(),
      maxFeePerGas: maxFeePerGas.toString(),
      gas: gas.toString(),
      
      data: txData,
      nonce: nonce.toString(),
    };

    // const signedTx = await web3.eth.accounts.signTransaction(tx, adminPrivateKey);
    // const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    const updatedBalance = await loyaltyToken.methods.balanceOf(address).call()
    const humanReadableBalance = web3.utils.fromWei(updatedBalance, "ether");
    console.log("Balance updated:", humanReadableBalance);

    return res.status(200).json({
      success: true,
      message: "Tokens burned successfully.",
      tx: {
        to: contractAddress,
        gas: gas.toString(),
        data: txData,
      }
    });
  } catch (err) {
    console.error("Error burning tokens:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to burn tokens.",
    });
  }
});

router.post("/calculate-rewards", async (req, res) => {

  const { recipient, purchaseAmount } = req.body;
  const adminAddress = process.env.ADMIN_WALLET_ADDRESS;
  const contractAddress = process.env.CONTRACT1_ADDRESS;

  if(!recipient) {
    return res.status(400).json({
      success: false,
      message: "Invalid input data"
    });
  }
  if(!purchaseAmount || isNaN(purchaseAmount) || purchaseAmount <= 0 ) {
    return res.status(400).json({
      success: false,
      message: "Invalid input data"
    });
  }
  
  console.log(recipient);
  console.log(purchaseAmount);
  try {
    
    const purchaseAmountBN = web3.utils.toWei(purchaseAmount.toString(), "ether");
    console.log(purchaseAmountBN);
    const block = await web3.eth.getBlock("latest");
    const baseFee = BigInt(block.baseFeePerGas || "0");
    const maxPriorityFee = BigInt(web3.utils.toWei("2", "Gwei"));
    const maxFeePerGas = baseFee + maxPriorityFee;
    const txData = loyaltyToken.methods.calculateReward(recipient, purchaseAmountBN.toString()).send({ from: adminAddress});
    
    const nonce = await web3.eth.getTransactionCount(adminAddress, "pending");
    const gas = await loyaltyToken.methods.calculateReward(recipient, purchaseAmountBN).estimateGas({
      from: adminAddress
    });

    const tx = {
      from: adminAddress,
      to: contractAddress,
      maxPriorityFeePerGas: maxPriorityFee.toString(),
      maxFeePerGas: maxFeePerGas.toString(),
      gas: gas.toString(),
      data: txData,
      nonce: nonce.toString()
    };

    console.log("Transaction data: ", {
      recipient,
      purchaseAmountBN: purchaseAmountBN.toString(),
      gas: gas.toString(),
      txData: txData
    });

    const signedTx = await web3.eth.accounts.signTransaction(tx, adminPrivateKey);

    // Send the transaction
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    return res.status(200).json({
      success: true,
      message: "Reward calculation prepared",
      transactionHash : receipt.transactionHash,
    });
  } catch (error) {
    console.error("Error calculating rewards:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to calculate rewards"
    });
  }
});

router.post("/applyDiscount", async(req,res) => {
  const { walletAddress } = req.body;

  if(!walletAddress) {
    console.error("Wallet Address is required");
  }
  const user = await User.findOne({ walletAddress });

  if(!user){ 
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }
  if(user.hasAppliedDiscount){
    return res.status(400).json({ success: false, message: "Discount already applied. "});
  }

  user.hasAppliedDiscount = true;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Discount applied successfully."
  });
})

router.post("/resetDiscount", async( req, res) => {
  const { walletAddress } = req.body;
  const user = await User.findOne({ walletAddress });

  if(!user){
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.hasAppliedDiscount = false;
  await user.save();

  return res.status(200).json({ success: true, message: "Discount status reset successfully."})
});

router.get("/discountStatus", async(req,res) => {
  const { walletAddress } = req.query;

  try {
    if(!walletAddress){
      return res.status(400).json({
        success: false,
        message: "Wallet address required"
      })
    }

    const user = await User.findOne({ walletAddress });

    if(!user){
      return res.status(404).json({
        success: false,
        message: "user not found"
      })
    }

    return res.status(200).json({
      success: true,
      hasAppliedDiscount: user.hasAppliedDiscount,
      message: "Discount status retrieved successfully."
    })
  } catch (error) {
    console.error("Error checking discount status:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking discount status",
      error: error.message
    })
  }
})
// async (req, res) => {
//   const adminAddress = process.env.ADMIN_WALLET_ADDRESS;
//   const privateKey = process.env.ADMIN_PRIVATE_KEY;
//   const contractAddress = process.env.CONTRACT_ADDRESS;
//   const { address, tokensToBurn } = req.body;

//   if (!address || !tokensToBurn || tokensToBurn <= 0) {
//     return res.status(400).json({ message: "Invalid input data" });
//   }

//   try {
//     const balance = await loyaltyToken.methods.balanceOf(address).call();
//     if (BigInt(balance) < BigInt(tokensToBurn)) {
//       return res.status(400).json({ message: "Insufficient token balance." });
//     }

//     const txData = loyaltyToken.methods.burnFrom(address, tokensToBurn).encodeABI();

//     const nonce = await web3.eth.getTransactionCount(adminAddress, "latest");

//     const gasEstimate = await loyaltyToken.methods.burnFrom(address, tokensToBurn).estimateGas({
//       from: adminAddress,
//     });

//     const gasPrice = await web3.eth.getGasPrice();

//     const tx = {
//       from: adminAddress,
//       to: contractAddress,
//       gas: gasEstimate,
//       gasPrice: gasPrice,
//       data: txData,
//       nonce: nonce,
//     };

  
//     const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

//     const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

//     res.status(200).json({
//       message: "Tokens burned successfully",
//       transactionHash: receipt.transactionHash,
//     });
//   } catch (error) {
//     console.error("Errors burning tokens:", error);

//     if (error.receipt) {
//       res.status(500).json({
//         message: "Transaction failed",
//         receipt: error.receipt,
//         error: error.message,
//       });
//     } else {
//       res.status(500).json({
//         message: "Failed to burn tokens",
//         error: error.message,
//       });
//     }
//   }
// });


export default router;
