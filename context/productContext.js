import React, { createContext, useContext } from 'react';

const ProductContext = createContext(undefined);

export const ProductProvider = ({ children }) => {


  return (
    <ProductContext.Provider value={{  }}>
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
