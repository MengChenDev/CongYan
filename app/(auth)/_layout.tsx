import { Stack } from "expo-router";
import React from "react";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="SignIn" options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" options={{ headerShown: false }} />
      <Stack.Screen name="ForgetPassword" options={{ title: "忘记密码" }} />
      <Stack.Screen name="ResetPassword" options={{ title: "重置密码" }} />
    </Stack>
  );
};

export default AuthLayout;
