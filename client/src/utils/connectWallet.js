import Web3 from "web3";

export const connectWallet = async (setAuth) => {
  if (window.ethereum) {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      setAuth((prev) => ({
        ...prev,
        user: { ...prev.user, walletAddress: accounts[0] },
      }));
      return accounts[0];
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw new Error("Wallet connection failed.");
    }
  } else {
    alert("MetaMask is not installed. Please install it to use this feature.");
  }
};
