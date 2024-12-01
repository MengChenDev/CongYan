import SmartTouchable from "@/components/SmartTouchable";
import TabIcon from "@/components/TabIcon";
import { icons, images } from "@/constants";
import { Card, Layout, Text } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  View,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";

const Home = () => {
  const handleTrainEntryPress = (type: number) => {
    router.push({
      pathname: "/train/list",
      params: { type },
    });
  };

  return (
    <SafeAreaView className="bg-[#F7F9FC] h-full">
      <ScrollView>
        <Layout className="p-4 h-full w-full overflow-y-auto" level="2">
          <Card style={styles.Card}>
            <View className="flex-row box-border justify-between items-center">
              <View
                className="w-[40%] aspect-square"
                style={{ borderRadius: "50%" }}
              >
                <Image
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                  source={images.AvatarBoy}
                />
              </View>
              <View className="w-[55%] flex justify-center items-start">
                <Card style={styles.Card} className="w-full mb-2">
                  <Text>练习天数: 0</Text>
                </Card>
                <Card style={styles.Card} className="w-full mt-2">
                  <Text>历史平均分: 0</Text>
                </Card>
              </View>
            </View>
          </Card>
          <Card style={styles.FunctionsCard} className="mt-4">
            <View className="flex-row items-center w-full justify-around">
              <View
                className="flex-1 m-[-8] rounded-full"
                style={{ overflow: "hidden" }}
              >
                <SmartTouchable onPress={() => handleTrainEntryPress(0)}>
                  <View className="p-[8] px-6">
                    <TabIcon icon={icons.book} name="开始练习" />
                  </View>
                </SmartTouchable>
              </View>
              <View
                className="flex-1 m-[-8] rounded-full"
                style={{ overflow: "hidden" }}
              >
                <SmartTouchable>
                  <View className="p-[8] px-6">
                    <TabIcon icon={icons.history} name="历史评估" />
                  </View>
                </SmartTouchable>
              </View>
              <View
                className="flex-1 m-[-8] rounded-full"
                style={{ overflow: "hidden" }}
              >
                <SmartTouchable>
                  <View className="p-[8] px-6">
                    <TabIcon icon={icons.more} name="更多" />
                  </View>
                </SmartTouchable>
              </View>
            </View>
          </Card>
          <Card style={styles.Card} className="mt-4">
            <View>
              <View style={styles.TextCard}>
                <LinearGradient
                  colors={["#E0F7FF", "#E8EAFF", "#F0E8FF", "#F0E8FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 2 }}
                >
                  <SmartTouchable
                    activeOpacity={0.5}
                    onPress={() => handleTrainEntryPress(0)}
                  >
                    <View>
                      <View className="mb-16 pl-8 pt-2">
                        <Text category="h6" style={{ letterSpacing: 8 }}>
                          散文
                        </Text>
                      </View>
                    </View>
                  </SmartTouchable>
                </LinearGradient>
              </View>
              <View style={styles.TextCard}>
                <LinearGradient
                  colors={[
                    "#E0F7FF",
                    "#E8EAFF",
                    "#F0E8FF",
                    "#F0E8FF",
                    "#F0E8FF",
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 2 }}
                >
                  <SmartTouchable
                    activeOpacity={0.5}
                    onPress={() => handleTrainEntryPress(1)}
                  >
                    <View>
                      <View className="mb-16 pl-8 pt-2">
                        <Text category="h6" style={{ letterSpacing: 8 }}>
                          古代诗词
                        </Text>
                      </View>
                    </View>
                  </SmartTouchable>
                </LinearGradient>
              </View>
              <View style={styles.TextCard}>
                <LinearGradient
                  colors={[
                    "#E0F7FF",
                    "#E8EAFF",
                    "#F0E8FF",
                    "#F0E8FF",
                    "#F0E8FF",
                    "#F0E8FF",
                    "#F0E8FF",
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 2 }}
                >
                  <SmartTouchable
                    activeOpacity={0.5}
                    onPress={() => handleTrainEntryPress(2)}
                  >
                    <View>
                      <View className="mb-16 pl-8 pt-2">
                        <Text category="h6" style={{ letterSpacing: 8 }}>
                          现代诗词
                        </Text>
                      </View>
                    </View>
                  </SmartTouchable>
                </LinearGradient>
              </View>
            </View>
          </Card>
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Card: {
    borderRadius: 8,
  },
  FunctionsCard: {
    borderRadius: 8,
  },
  TextCard: {
    overflow: "hidden",
    borderRadius: 8,
    marginVertical: 8,
  },
});

export default Home;
