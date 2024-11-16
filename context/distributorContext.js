import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './authContext.js';
const DistributorContext = createContext(undefined);

export const DistributorProvider = ({ children }) => {
  const { access_token } = useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);


  useEffect(() => { if (access_token) { fetchProducts(); fetchCart(); } }, [access_token])


  const fetchProducts = async () => {
    const response = await axios.get("http://localhost:5000/api/distributor/products",
      { headers: { Authorization: `${access_token}` } })
    setProducts(response.data);
  }


  const fetchCart = async () => {
    const response = await axios.get("http://localhost:5000/api/distributor/cart",
      { headers: { Authorization: `${access_token}` } })
    setCart(response.data);
  }

  const addToCart = async (product) => {
    await axios.post("http://localhost:5000/api/distributor/cart",
      { product },
      { headers: { Authorization: `${access_token}` } })
    const response = await axios.get("http://localhost:5000/api/distributor/cart",
      { headers: { Authorization: `${access_token}` } })
    setCart(response.data);
  }

  return (
    <DistributorContext.Provider value={{ products, cart }}>
      {children}
    </DistributorContext.Provider>
  );
};

export const useDistributor = () => {
  const context = useContext(DistributorContext);
  if (!context) {
    throw new Error("useProduct must be used within an ProductProvider");
  }
  return context;
};

export default DistributorContext;
