import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useAuth } from "@/context/authContext";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const { userInfo }: any = useAuth();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        headerShown: false,
        tabBarLabelPosition: "below-icon",
        tabBarLabelStyle: { fontSize: 10 },
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "cart" : "cart-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stocks"
        options={{
          title: userInfo?.role === "distributor" ? "Stocks" : "Stats",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={
                focused
                  ? userInfo?.role === "distributor"
                    ? "briefcase"
                    : "stats-chart"
                  : userInfo?.role === "distributor"
                  ? "briefcase-outline"
                  : "stats-chart-outline"
              }
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
