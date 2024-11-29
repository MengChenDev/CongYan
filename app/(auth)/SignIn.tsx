import { images } from "@/constants";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  Button,
  Icon,
  IconRegistry,
  Input,
  Text,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "@/global.css";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { LoginAPI } from "@/apis/user";
import { GetUserData, SetUserData } from "@/utils/user";
import CustomButton from "@/components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = () => {
  const [form, setForm] = useState({ account: "", password: "" });
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (props: any): React.ReactElement => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  );

  const handleLogin = () => {
    if (!form.account || !form.password) {
      Toast.show({
        type: "error",
        text1: "请输入账号和密码",
      });
      return;
    }

    setIsLoading(true);

    LoginAPI(form.account, form.password)
      .then(async (data) => {
        if (data.code === 200) {
          //router.push("Home");
          Toast.show({
            type: "success",
            text1: "登录成功",
            visibilityTime: 3000,
          });
          SetUserData(data.data);
        } else {
          Toast.show({
            type: "error",
            text1: data.message,
            visibilityTime: 3000,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <SafeAreaView className="bg-white h-full">
          <StatusBar translucent backgroundColor="transparent" />
          <ScrollView contentContainerStyle={{ height: "100%" }}>
            <View className="w-full justify-center items-center h-[85vh] px-4">
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
                  label="账号"
                  placeholder="用户名/邮箱"
                  value={form.account}
                  onChangeText={(nextValue) =>
                    handleChange("account", nextValue)
                  }
                />
                <Input
                  style={styles.input}
                  label="密码"
                  placeholder="6~20位"
                  accessoryRight={renderIcon}
                  value={form.password}
                  secureTextEntry={secureTextEntry}
                  onChangeText={(nextValue) =>
                    handleChange("password", nextValue)
                  }
                />
                <CustomButton
                  loading={isLoading}
                  className="mt-4"
                  onPress={handleLogin}
                >
                  登录
                </CustomButton>
                <View className="flex-row justify-between mt-4">
                  <Text onPress={() => router.push("/(auth)/ForgetPassword")}>
                    忘记密码？
                  </Text>
                  <Text status="primary" onPress={() => router.push("/SignUp")}>
                    注册账号
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
});

export default SignIn;
