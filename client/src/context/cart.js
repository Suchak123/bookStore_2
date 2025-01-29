import { useState, useContext, createContext, useEffect } from "react";
import { useAuth} from './auth'
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [auth, setAuth] = useAuth();

  const cartKey = `cart_${auth?.user?._id}`;

  useEffect(() => {
    let existingCartItem = localStorage.getItem(cartKey);
    if (existingCartItem) setCart(JSON.parse(existingCartItem));
  }, [cartKey]);

  const saveCart = (updatedCart) => {
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    setCart(updatedCart);
  }
  return (
    <CartContext.Provider value={[cart, saveCart]}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
