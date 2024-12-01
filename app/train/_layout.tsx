import { Stack } from "expo-router";
import { StatusBar } from "react-native";

const TrainLayout = () => {
  return (
    <>
      <Stack>
        <StatusBar backgroundColor="#FFFFFF" />
        <Stack.Screen
          name="list"
          options={{ headerShown: true, title: "练习" }}
        />
        <Stack.Screen name="detail" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default TrainLayout;
