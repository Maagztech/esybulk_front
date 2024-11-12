import BusinessProfile from "@/components/mobileview/global/Profile";
import React from "react";
import { useSelector } from "react-redux";

const profile = () => {
  const type = useSelector((state: any) => state?.auth?.user?.type);
  return <BusinessProfile />;
};

export default profile;
