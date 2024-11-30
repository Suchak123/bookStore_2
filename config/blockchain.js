import dotenv from 'dotenv';
import { Web3 } from 'web3';
import LoyaltyTokenABI from '../abis/LoyaltyToken.json' assert { type: "json" };


dotenv.config();


const web3 = new Web3("https://eth-sepolia.g.alchemy.com/v2/LBUArw0Kxp7RZD3KDiHwmt1g42LstQ4y");
const contractAddress = "0x1774D0d5039b5CFF13808d9fFC8eC959E18b5383";
const contractABI = LoyaltyTokenABI
const loyaltyToken = new web3.eth.Contract(contractABI, contractAddress);

export {
    web3,
    loyaltyToken,
}

