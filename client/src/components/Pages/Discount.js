// import { toast } from "react-toastify";
// import { useState, useEffect } from "react";
// import axios from "axios";

// export const applyDiscount = async(cart, tokenBalance, discountRate = 1) => {
//     const discountApplied = localStorage.getItem("discountApplied") === "true";

//     if(discountApplied){
//       toast.error("Discount already applied for this cart.");
//       return cart;
//     }

//    const updatedCart = cart.map((item) => {
//     const discountedPrice = item.price - item.price * discountRate;
//     return{
//         ...item,
//         discountedPrice: Math.max(0, discountedPrice),
//     };
//    });

//    toast.success("Discount applied successfully.");

//    return updatedCart;
// }

// export const checkDiscountStatus = async(walletAddress) => {
//     if(!walletAddress) {
//         console.error("Wallet address is required");
//         return false;
//     }

//     try {
//         const response = await axios.get("/api/v1/book/discountStatus", {
//             params: { walletAddress }
//         });

//         if(response.data.success) {
//             localStorage.setItem('discountStatus', response.data.hasAppliedDiscount);
//             return response.data.hasAppliedDiscount;
//         }

//         return false;
//     } catch (error) {
//         console.error("Error checking discount status:", error);

//         const cachedStatus = localStorage.getItem('discountStatus');
//         return cachedStatus === 'true';
//     }
// }

// export const useDiscountStatus = (walletAddress) => {
//     const [hasAppliedDiscount, setHasAppliedDiscount] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
  
//     useEffect(() => {
//       const checkStatus = async () => {
//         try {
//           setLoading(true);
//           const status = await checkDiscountStatus(walletAddress);
//           setHasAppliedDiscount(status);
//           setError(null);
//         } catch (err) {
//           setError(err.message);
//         } finally {
//           setLoading(false);
//         }
//       };
  
//       if (walletAddress) {
//         checkStatus();
//       }
//     }, [walletAddress]);
  
//     return { hasAppliedDiscount, loading, error };
//   };