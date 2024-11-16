import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';

const CompanyContext = createContext(undefined);

export const CompanyProvider = ({ children }) => {
  const { access_token } = useAuth();
  const [products, setCompanys] = useState([]);
  const [distributorCompanyStocks, setDistributorCompanyStocks] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const loadOrderedCompanys = async () => {
    const response = await axios.get("http://localhost:5000/api/products", {
      headers: { Authorization: `${access_token}` },
    });
    setCompanys(response.data);
  }

  const loadcompanyCompanys = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/distributor_company_stocks",
      {
        headers: { Authorization: `${access_token}` },
      }
    );
    setDistributorCompanyStocks(response.data);
  };


  return (
    <CompanyContext.Provider value={{ selectedCompany, setSelectedCompany, loadcompanyCompanys, distributorCompanyStocks, loadOrderedCompanys, products }}>
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
