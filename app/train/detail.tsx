import { DysarthriaAPI, DysarthriaByBase64API, GetTTSAPI } from "@/apis/train";
import ScoreText from "@/components/ScoreText";
import SmartTouchable from "@/components/SmartTouchable";
import { TrainText } from "@/store/train";
import { Provider, Toast } from "@ant-design/react-native";
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
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
const BackIcon = (props: any): IconElement => (
  <Icon {...props} name="arrow-back-outline" />
);

const getStatus = (score: number) => {
  if (score >= 90) return "success";
  if (score >= 75) return "info";
  if (score >= 50) return "warning";
  return "danger";
};

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
  const [recording, setRecording] = useState<Audio.Recording | undefined>(
    undefined
  );
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [currentText, setCurrentText] = useState<string>(
    item.text.split("\n")[0]
  );
  const [dysarthriaData, setDysarthriaData] = useState<any>({});
  const [toastKey, setToastKey] = useState<number>(0);
  const [isPracticingAll, setIsPracticingAll] = useState<boolean>(false);

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

  const handleTextPlay = async (key: number, text: string, replace = true) => {
    if (key === -1) {
      setIsPracticingAll(true);
    }
    if (replace) {
      setIsPracticingAll(false);
      setCurrentText(text);
    }
    setDysarthriaData({});
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

  const handleRecordStart = async () => {
    if (isRecording) {
      return;
    }
    setIsRecording(true);

    let toastKey = Toast.loading("录音准备中...", 0);
    try {
      if (permissionResponse?.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
      Toast.remove(toastKey);
      toastKey = Toast.show(
        {
          content: "请说话",
          icon: (
            <Icon
              style={[
                styles.FunctionIcon,
                {
                  tintColor: "#FFFFFF",
                },
              ]}
              name="mic-outline"
            />
          ),
        },
        0
      );
      setToastKey(toastKey);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const handleRecordEnd = async () => {
    if (!recording) {
      return;
    }
    setIsRecording(false);
    setRecording(undefined);
    Toast.remove(toastKey);
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording?.getURI();
    console.log("Recording stopped and stored at", uri);

    if (uri) {
      let dysarthriaToastKey = Toast.loading("分析中...", 0);
      if (Platform.OS === "web") {
        const response = await fetch(uri);
        console.log(response);
        const blob = await response.blob();
        const file = new File([blob], "recording.m4a", { type: "audio/mpeg" });
        const res = await DysarthriaAPI(currentText, file);
        const data = res.data;
        setDysarthriaData(data);
        Toast.remove(dysarthriaToastKey);
        Toast.success("分析完成", 1);
      } else {
        const response = await fetch(uri);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = reader.result;
          const text = item.text.split("\n")[selectedIndex];
          if (typeof base64data === "string") {
            const res = await DysarthriaByBase64API(currentText, base64data);
            const data = res.data;
            setDysarthriaData(data);
            Toast.remove(dysarthriaToastKey);
            Toast.success("分析完成", 1);
          } else {
            console.error("Failed to convert blob to base64 string");
          }
        };
        reader.readAsDataURL(blob);
      }
    } else {
    }
  };

  return (
    <Provider>
      <Layout className="h-full" level="1">
        <TopNavigation
          accessoryLeft={renderBackAction}
          accessoryRight={() => (
            <View className="">
              <Text>建议时长：{item.suggestedDuration}秒</Text>
              <Text>
                难度分级：
                <Text
                  status={
                    item.grade === "easy"
                      ? "success"
                      : item.grade === "common" || item.grade === "middle rank"
                      ? "info"
                      : item.grade === "hard" || item.grade === "senior"
                      ? "warning"
                      : item.grade === "challenging"
                      ? "danger"
                      : "basic"
                  }
                >
                  {item.grade === "easy"
                    ? "简单"
                    : item.grade === "common" || item.grade === "middle rank"
                    ? "普通"
                    : item.grade === "hard" || item.grade === "senior"
                    ? "困难"
                    : item.grade === "challenging"
                    ? "挑战"
                    : "未知"}
                </Text>
              </Text>
            </View>
          )}
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

          <View className="w-full absolute" style={{ bottom: 32 }}>
            <Layout style={styles.CurrentTextContainer} className="mb-4 mx-4">
              <ScrollView className="p-4">
                <ScoreText text={currentText} data={dysarthriaData}></ScoreText>
                {Platform.OS === "android" && isPracticingAll && (
                  <Layout className="h-8"></Layout>
                )}
              </ScrollView>
            <View style={{ position: 'absolute', right: 8, bottom: 4 }}>
              <Text category="label" status={getStatus(dysarthriaData.total_score)}>
                {dysarthriaData.total_score}
              </Text>
            </View>
            </Layout>
            <View className="flex-row items-center justify-around">
              <View style={styles.FunctionContainer}>
                <SmartTouchable
                  activeOpacity={0.5}
                  onPress={() => {
                    // if (isPracticingAll) {
                    //   Toast.fail("暂不支持全文朗读", 1);
                    //   return;
                    // }
                    handleTextPlay(
                      selectedIndex,
                      item.text.split("\n")[selectedIndex],
                      false
                    );
                  }}
                >
                  <View style={styles.FunctionButton}>
                    <Icon
                      style={[
                        styles.FunctionIcon,
                        isPlaying && { tintColor: theme["color-primary-500"] },
                      ]}
                      name={
                        isPlaying
                          ? "pause-circle-outline"
                          : "play-circle-outline"
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
                        isRecording && {
                          tintColor: theme["color-primary-500"],
                        },
                      ]}
                      name={isRecording ? "mic" : "mic-outline"}
                    />
                  </View>
                </SmartTouchable>
              </View>
            </View>
            <View className="mt-4" style={styles.PracticeAllContainer}>
              <SmartTouchable
                activeOpacity={0.5}
                onPress={() => {
                  setIsPracticingAll(!isPracticingAll);
                  setDysarthriaData({});
                  if (isPracticingAll) {
                    setCurrentText(item.text.split("\n")[selectedIndex]);
                    return;
                  }
                  setCurrentText(item.text);
                }}
              >
                <View style={styles.PracticeAllButton}>
                  <Text
                    className="text-center"
                    category="h6"
                    status={isPracticingAll ? "primary" : "basic"}
                  >
                    全文练习
                  </Text>
                </View>
              </SmartTouchable>
            </View>
          </View>
        </Layout>
      </Layout>
    </Provider>
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
  CurrentTextContainer: {
    overflow: "hidden",
    borderRadius: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 200,
  },
  FunctionContainer: {
    overflow: "hidden",
    borderRadius: 999,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  FunctionButton: {
    backgroundColor: "white",
    padding: 16,
  },
  FunctionIcon: {
    width: 48,
    height: 48,
  },
  PracticeAllContainer: {
    overflow: "hidden",
    borderRadius: 999,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: "50%",
    alignSelf: "center",
  },
  PracticeAllButton: {
    backgroundColor: "white",
    padding: 16,
    textAlign: "center",
  },
});

export default TrainDetailPage;
