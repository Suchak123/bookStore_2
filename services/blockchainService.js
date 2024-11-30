import { web3, contract } from "../config/blockchain";

// Function to mint tokens (Admin only)
export const mintTokens = async (to, amount) => {
  try {
    const accounts = await web3.eth.getAccounts();
    const tx = await contract.methods.mint(to, amount).send({ from: accounts[0] });
    console.log("Tokens minted:", tx);
    return tx;
  } catch (error) {
    console.error("Error minting tokens:", error);
  }
};

// Function to burn tokens
export const burnTokens = async (from, amount) => {
  try {
    const accounts = await web3.eth.getAccounts();
    const tx = await contract.methods.burn(from, amount).send({ from: accounts[0] });
    console.log("Tokens burned:", tx);
    return tx;
  } catch (error) {
    console.error("Error burning tokens:", error);
  }
};

// Get token balance
export const getTokenBalance = async (address) => {
  try {
    const balance = await contract.methods.balanceOf(address).call();
    console.log("Token Balance:", balance);
    return balance;
  } catch (error) {
    console.error("Error getting balance:", error);
  }
};
