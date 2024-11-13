import { PendingFromDistributor } from "@/components/mobileview/company/PendingFromDistributor";
import { OrderFromShop } from "@/components/mobileview/distributer/OrderFromShop";
import OrderStatus from "@/components/mobileview/shopkeeper/OrderStatus";
import { useAuth } from "@/context/authContext";
import React from "react";

const profile = () => {
  const { userInfo }: any = useAuth();
  return (
    <>
      {userInfo?.role === "company" && <PendingFromDistributor />}
      {userInfo?.role === "distributor" && <OrderFromShop />}
      {userInfo?.role === "shopkeeper" && <OrderStatus />}
    </>
  );
};

export default profile;
