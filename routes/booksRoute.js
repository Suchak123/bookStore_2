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
  stripePaymentController
  
 
} from "../controllers/BookController.js";
import formidable from "express-formidable";
import route from "color-convert/route.js";
import dotenv from "dotenv";
import { web3, loyaltyToken } from "../config/blockchain.js";
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
  try {
    const adminAddress = process.env.ADMIN_WALLET_ADDRESS; // Admin wallet address
    const privateKey = process.env.ADMIN_PRIVATE_KEY; 

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

// router.post("/updateTokenBalance", async (req, res) => {
//   try {
//     const { address, tokensToDeduct } = req.body;

//     if (!address || !tokensToDeduct) {
//       return res.status(400).json({ success: false, error: "Invalid data" });
//     }

//     const currentBalance = await loyaltyToken.methods.balanceOf(address).call();

//     const updatedBalance = BigInt(currentBalance) - BigInt(tokensToDeduct * 1e18);

//     if (updatedBalance < 0n) {
//       return res.status(400).json({ success: false, error: "Insufficient tokens" });
//     }

//     await loyaltyToken.methods.burn(address, tokensToDeduct * 1e18).send({ from: process.env.OWNER_WALLET, gas: 3000000 });

//     return res.json({ success: true, message: "Token balance updated successfully" });
//   } catch (error) {
//     console.error("Error updating token balance:", error);
//     return res.status(500).json({ success: false, error: "Internal server error" });
//   }
// });



export default router;
