import { Logout } from "@/utils/user";
import { Button, Layout } from "@ui-kitten/components";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

const Mine = () => {
  const handleLogout = () => {
    Logout();
    router.replace("/");
  };
  return (
    <SafeAreaView className="bg-[#F7F9FC] h-full">
      <ScrollView>
        <Layout className="p-4 h-full w-full overflow-y-auto" level="2">
          <Button appearance="outline" status="danger" onPress={handleLogout}>
            登出
          </Button>
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Mine;

const styles = StyleSheet.create({});
