import CompanyStats from "@/components/mobileview/company/Statistics";
import ShopkeeperStats from "@/components/mobileview/shopkeeper/Statistics";
import { useAuth } from "@/context/authContext";
import React from "react";
const profile = () => {
  const { userInfo }: any = useAuth();
  return (
    <>
      {userInfo.role === "company" && <CompanyStats />}
      {userInfo.role === "shopkeeper" && <ShopkeeperStats />}
    </>
  );
};

export default profile;
