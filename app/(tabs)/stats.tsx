import CompanyStats from "@/components/mobileview/company/Statistics";
import ShopkeeperStats from "@/components/mobileview/shopkeeper/Statistics";
import React from "react";
import { useSelector } from "react-redux";
const profile = () => {
  const type = useSelector((state: any) => state?.auth?.user?.type);
  return (
    <>
      {type === "company" || (true && <CompanyStats />)}
      {type === "shopkeeper" && <ShopkeeperStats />}
    </>
  );
};

export default profile;
