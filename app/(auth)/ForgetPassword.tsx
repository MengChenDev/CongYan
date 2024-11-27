import Caption from "@/components/Caption";
import { images } from "@/constants";
import "@/global.css";
import {
  validateEmail
} from "@/utils/validate";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  Button,
  IconRegistry,
  Input,
  Text,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgetPassword = () => {
  const [form, setForm] = useState({
    email: "",
    code: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    code: "",
  });

  const handleValidate = () => {
    router.replace("/(auth)/ResetPassword");
  };
  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });

    // 校验输入
    let error = "";
    if (name === "email" && !validateEmail(value)) {
      error = "邮箱格式不正确";
    }
    setErrors({ ...errors, [name]: error });
  };

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <SafeAreaView className="bg-white h-full">
          <StatusBar translucent backgroundColor="transparent" />
          <ScrollView contentContainerStyle={{ height: "100%" }}>
            <View className="w-full justify-center items-center h-[75vh] px-4">
              <View className="flex-row items-center mb-4">
                <Image
                  className="w-[60px] h-[60px]"
                  resizeMode="contain"
                  source={images.logoSmall}
                />
                <Text category="h1" className="ml-2">
                  聪言
                </Text>
              </View>
              <View className="justify-center w-[85%] mt-4">
                <Input
                  style={styles.input}
                  label="邮箱"
                  placeholder="请输入邮箱"
                  value={form.email}
                  caption={<Caption error={errors.email} />}
                  onChangeText={(nextValue) => handleChange("email", nextValue)}
                />
                <Text
                  category="label"
                  style={{ color: "#8F9BB3", marginTop: 4 }}
                >
                  验证码
                </Text>
                <View className="flex-row items-center justify-between">
                  <Input
                    style={[styles.input, { flex: 1, marginRight: 4 }]}
                    placeholder="请输入验证码"
                    value={form.code}
                    caption={<Caption error={errors.code} />}
                    onChangeText={(nextValue) =>
                      handleChange("code", nextValue)
                    }
                  />
                  <Button
                    className="flex-shrink-0"
                    style={styles.codeButton}
                    onPress={() => console.log("Get Code Pressed")}
                  >
                    获取验证码
                  </Button>
                </View>
                <Button className="mt-4" onPress={handleValidate}>
                  验证
                </Button>
                <View className="flex-row justify-center mt-4">
                  <Text>没有账号？</Text>
                  <Text
                    status="primary"
                    onPress={() => router.replace("/SignUp")}
                  >
                    立即注册
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ApplicationProvider>
    </>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
  },
  input: {
    marginVertical: 4,
  },
  codeButton: {
    paddingVertical: 8,
    height: 40,
  },
});

export default ForgetPassword;
