import axios from 'axios';
import React, { createContext, useContext } from 'react';
import { useAuth } from './authContext.js';

const ProductContext = createContext(undefined);

export const ProductProvider = ({ children }) => {
  const { idtoken } = useAuth();
  const [products, setProducts] = useState([]);
  const loadOrderedProducts = async () => {
    const response = await axios.get("http://localhost:5000/api/products", {
      headers: { Authorization: `${idtoken}` },
    });
    setProducts(response.data);
  }
  return (
    <ProductContext.Provider value={{ loadOrderedProducts, products }}>
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
