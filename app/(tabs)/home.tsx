import { ProductsToBuyNearbydistributor } from "@/components/mobileview/distributer/ProductsToBuyNearby";
import ProductsToBuyNearby from "@/components/mobileview/shopkeeper/ProductsToBuyNearby";
import { useAuth } from "@/context/authContext";
import React from "react";
import { CompanyProducts } from './../../components/mobileview/company/yourProducts';
const profile = () => {
  const { role }: any = useAuth();
  return (
    <>
      {role === "company" && <CompanyProducts />}
      {role === "distributor" && <ProductsToBuyNearbydistributor />}
      {role === "shopkeeper" && <ProductsToBuyNearby />}
    </>
  );
};

export default profile;
