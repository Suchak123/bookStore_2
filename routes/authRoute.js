import express from "express";
import AuthController from "../controllers/AuthController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import { linkWalletAddress } from "../controllers/walletController.js";

const router = express.Router();

router.post("/register", AuthController.registerController);

// router.get("/verify", AuthController.userVerifyMail);

router.post("/login", AuthController.loginController);

router.get("/test", requireSignIn, isAdmin, AuthController.testController);

router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//get users
router.get("/get-user", AuthController.getUsersController);

router.put("/profile", requireSignIn, AuthController.updateProfileController);

router.get("/orders", requireSignIn, AuthController.getOrdersController);

router.get("/all-orders", AuthController.getAllOrdersController);

router.post("/forget", AuthController.forgetLoad);

router.post("/reset-password", AuthController.resetPassword);

router.put(
  "/order-status/:orderId",
  requireSignIn,
  AuthController.orderStatusController
);

router.post('/link-wallet', requireSignIn,linkWalletAddress);

// router.put("/updateWallet", requireSignIn, async (req, res) => {
//   const { walletAddress } = req.body;
//   try {
//     const user = await UserModel.findByIdAndUpdate(
//       req.user._id, 
//       { walletAddress }, 
//       { new: true }
//     );
//     res.status(200).json({ success: true, user });
//   } catch (error) {
//     console.error("Error updating wallet address:", error);
//     res.status(500).json({ success: false, message: "Failed to update wallet address" });
//   }
// });


export default router;
