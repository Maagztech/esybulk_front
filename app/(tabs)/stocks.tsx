import {
  default as CompanyStatistics
} from "@/components/mobileview/company/Statistics";
import Stocks from "@/components/mobileview/distributer/Stocks";
import ShopStatistics from "@/components/mobileview/shopkeeper/Statistics";
import { useAuth } from "@/context/authContext";
import React from "react";

const StastsAndStocks = () => {
  const { userInfo }: any = useAuth();
  return (
    <>
      {userInfo?.role === "company" && <CompanyStatistics />}
      {userInfo?.role === "distributor" && <Stocks />}
      {userInfo?.role === "shopkeeper" && <ShopStatistics />}
    </>
  );
};

export default StastsAndStocks;
