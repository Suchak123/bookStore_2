import Web3 from "web3";
import LoyaltyTokenABI from "../abis/LoyaltyToken.json";

import { toast } from "react-toastify";
import axios from "axios";
// import { response } from "express";


export const connectWallet = async () => {

  if(!window.ethereum) {
    alert("Metamask is not installed. Please install it to use the feature.");
    return null;
  }
    try {
      const credential = JSON.parse(localStorage.getItem("auth"));
      if(!credential || !credential.token || !credential.user) {
        toast.error("Authentication required. Please log in to connect your wallet.");
        return null;
      }

      const { token, user} = credential;
      const userId = user?._id;

      if(!userId){
        toast.error("User not found in authentication context");
        return null;
      }

      const web3 = new Web3(window.ethereum);

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      const walletAddress = accounts[0];

      if(!walletAddress) {
        toast.error("Failed to fetch wallet address. Please try again");
        return null;
      }

      if(!token){
        console.error("No token found");
        toast.error("No token found");
        return null;
      }

      return walletAddress;
  
      
      // const response = await axios.post(
      //   "/api/v1/auth/link-wallet",
      //   { walletAddress },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );


    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error(
        error.response?.data?.message || "Wallet connection failed."
      );
      return null;
    }
  
};

export const ApproveTokens = async (tokensToBurn, userAddress) => {
  const adminAddress = process.env.ADMIN_WALLET_ADDRESS; 
  const contractAddress = process.env.CONTRACT_ADDRESS;  
  if (!window.ethereum || !userAddress) {
    toast.error("Wallet not connected. Please connect your wallet.");
    return null;
  }

  try {
    const web3 = new Web3(window.ethereum);
    const loyaltyToken = new web3.eth.Contract(LoyaltyTokenABI, contractAddress);

    const amountInWei = web3.utils.toWei(tokensToBurn.toString(), "ether");

    const approvalTx = loyaltyToken.methods.approve(adminAddress, amountInWei);

    const result = await approvalTx.send({
      from: userAddress, 
    });

    console.log("Approval result:", result);
    toast.success("Tokens approved successfully");
    return amountInWei;
  } catch (error) { 
    console.error("Error approving tokens:", error);
    toast.error("Failed to approve tokens. Please try again.");
    return null;
  }
};

