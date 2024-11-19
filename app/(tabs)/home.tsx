import CompanyProducts from "@/components/mobileview/company/YourProducts";
import { ProductsToBuyNearbydistributor } from "@/components/mobileview/distributer/ProductsToBuyNearby";
import ProductsToBuyNearby from "@/components/mobileview/shopkeeper/ProductsToBuyNearby";
import { useAuth } from "@/context/authContext";
import React from "react";
const profile = () => {
  const { userInfo }: any = useAuth();
  return (
    <>
      {userInfo?.role === "company" && <CompanyProducts />}
      {userInfo?.role === "distributor" && <ProductsToBuyNearbydistributor />}
      {userInfo?.role === "shopkeeper" && <ProductsToBuyNearby />}
    </>
  );
};

export default profile;
