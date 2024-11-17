import React, { createContext, useContext, useState } from 'react';

const CompanyContext = createContext(undefined);

export const CompanyProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [distributorCompanyStocks, setDistributorCompanyStocks] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);



  return (
    <CompanyContext.Provider value={{ setDistributorCompanyStocks, selectedCompany, setSelectedCompany, distributorCompanyStocks, products }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within an CompanyProvider");
  }
  return context;
};

export default CompanyContext;
