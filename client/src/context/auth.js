import axios from "axios";
import { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  axios.defaults.headers.common["Authorization"] = auth?.token;
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      console.log("parsedata", parseData);
      setAuth({
        ...auth,
        user: {
          ...parseData.user,
          walletAddress: parseData.user?.walletAddress || "",
          isWalletConnected: !!parseData.user?.walletAddress,
        },
        token: parseData.token,
      });
    }
  }, []);

  // const updateWalletAddress = (walletAddress) => {
  //   setAuth((prevAuth) => {
  //     const updatedAuth = {
  //       ...prevAuth,
  //       user: {
  //         ...prevAuth.user,
  //         walletAddress,
  //         isWalletConnected: true,
  //       },
  //     };

  //     localStorage.setItem("auth", JSON.stringify(updatedAuth));
  //     return updatedAuth;
  //   });
  // };

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
