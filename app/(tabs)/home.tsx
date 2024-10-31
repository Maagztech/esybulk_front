import { PendingFromDistributor } from "@/components/mobileview/company/PendingFromDistributor";
import ProductsToBuyNearby from "@/components/mobileview/shopkeeper/ProductsToBuyNearby";
import React from "react";
import { useSelector } from "react-redux";
import OrderFromShop from "../../components/mobileview/distributer/OrderFromShop";

const profile = () => {
  const type = useSelector((state: any) => state?.auth?.user?.type);
  return (
    <>
      {type === "company" && <PendingFromDistributor />}
      {type === "distributor" && <OrderFromShop />}
      {(type === "shopkeeper" || true) && <ProductsToBuyNearby />}
    </>
  );
};

export default profile;
