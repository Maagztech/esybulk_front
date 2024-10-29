import YourProducts from "@/components/mobileview/company/yourProducts";
import OrderStatus from "@/components/mobileview/shopkeeper/OrderStatus";
import React from "react";
import { useSelector } from "react-redux";

const profile = () => {
  const type = useSelector((state: any) => state?.auth?.user?.type);
  return (
    <>
      {(type === "company" || true) && <YourProducts />}
      {type === "shopkeeper" && <OrderStatus />}
    </>
  );
};

export default profile;
