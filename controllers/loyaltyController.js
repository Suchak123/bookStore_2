// import { web3, loyaltyToken } from "../config/blockchain";

// export const mintTokens = async (req, res) => {
//   try {
//     const { to, amount } = req.body;
//     const accounts = await web3.eth.getAccounts();
//     const tx = await loyaltyToken.methods.mint(to, amount).send({ from: accounts[0] });
//     res.status(200).json({ success: true, message: "Tokens minted successfully", tx });
//   } catch (error) {
//     console.error("Error minting tokens:", error);
//     res.status(500).json({ success: false, message: "Error minting tokens", error });
//   }
// };

// export const burnTokens = async (req, res) => {
//   try {
//     const { from, amount } = req.body;
//     const accounts = await web3.eth.getAccounts();
//     const tx = await loyaltyToken.methods.burn(from, amount).send({ from: accounts[0] });
//     res.status(200).json({ success: true, message: "Tokens burned successfully", tx });
//   } catch (error) {
//     console.error("Error burning tokens:", error);
//     res.status(500).json({ success: false, message: "Error burning tokens", error });
//   }
// };

// export const getTokenBalance = async (req, res) => {
//   try {
//     const { address } = req.params;
//     const balance = await loyaltyToken.methods.balanceOf(address).call();
//     res.status(200).json({ success: true, balance });
//   } catch (error) {
//     console.error("Error getting balance:", error);
//     res.status(500).json({ success: false, message: "Error getting balance", error });
//   }
// };
