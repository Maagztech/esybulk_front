import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Tabs } from "expo-router";
import React from "react";
import { useSelector } from "react-redux";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const type = useSelector((state: any) => state?.auth?.user?.type);
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
      {type !== "distributor" && (
        <Tabs.Screen
          name="products"
          options={{
            title: "Products",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "cart" : "cart-outline"}
                color={color}
              />
            ),
          }}
        />
      )}
      {type !== "distributor" && (
        <Tabs.Screen
          name="stats"
          options={{
            title: "Statistics",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "stats-chart" : "stats-chart-outline"}
                color={color}
              />
            ),
          }}
        />
      )}
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
