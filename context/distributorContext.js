import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
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
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => { console.log(query); setProducts([]) }, [query])
  const fetchProducts = async (page) => {
    try {
      if (!access_token) return;
      setLoading(true);
      const response = await axios.get(`https://esybulkback-production.up.railway.app/api/distributor/products?page=${page}&query=${query}`, {
        headers: { Authorization: `${access_token}` },
      });
      setProducts((prev) => [...prev, ...response.data.products]);
      setCurrentPage(response.data.currentPage);
      setSearchProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error fetching products.'
      });
    }
  };

  useEffect(() => { if (access_token) { fetchProducts(1); fetchCart(); } }, [access_token])

  useEffect(() => { setProducts([]); fetchProducts(1) }, [query])

  const [searchcurrentPage, setSearchCurrentPage] = useState(1);
  const [searchtotalPages, setSearchTotalPages] = useState(0);
  const [searchproducts, setSearchProducts] = useState([]);
  const [previousSearchText, setPreviousSearchText] = useState("");
  useEffect(() => { setProducts([]); setSearchProducts([]); setCurrentPage(1); setSearchCurrentPage(1); }, [access_token])
  const handleSearchSubmit = async () => {
    try {
      if (previousSearchText != searchText) {
        setSearchProducts([]);
        setSearchCurrentPage(1);
        setPreviousSearchText(searchText);
      }
      setLoading(true);
      const response = await axios.get(
        `https://esybulkback-production.up.railway.app/api/search?search=${searchText}&page=${currentPage}`,
        {
          headers: { Authorization: `${access_token}` },
        }
      );
      setSearchProducts(response.data.products);
      setSearchCurrentPage(response.data.currentPage + 1);
      setSearchTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error fetching products'
      });
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get("https://esybulkback-production.up.railway.app/api/distributor/cart",
        { headers: { Authorization: `${access_token}` } })
      setCart(response.data.cartItems);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error fetching cart'
      });
    }
  }

  const addToCart = async (product) => {
    try {
      const response = await axios.post("https://esybulkback-production.up.railway.app/api/distributor/addremovecart",
        { product },
        { headers: { Authorization: `${access_token}` } });
      fetchCart();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error adding or removing from cart'
      });
    }

  }



  return (
    <DistributorContext.Provider value={{
      fetchProducts,
      setQuery,
      searchproducts,
      setSearchProducts,
      searchcurrentPage,
      setSearchCurrentPage,
      searchtotalPages,
      setSearchTotalPages,
      setCurrentPage,
      setProducts,
      searchText,
      setSearchText,
      handleSearchSubmit,
      selectForSell,
      setSelectForSell,
      addToCart,
      products,
      cart,
      totalPages,
      currentPage,
      loading
    }}>
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