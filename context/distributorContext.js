import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './authContext.js';
const DistributorContext = createContext(undefined);

export const DistributorProvider = ({ children }) => {
  const { access_token } = useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectForSell, setSelectForSell] = useState(null);

  useEffect(() => { if (access_token) { fetchProducts(1); fetchCart(); } }, [access_token])

  const fetchProducts = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/distributor/products?page=${page}`, {
        headers: { Authorization: `${access_token}` },
      });
      setProducts((prev) => [...prev, ...response.data.products]);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error fetching products");
    }
  };


  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/distributor/cart",
        { headers: { Authorization: `${access_token}` } })
      setCart(response.data.cartItems);
    } catch (error) {
      toast.error("Error fetching cart");
    }
  }

  const addToCart = async (product) => {
    try {
      const response = await axios.post("http://localhost:5000/api/distributor/addremovecart",
        { product },
        { headers: { Authorization: `${access_token}` } });
      fetchCart();
    } catch (error) {
      toast.error("Error adding or removing from cart");
    }

  }

  return (
    <DistributorContext.Provider value={{ selectForSell, setSelectForSell, addToCart, products, cart, totalPages, currentPage, loading }}>
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