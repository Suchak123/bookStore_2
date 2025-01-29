import dotenv from 'dotenv';
import { Web3 } from 'web3';
import LoyaltyTokenABI from '../abis/LoyaltyToken.json' assert { type: "json" };


dotenv.config();


const web3 = new Web3("https://eth-sepolia.g.alchemy.com/v2/LBUArw0Kxp7RZD3KDiHwmt1g42LstQ4y");

const contractAddress1 = process.env.CONTRACT1_ADDRESS;

const contractAddress2 = process.env.CONTRACT2_ADDRESS;

const contractABI = LoyaltyTokenABI
const loyaltyToken = new web3.eth.Contract(contractABI, contractAddress1);

const walletManager = new web3.eth.Contract(contractABI, contractAddress2);

export {
    web3,
    loyaltyToken,
    walletManager,
}

