import TabIcon from "@/components/TabIcon";
import { icons, images } from "@/constants";
import { Card, Layout, Text } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
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
  return (
    <SafeAreaView className="bg-[#F7F9FC] h-full">
      <StatusBar backgroundColor="#F7F9FC" />
      <ScrollView>
        <Layout className="p-4 h-full w-full overflow-y-auto" level="2">
          <Card style={styles.card}>
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
                <Card style={styles.card} className="w-full mb-2">
                  <Text>练习天数: 0</Text>
                </Card>
                <Card style={styles.card} className="w-full mt-2">
                  <Text>历史平均分: 0</Text>
                </Card>
              </View>
            </View>
          </Card>
          <Card style={styles.card} className="mt-4">
            <View className="flex-row items-center w-full justify-around">
              <TabIcon icon={icons.book} name="开始练习" />
              <TabIcon icon={icons.history} name="开始练习" />
              <TabIcon icon={icons.more} name="开始练习" />
            </View>
          </Card>
          <Card style={styles.card} className="mt-4">
            <View>
              <LinearGradient
                style={styles.ArticleCard}
                // Background Linear Gradient
                colors={["#E0F7FF","#E8EAFF","#F0E8FF","#F0E8FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 2 }}
              >
                <View className="mb-16 pl-8 pt-2">
                  <Text category="h6">散 文</Text>
                </View>
              </LinearGradient>
              <LinearGradient
                style={styles.ArticleCard}
                // Background Linear Gradient
                colors={["#E0F7FF","#E8EAFF","#F0E8FF","#F0E8FF","#F0E8FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 2 }}
              >
                <View className="mb-16 pl-8 pt-2">
                  <Text category="h6">古 代 诗 词</Text>
                </View>
              </LinearGradient>
              <LinearGradient
                style={styles.ArticleCard}
                // Background Linear Gradient
                colors={["#E0F7FF","#E8EAFF","#F0E8FF","#F0E8FF","#F0E8FF","#F0E8FF","#F0E8FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 2 }}
              >
                <View className="mb-16 pl-8 pt-2">
                  <Text category="h6">现 代 诗 词</Text>
                </View>
              </LinearGradient>
            </View>
          </Card>
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
  },
  ArticleCard: {
    borderRadius: 8,
    marginVertical: 8,
  }
});

export default Home;
