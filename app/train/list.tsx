import { GetTrainTextByCategoryAPI, TrainTextVO } from "@/apis/train";
import SmartTouchable from "@/components/SmartTouchable";
import { TrainText } from "@/store/train";
import { Layout, List, Tab, TabBar, Text } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

const TrainTextTypes = ["prose", "ancient poetry", "modern poetry"];

const TrainListLayout = memo(({ type }: { type: number }) => {
  const [dataCache, setDataCache] = useState<{
    [key: number]: TrainText[];
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!dataCache[type]) {
        try {
          const response = await GetTrainTextByCategoryAPI(
            TrainTextTypes[type]
          );
          const fetchedData: TrainText[] = (response.data || []).map(
            (item: TrainTextVO) => ({
              title: item.title || "",
              author: item.author || "",
              text: item.text || "",
              category: item.category || "",
              suggestedDuration: item.suggestedDuration || "",
              applicablePeople: item.applicablePeople || "",
              grade: item.grade || "",
            })
          );
          setDataCache((prevCache) => ({ ...prevCache, [type]: fetchedData }));
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      }
    };

    fetchData();
  }, [type, dataCache]);

  const handleTrainCardPress = (item: TrainText) => {
    router.push({
      pathname: "/train/detail",
      params: { data: JSON.stringify(item) },
    });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: TrainText;
    index: number;
  }): React.ReactElement => (
    <View style={styles.TextCard}>
      <LinearGradient
        colors={["#E0F7FF", "#E8EAFF", "#F0E8FF", "#F0E8FF", "#F0E8FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 2 }}
      >
        <SmartTouchable
          activeOpacity={0.5}
          onPress={() => handleTrainCardPress(item)}
        >
          <View>
            <View className="mt-4 mb-12 pl-8 pt-2">
              <Text category="h6" style={{ letterSpacing: 8 }}>
                《{item.title}》
              </Text>
              <Text
                className="ml-2 mt-4"
                category="p1"
                style={{ letterSpacing: 8 }}
              >
                作者：{item.author}
              </Text>
            </View>
          </View>
        </SmartTouchable>
      </LinearGradient>
    </View>
  );

  return (
    <Layout className="h-full" level="2">
      <List
        className="box-border h-full px-4 pt-2"
        style={styles.listContainer}
        contentContainerStyle={{ paddingBottom: 64 }}
        data={dataCache[type] || []}
        renderItem={renderItem}
      />
    </Layout>
  );
});

const TrainListPage = () => {
  const { type } = useLocalSearchParams<{ type: string }>();
  const initialType = parseInt(type, 10);
  const [selectedIndex, setSelectedIndex] = useState(initialType);
  return (
    <Layout level="1" className="h-full">
      <TabBar
        selectedIndex={selectedIndex}
        onSelect={(index) => {
          setSelectedIndex(index);
        }}
      >
        <Tab title="散文" />
        <Tab title="古代诗歌" />
        <Tab title="现代诗歌" />
      </TabBar>
      <TrainListLayout type={selectedIndex} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: "transparent",
  },
  TextCard: {
    overflow: "hidden",
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default TrainListPage;
