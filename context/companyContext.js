import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './authContext.js';

const ProductContext = createContext(undefined);

export const ProductProvider = ({ children }) => {
  const { access_token } = useAuth();
  const [products, setProducts] = useState([]);
  const [distributorCompanyStocks, setDistributorCompanyStocks] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const loadOrderedProducts = async () => {
    const response = await axios.get("http://localhost:5000/api/products", {
      headers: { Authorization: `${access_token}` },
    });
    setProducts(response.data);
  }

  const loadcompanyProducts = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/distributor_company_stocks",
      {
        headers: { Authorization: `${access_token}` },
      }
    );
    setDistributorCompanyStocks(response.data);
  };


  return (
    <ProductContext.Provider value={{ selectedProduct, setSelectedProduct, loadcompanyProducts, distributorCompanyStocks, loadOrderedProducts, products }}>
      {children}
    </ProductContext.Provider>
  );
};



export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within an ProductProvider");
  }
  return context;
};

export default ProductContext;
