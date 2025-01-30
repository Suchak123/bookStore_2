const REWARD_BASE = 100;
// const REWARD_RATE = 10;

const calculateReward = (cart) => {

  if(!Array.isArray(cart) || cart.length === 0){
    throw new Error("Cart must be a non-empty array");
  }

  const totalPurchaseAmount = cart.reduce((total, item) => {
    if(typeof item.price !== 'number' || typeof item.numberOfItems !== 'number'){
      throw new Error("Each item in the cart must have a valid price and number of Items");
    }
    return total + item.price * item.numberOfItems;
  }, 0);
    if(totalPurchaseAmount <= 0){
      throw new Error("Total Purchase amount must be greater than zero");
    }

    const rewardTokens = Math.floor((totalPurchaseAmount / REWARD_BASE));
    console.log("Reward tokens: ",rewardTokens);
    return rewardTokens > 0 ? rewardTokens : 0;
  };
  
  export default calculateReward;
  