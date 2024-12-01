import { GetTTSAPI } from "@/apis/train";
import SmartTouchable from "@/components/SmartTouchable";
import { TrainText } from "@/store/train";
import {
  Card,
  Icon,
  IconElement,
  Layout,
  Spinner,
  Text,
  TopNavigation,
  TopNavigationAction,
  useTheme,
} from "@ui-kitten/components";
import { TouchableWebElement } from "@ui-kitten/components/devsupport";
import { Audio, AVPlaybackStatus } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { ImageProps, StyleSheet, View, ScrollView } from "react-native";

const BackIcon = (props: any): IconElement => (
  <Icon {...props} name="arrow-back-outline" />
);

const TrainDetailPage = () => {
  const { data } = useLocalSearchParams<{ data: string }>();
  const item: TrainText = JSON.parse(data);
  const theme = useTheme();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [playedTexts, setPlayedTexts] = useState<{
    [key: number]: Audio.Sound;
  }>({});
  const [loadingTexts, setLoadingTexts] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const renderBackAction = (): TouchableWebElement => (
    <TopNavigationAction onPress={handleBackPress} icon={BackIcon} />
  );

  const handleBackPress = async () => {
    // 修复安卓返回时音频继续播放的问题
    if (playingIndex !== null && playedTexts[playingIndex]) {
      await playedTexts[playingIndex].pauseAsync();
    }
    loadingTexts[-1] = true;
    setLoadingTexts({});
    router.back();
  };
  const handleTextPlay = async (key: number, text: string) => {
    if (loadingTexts[key]) {
      return;
    }
    if (
      playingIndex !== null &&
      playingIndex !== key &&
      playedTexts[playingIndex]
    ) {
      setIsPlaying(false);
      await playedTexts[playingIndex].pauseAsync();
      setPlayingIndex(null);
    }
    if (playedTexts[key]) {
      setPlayingIndex(key);
      setSelectedIndex(key);
      setIsPlaying(true);
      await playedTexts[key].replayAsync();
    } else {
      setLoadingTexts((prev) => ({ ...prev, [key]: true }));
      const res = await GetTTSAPI(text);
      const audioBase64 = res.data?.audioBase64;
      if (audioBase64) {
        const { sound } = await Audio.Sound.createAsync({
          uri: `data:audio/mp3;base64,${audioBase64}`,
        });
        sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            setPlayingIndex(null);
          }
        });
        setPlayedTexts((prev) => ({ ...prev, [key]: sound }));
        setPlayingIndex(key);
        setSelectedIndex(key);
        setIsPlaying(true);
        if (!loadingTexts[-1]) {
          await sound.playAsync();
        }
      }
      setLoadingTexts((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleRecordStart = () => {
    setIsRecording(true);
  };

  const handleRecordEnd = () => {
    setIsRecording(false);
  };
  return (
    <Layout className="h-full" level="1">
      <TopNavigation
        accessoryLeft={renderBackAction}
        alignment="center"
        title={item.title}
        subtitle={item.author}
      />
      <Layout level="2" className="flex-1 h-full">
        <ScrollView>
          <Layout level="2" className="flex-1 px-4 py-4">
            <Layout style={styles.TextCard}>
              {item.text.split("\n").map((line, index) => (
                <View key={index} className="flex-row items-center my-2">
                  <Text
                    onPress={() => {
                      handleTextPlay(index, line);
                      setSelectedIndex(index);
                    }}
                    status={
                      playingIndex === index
                        ? "success"
                        : selectedIndex === index
                        ? "primary"
                        : "basic"
                    }
                    category="h5"
                  >
                    {line}
                  </Text>
                  {loadingTexts[index] && <Spinner size="small" />}
                </View>
              ))}
            </Layout>
          </Layout>
        </ScrollView>

        <View
          className="flex-row items-center w-full justify-around absolute"
          style={{ bottom: 64 }}
        >
          <View style={styles.FunctionContainer}>
            <SmartTouchable
              activeOpacity={0.5}
              onPress={() =>
                handleTextPlay(
                  selectedIndex,
                  item.text.split("\n")[selectedIndex]
                )
              }
            >
              <View style={styles.FunctionButton}>
                <Icon
                  style={[
                    styles.FunctionIcon,
                    isPlaying && { tintColor: theme["color-primary-500"] },
                  ]}
                  name={
                    isPlaying ? "pause-circle-outline" : "play-circle-outline"
                  }
                />
              </View>
            </SmartTouchable>
          </View>
          <View style={styles.FunctionContainer}>
            <SmartTouchable
              activeOpacity={0.5}
              onPressIn={handleRecordStart}
              onPressOut={handleRecordEnd}
            >
              <View style={styles.FunctionButton}>
                <Icon
                  style={[
                    styles.FunctionIcon,
                    isRecording && { tintColor: theme["color-primary-500"] },
                  ]}
                  name={isRecording ? "mic" : "mic-outline"}
                />
              </View>
            </SmartTouchable>
          </View>
        </View>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  TextCard: {
    padding: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  FunctionContainer: {
    overflow: "hidden",
    borderRadius: 999,
  },
  FunctionButton: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 999,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  FunctionIcon: {
    width: 48,
    height: 48,
  },
});

export default TrainDetailPage;
