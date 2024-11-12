import { PendingFromDistributor } from "@/components/mobileview/company/PendingFromDistributor";
import { OrderFromShop } from "@/components/mobileview/distributer/OrderFromShop";
import OrderStatus from "@/components/mobileview/shopkeeper/OrderStatus";
import { useAuth } from "@/context/authContext";
import React from "react";

const profile = () => {
  const { role }: any = useAuth();
  return (
    <>
      {role === "company" && <PendingFromDistributor />}
      {role === "distributor" && <OrderFromShop />}
      {role === "shopkeeper" && <OrderStatus />}
    </>
  );
};

export default profile;
