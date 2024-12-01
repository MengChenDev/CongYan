import TabIcon from "@/components/TabIcon";
import { icons } from "@/constants";
import { Tabs } from "expo-router";
import { StatusBar } from "react-native";

const TabsLayout = () => {
  return (
    <>
      <StatusBar backgroundColor="#F7F9FC" /> 
      <Tabs
        screenOptions={
          {
            // tabBarShowLabel: true,
            // tabBarActiveTintColor: "#FFA001",
            // tabBarInactiveTintColor: "#CDCDE0",
            // tabBarStyle: {
            //   backgroundColor: "#161622",
            //   borderTopWidth: 1,
            //   borderTopColor: "#232533",
            //   height: 84,
            // },
          }
        }
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "首页",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="consult"
          options={{
            title: "咨询",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.consult}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="mine"
          options={{
            title: "我的",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.mine}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
