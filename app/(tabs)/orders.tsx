import PendingOrders from "@/components/mobileview/company/OrdersfromDistributor";
import { OrderFromShop } from "@/components/mobileview/distributer/OrderFromShop";
import OrderStatus from "@/components/mobileview/shopkeeper/OrderStatus";
import { useAuth } from "@/context/authContext";
import React from "react";

const Orders = () => {
  const { userInfo }: any = useAuth();
  return (
    <>
      {userInfo?.role === "company" && <PendingOrders />}
      {userInfo?.role === "distributor" && <OrderFromShop />}
      {userInfo?.role === "shopkeeper" && <OrderStatus />}
    </>
  );
};

export default Orders;
