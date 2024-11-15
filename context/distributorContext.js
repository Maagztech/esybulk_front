import React, { createContext, useContext } from 'react';
import { useAuth } from './authContext.js';

const DistributorContext = createContext(undefined);

export const DistributorProvider = ({ children }) => {
  const { access_token } = useAuth();

  return (
    <DistributorContext.Provider value={{ selectedProduct, setSelectedProduct, loadcompanyProducts, distributorCompanyStocks, loadOrderedProducts, products }}>
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

export default ProductContext;
