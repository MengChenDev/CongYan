import { RegisterAPI, RequestVerificationCodeAPI } from "@/apis/user";
import Caption from "@/components/Caption";
import CustomButton from "@/components/CustomButton";
import SecureInput from "@/components/SecureInput";
import { images } from "@/constants";
import "@/global.css";
import {
  validateEmail,
  validatePassword,
  validateUsername,
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
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    code: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    code: "",
  });

  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [countdown]);

  const validateForm = () => {
    const usernameError = validateUsername(form.username)
      ? ""
      : "用户名格式不正确";
    const emailError = validateEmail(form.email) ? "" : "邮箱格式不正确";
    const passwordError = validatePassword(form.password)
      ? ""
      : "密码格式不正确";
    const confirmPasswordError =
      form.password === form.confirmPassword ? "" : "两次输入的密码不一致";

    setErrors({
      username: usernameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      code: "", // Assuming code validation is not required here
    });

    return (
      !usernameError && !emailError && !passwordError && !confirmPasswordError
    );
  };

  const handleSignUp = () => {
    if (validateForm()) {
      RegisterAPI(form.email, form.code, form.username, form.password).then(
        (data) => {
          if (data.code === 200) {
            router.back();
          }
        }
      );
    }
  };

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "username" && !validateUsername(value)) {
      error = "用户名格式不正确";
    } else if (name === "email" && !validateEmail(value)) {
      error = "邮箱格式不正确";
    } else if (name === "password" && !validatePassword(value)) {
      error = "密码格式不正确";
    } else if (name === "confirmPassword" && value !== form.password) {
      error = "两次输入的密码不一致";
    }
    // 当原始密码修改时，确认密码也显示错误
    if (name === "password") {
      if (!validatePassword(value)) {
        error = "密码格式不正确";
      } else if (form.confirmPassword && value !== form.confirmPassword) {
        setErrors({ ...errors, confirmPassword: "两次输入的密码不一致" });
      }
    }

    setErrors({ ...errors, [name]: error });
  };

  const handleSendCode = () => {
    if (validateEmail(form.email)) {
      setIsSendingCode(true);
      // 发送验证码逻辑
      RequestVerificationCodeAPI(form.email, "register").then((data) => {
        if (data.code === 200) {
          setCountdown(60);
          setIsSendingCode(false);
        }
      });
    } else {
      setErrors({ ...errors, email: "邮箱格式不正确" });
    }
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
                  label="用户名"
                  placeholder="字母、数字或汉字，1~10个字符"
                  value={form.username}
                  caption={<Caption error={errors.username} />}
                  onChangeText={(nextValue) =>
                    handleChange("username", nextValue)
                  }
                />
                <SecureInput
                  label="密码"
                  placeholder="6~20位字符，区分大小写"
                  value={form.password}
                  caption={<Caption error={errors.password} />}
                  onChangeText={(nextValue) =>
                    handleChange("password", nextValue)
                  }
                />
                <SecureInput
                  label="确认密码"
                  placeholder="请再次输入密码"
                  value={form.confirmPassword}
                  caption={<Caption error={errors.confirmPassword} />}
                  onChangeText={(nextValue) =>
                    handleChange("confirmPassword", nextValue)
                  }
                />
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
                  <CustomButton
                    loading={isSendingCode}
                    appearance="outline"
                    className="flex-shrink-0"
                    style={styles.codeButton}
                    onPress={handleSendCode}
                    disabled={isSendingCode || countdown > 0}
                  >
                    {countdown == 0 ? "获取验证码" : countdown + "s"}
                  </CustomButton>
                </View>
                <Button className="mt-4" onPress={handleSignUp}>
                  注册
                </Button>
                <View className="flex-row justify-center mt-4">
                  <Text>已有账号？</Text>
                  <Text status="primary" onPress={() => router.back()}>
                    立即登录
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

export default SignUp;
