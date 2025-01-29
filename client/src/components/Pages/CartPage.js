import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../Layout/Layout";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import calculateReward
 from "../../utils/calculateReward";
import {
  faCircleLeft,
  faGift,
  faHeart,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
// import { Checkbox } from "antd";
import { toast } from "react-toastify";
import DropIn from "braintree-web-drop-in-react";
import { useWishlist } from "../../context/wishlist";
import { connectWallet, ApproveTokens } from "../../utils/connectWallet";

import BookShelfImg from "../../assets/images/books-bookshelf-isolated-vector.png";
// import { set } from "mongoose";
import Web3 from "web3";
// import { applyDiscount, checkDiscountStatus, useDiscountStatus } from "./Discount";


const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, saveCart] = useCart();
  const [productQuantities, setProductQuantities] = useState({});
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [wishlist, setWishlist]   = useWishlist();
  const [tokenBalance, setTokenBalance] = useState(0);
  const [appliedTokens, setAppliedTokens] = useState(0);
  
  const navigate = useNavigate();

  const getUsersCartKey = `cart_${auth?.user?._id }`;

  const fetchCart = () => {
    const userCart = localStorage.getItem(getUsersCartKey);
    // const discountApplied = localStorage.getItem("discountApplied") === "true";

    saveCart(userCart ? JSON.parse(userCart) : []);

    // if(discountApplied){
    //   cart = cart.map((item) => {
    //     if(!item.discountedPrice) {
    //     }
    //   })
    // }
  };
 
  const burnTokens = async (tokensToBurn) => {
    const userAddress = auth?.user?.walletAddress;
  
    try {
      if(!userAddress){
        toast.error("UserAddress not found or null");
        return;
      }
      
      // const hasAppliedDiscount = await checkDiscountStatus(userAddress);
      // if(hasAppliedDiscount){
      //   toast.error("You have already applied a discount");
      //   return;
      // }

      const web3 = new Web3(window.ethereum);
      
      const response = await axios.post("/api/v1/book/burnTokens", {
        address: userAddress,
        tokensToBurn,
      });

      console.log("Burn response: ", response.data);
  
      if (response.data.success && response.data.tx) {
        
        const { to, gas, data } = response.data.tx;
        console.log("Transaction response: ", response.data.tx);
  
        // Request wallet to sign and send the transaction
        const tx = {
          from: userAddress,
          to: to,
          gas: gas,
          data: data,
        };
      
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [tx],
        });

        console.log("Transaction Hash:", txHash);
        toast.success(`Tokens burned successfully! Transaction Hash: ${txHash}`);
          
      } else {
        toast.error(response.data.message || "Invalid response from server.");
      }
    } catch (err) {
      console.error("Error burning tokens:", err);
      if (err.code === 4001) {
        toast.error("Transaction rejected by the user.");
      } else {
        toast.error(err.message || "Failed to burn tokens. Please try again.");
      }
    }
  };

  // const TokenBurnInput = ({ tokenBalance }) => {
  //   const walletAddress = auth?.user?.walletAddress;
  //   const { hasAppliedDiscount, loading: discountCheckLoading } = useDiscountStatus(walletAddress)
  
  //   const handleBurnTokens = async () => {
  //     if (!walletAddress) {
  //       toast.error("Please connect your wallet first");
  //       return;
  //     }
  
  //     if (appliedTokens > tokenBalance) {
  //       toast.error("You cannot apply more tokens than you have.");
  //       return;
  //     }
  
  //     if (appliedTokens < 1) {
  //       toast.error("Please enter valid number of tokens.");
  //       return;
  //     }
  
  //     if (hasAppliedDiscount) {
  //       toast.error("You have already applied a discount");
  //       return;
  //     }
  
  //     setLoading(true);
  //     try {
  //       await burnTokens(appliedTokens);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  
  
  const fetchTokenBalance = async () => {
    const userAddress = auth?.user?.walletAddress;
    if (userAddress) {
      try {
        const { data } = await axios.get(`/api/v1/book/getBalance?address=${userAddress}&timestamp=${Date.now()}`);
        setTokenBalance(data.balance);
        console.log("Fetched balance: ", data.balance);
        
      } catch (error) {
        console.error("Error fetching token balance:", error);
        toast.error("Failed to fetch token balance.");
      }
    }
  };

  // const resetDiscountAfterOrder = async () => {
  //   const userAddress = auth?.user?.walletAddress;
  //   try {
  //     // Reset backend state
  //     await axios.post("/api/v1/user/resetDiscount", { walletAddress: userAddress });
      
  //     // Clear frontend state
  //     localStorage.removeItem("discountApplied");
  //     localStorage.removeItem("burnedTokensAmount");
      
  //   } catch (error) {
  //     console.error("Error resetting discount:", error);
  //   }
  // };

  const connectUserWallet = async () => {
    try {
      const token = auth?.token;
      const storedWalletAddress = auth?.user?.walletAddress;

      if(!token){
        console.error("No token was found");
        toast.error("No token found");
        return null;
      }
      const address = await connectWallet();

      if(!address){
        console.error("No wallet address returned");
        toast.error("Failed to connect wallet");
        return null;
      }

      if(storedWalletAddress && address !== storedWalletAddress){
        console.error(`Validation error: Connected wallet ${address} does not match stored wallet ${storedWalletAddress}`);
        toast.error("Connected wallet address does not match account's registered wallet address.");
        return null;
      }
      toast.success("Wallet successfully linked to account");
      
    } catch (error) {
      toast.error( error.response?.data?.message ||"Wallet connection failed.", error);
    }
};
  
  

  // const handleTokenReward = async () => {
  //   const userAddress = auth?.user?.walletAddress;
  
  //   if (!userAddress) {
  //     toast.error("Wallet address is not connected. Please connect your wallet.");
  //     return;
  //   }
  
  //   try {
  //     const rewardTokens = calculateReward(cart);
  //     await axios.post("/api/v1/book/mintTokens", {
  //       userAddress,
  //       amount: rewardTokens,
  //     });
  //     toast.success(`Successfully rewarded ${rewardTokens} tokens to your wallet.`);
  //   } catch (error) {
  //     console.error("Error rewarding tokens:", error);
  //     toast.error("Failed to reward tokens. Please try again.");
  //   }
  // };
  
  
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total += (item.price ?? 0) * item.numberOfItems;
      });

      const discount = appliedTokens;
    
      const discountedValue = discount;
      total = total - discountedValue;
      
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "NRs",
      });
    } catch (error) {
      console.log(error);
      return "Error calculating total"
    }
  };

  const removeCartItem = (productId) => {
    try {
      let updatedCart = cart.filter((item) => item._id !== productId);
      saveCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.log(error);
    }
  };

  const updateQuantity = (productId, action) => {
    const updatedCart = cart.map((item) => {
      if (item._id === productId) {
        if (action === "increment") {
          return { ...item, numberOfItems: item.numberOfItems + 1 };
        } else if (action === "decrement" && item.numberOfItems > 1) {
          return { ...item, numberOfItems: item.numberOfItems - 1 };
        }
      }
      return item;
    });

    saveCart(updatedCart);
  };

  // const handleGiftWrapChange = (e) => {
  //   setIsGiftWrap(e.target.checked);
  // };

  const goBack = () => {
    navigate(-1);
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/book/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCart();
    getToken();
    fetchTokenBalance();

  }, [auth?.user]);
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/v1/auth/profile");
        setAuth({
          ...auth,
          user: response.data.user,
        });
        
      } catch (error) {
        console.error("Error fetching user profile", error.message);
      }
    };
    fetchUserData();
  }, []);

  
  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);

      const totalBooks = cart.reduce((acc, item) => acc + item.numberOfItems, 0);
      console.log(totalBooks);

      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/book/braintree/payment", {
        nonce,
        cart,
      });

      // const purchaseReward = cart?.price;
      const rewardTokens = calculateReward(cart);
      const userAddress = auth?.user?.walletAddress; 
      if (userAddress) {
        await axios.post("/api/v1/book/mintTokens", {
          userAddress,  
          amount: rewardTokens, 
        });
        toast.success(`You have earned ${rewardTokens} tokens!`);
      }
      
      // if (appliedTokens > 0) {
      //   await axios.post("/api/v1/book/updateTokenBalance", {
      //     address: userAddress,
      //     tokensToDeduct: appliedTokens,
      //   });
      //   toast.success(`You have earned ${rewardTokens} tokens and used ${appliedTokens} tokens as a discount!`);

      //   const { data: updatedBalance } = await axios.get(`/api/v1/book/getBalance?address=${userAddress}`);

      //   setTokenBalance(updatedBalance.balance); // Update local balance
      // }
      // setLoading(false);


      localStorage.removeItem(getUsersCartKey);
      saveCart([]);
      // await updateProductQuantities();
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if(auth?.user?.walletAddress) fetchTokenBalance();
  }, [auth?.user?.walletAddress]);

  // const refreshTokenBalance = async () => {
  //   try {
  //     const userAddress = auth?.user?.walletAddress;
  //     if (userAddress) {
  //       const { data } = await axios.get(`/api/v1/books/getBalance?address=${userAddress}`);
  //       setTokenBalance(data.balance);
  //     }
  //   } catch (error) {
  //     console.error("Error refreshing token balance:", error);
  //   }
  // };

  // const connectUserWallet = async () => {
  //   try {
  //     const address = await connectWallet(setAuth);
  //     toast.success(`Wallet connected: ${address}`);
  //   } catch (error) {
  //     toast.error("Wallet connection failed.");
  //   }
  // };


  const handleAddToWishlist = (p) => {
    const updatedWishlist = [...wishlist];
    const existingProduct = updatedWishlist.find((item) => item._id === p._id);
    if (existingProduct) {
      existingProduct.numberOfItems += 1;
    } else {
      updatedWishlist.push({
        _id: p._id,
        name: p.name,
        author: p.author.name,
        price: p.price,
        numberOfItems: 1,
      });
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    toast.success("Book added to wishlist");
  };

  const updateProductQuantities = async () => {
    try {
      await Promise.all(
        cart.map(async (item) => {
          console.log("Updating quantity for item:", item);
          const quantityToBuy = item.numberOfItems;
          await axios.put("/api/v1/book/updateStock", {
            slug: item.slug,
            quantityToBuy: quantityToBuy,
          });
          console.log("Product quantity updated successfully for item:", item);
        })
      );

      console.log("Product quantities updated successfully");
    } catch (error) {
      console.error("Error updating product quantities:", error);
    }
  };


  useEffect(() => {
    const fetchProductQuantities = async () => {
      try {
        const bookIds = cart.map((item) => item._id);
        const response = await axios.post("/api/v1/book/getQuantities", {
          bookIds,
        });
        const quantities = response.data.quantities;
       
        setProductQuantities(quantities);
      } catch (error) {
        console.error("Error fetching product quantities:", error);
      }
    };

    fetchProductQuantities();
  }, [cart]);

  return (
    <Layout>
      <button className="m-4" onClick={goBack}>
        <FontAwesomeIcon
          icon={faCircleLeft}
          style={{ color: "#004480", height: "40px", margin: "4px" }}
        />
      </button>
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row justify-around">
          <div className="w-full lg:w-3/5">
            <div className="flex justify-between items-end mb-6">
              <h4 className="bona md:text-xl text-sm text-blue-700 mb-4">
                {cart?.length ? (
                  <>
                    <h2 className="sky-color text-3xl mb-2">Book Bag </h2>
                    You have{" "}
                    <span className="font-bold">
                      {cart.length}&nbsp;books
                    </span>{" "}
                    in your bag {auth?.token ? "" : "Please login to checkout"}
                  </>
                ) : (
                  <>
                    <p className="sky-color text-center text-3xl">
                      Your cart is empty.
                    </p>
                    <div className="mb-5 genres w-[60vw] mx-auto flex flex-col justify-center items-center">
                      <img src={BookShelfImg} />
                      <button className="text-white bg-blue-800 hover:bg-blue-900 md:text-xl text-lg md:p-5 p-1 rounded-lg font-semibold">
                        <Link to={"/AllBooks"}>
                          Browse Our Selection of Books
                        </Link>
                      </button>
                    </div>
                  </>
                )}
              </h4>
            </div>
            <div>
              {cart?.map((p) => (
                <div
                  key={p._id}
                  className="flex justify-between border-b border-blue-800 py-2"
                >
                  <div className="flex">
                    <div className="py-4 md:px-4 px-1">
                      <img
                        src={`/api/v1/book/book-photo/${p._id}`}
                        alt={p.name}
                        className="md:w-[130px] w-[100px] h-full rounded-md shadow-lg"
                      />
                    </div>
                    <div className="flex flex-col justify-between py-4 md:px-4 px-2">
                      <div className="flex flex-col">
                        <span className="font-bold md:text-2xl text-lg">
                          {p.name}
                        </span>
                        <span className="text-gray-600 md:text-xl text-base">
                          {p.author}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="border border-gray-300 rounded-md shadow-lg md:text-2xl text-xl">
                          <button
                            className="md:px-2 px-1 md:py-1 py-0"
                            onClick={() => updateQuantity(p._id, "decrement")}
                          >
                            -
                          </button>
                          <span className="md:mx-4 mx-2 md:text-xl text-lg font-semibold">
                            {p.numberOfItems}
                          </span>
                          <button
                            className="md:px-2 px-1 md:py-1 py-0"
                            onClick={() => updateQuantity(p._id, "increment")}
                            disabled={
                              productQuantities[p._id] - p.numberOfItems === 0
                            }
                          >
                            +
                          </button>
                        </div>
                        {productQuantities[p._id] - p.numberOfItems === 0 && (
                          <span className="text-red-800 ml-2 text-base">
                            No more left in stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-lg">
                    Your Token Balance: <span className="font-bold">{tokenBalance || 0} Tokens</span>
                    </h4>
                    
                  </div>
      
                  <div className="flex flex-col justify-between items-end my-4">
                    <div className="md:text-2xl text-lg font-bold">
                      NRs. {(p.price ?? 0).toFixed(2)}
                    </div>
                    <div className="flex xl:flex-row flex-col gap-2 items-end">
                      <button
                        className="text-blue-800 hover:text-blue-900 font-semibold flex gap-1 items-center md:text-sm text-xs"
                        onClick={() => removeCartItem(p._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} className="" />
                        Remove
                      </button>
                      <button
                        className="text-blue-800 hover:text-blue-900 font-semibold flex gap-1 items-center md:text-sm text-xs"
                        onClick={() => handleAddToWishlist(p)}
                      >
                        <FontAwesomeIcon icon={faHeart} className="" />
                        Add to Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/4 lg:pl-4 mt-4 lg:mt-0">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="border-b border-blue-800 py-4">
                <h2 className=" text-sky-900 text-2xl font-semibold mb-4">
                  Order Summary
                </h2>
                <h4 className="flex justify-between text-xl mb-2">
                  <span className="text-black-600 text-lg">Subtotal</span>
                  <span className="font-bold text-blue-900">
                    {totalPrice()}
                  </span>
                </h4>
                <h4>Your Token Balance: {tokenBalance}</h4>

              </div>
              
              {auth?.user?.address ? (
                <div className="flex flex-col">
                  <h4 className="text-lg mb-2">
                    Current Address:{" "}
                    <span className="font-bold text-blue-900">
                      {auth?.user?.address}
                    </span>
                  </h4>
                  <button
                    className="bg-sky-900 text-white px-4 py-2 rounded mt-2"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                  <button
                    className="bg-sky-900 text-white px-4 py-2 rounded mt-2"
                    onClick={() => setCheckout(true)}
                  >
                    Checkout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col">
                  {auth?.token ? (
                    <button
                      className="bg-blue-700 text-white px-4 py-2 rounded mt-2"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="bg-blue-800 text-white px-4 py-2 rounded mt-2"
                      onClick={() => navigate("/login", { state: "/cart" })}
                    >
                      Please Login to Checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">
                {checkout &&
                  (!clientToken || !cart?.length ? (
                    ""
                  ) : (
                    <>
                      <DropIn
                        options={{
                          authorization: clientToken,
                          paypal: {
                            flow: "vault",
                          },
                        }}
                        onInstance={(instance) => setInstance(instance)}
                      />
                      <button className="bg-sky-800 text-white px-4 py-2 rounded mt-2" onClick={
                        () => connectUserWallet()}
                      >Connect Wallet</button>

                      <button
                        className="bg-sky-800 text-white px-4 py-2 rounded mt-2"
                        onClick={handlePayment}
                        disabled={loading || !instance || !auth?.user?.address}
                      >
                        {loading ? "Processing..." : "Make Payment"}
                      </button>
                      <div className="mt-4">
                      <h4 className="text-lg">
                        Apply Tokens for Discount:
                        <input
                          type="number"
                          min="1"
                          max={tokenBalance}
                          value={appliedTokens}
                          onChange={(e) => {
                            const value = Number(e.target.value)
                            if (value > tokenBalance){
                              toast.error("You cannot apply more tokens than you have.");
                          
                            }
                            setAppliedTokens(value)
                          }}
                          className="ml-2 border rounded-md p-1"
                        />
                        <button
                          className="bg-sky-800 text-white px-4 py-2 rounded ml-2 "
                          
                          onClick={() => {
                            
                            if(appliedTokens > tokenBalance){
                              toast.error("You cannot apply more tokens than you have.")
                              return;
                            }
                            if(appliedTokens < 1){
                              toast.error("Please enter valid number of tokens.");
                              return;
                            }
                            burnTokens(appliedTokens)
                          }}
                        >Apply Discount</button>
                      </h4>
                    </div>

                    </>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};


export default CartPage;
