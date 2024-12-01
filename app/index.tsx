import { GetUserData } from "@/utils/user";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import SignIn from "./(auth)/SignIn";
import "@/global.css";

const Index = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    GetUserData().then((data) => setUser(data));
  }, []);

  if (!user) {
    return (
      <>
        <SignIn />
        <Toast />
      </>
    );
  } else {
    return (
      <>
        <Redirect href="/home" />
        <Toast />
      </>
    );
  }
};

export default Index;
