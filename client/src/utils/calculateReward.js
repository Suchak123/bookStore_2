const calculateReward = (cart) => {
    return cart.reduce((total, item) => total + item.price * item.numberOfItems, 0) * 0.05; 
  };
  
  export default calculateReward;
  