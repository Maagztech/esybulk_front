import BusinessProfile from "@/components/mobileview/company/Profile";
import DistributerProfile from "@/components/mobileview/distributer/Profile";
import ShopkeeperProfile from "@/components/mobileview/shopkeeper/Profile";
import React from "react";
import { useSelector } from "react-redux";

const profile = () => {
  const type = useSelector((state: any) => state?.auth?.user?.type);
  return (
    <>
      {type === "company" || (true && <BusinessProfile />)}
      {type === "distributor" && <DistributerProfile />}
      {type === "shopkeeper" && <ShopkeeperProfile />}
    </>
  );
};

export default profile;
