import User from "../models/UserModel.js";

export const linkWalletAddress = async(req, res) => {
    try{
        
        const { walletAddress, userId} = req.body;
       
        console.log(walletAddress);
        console.log(userId);

        // const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
        // if(!isValidAddress){
        //     return res.status(400).json({message: "Invalid Ethreum wallet address format. "});
        // }

        const existingUser = await User.findOne({ walletAddress, 
            _id: { $ne: userId},
        });
        if(existingUser) {
            return res.status(400).json({
                message: "This wallet address is already linked to another account.",
            });
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: "User not found "});
        }

        user.walletAddress = walletAddress;
        user.isWalletConnected = true;
        await user.save();

        res.status(200).json({
            message: "Wallet address linked successfully.",
            walletAddress: user.walletAddress,
        });
    } catch(error){
        console.error("Error linking wallet address:", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

