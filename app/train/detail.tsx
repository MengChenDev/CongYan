import { GetMicrosoftTTSAPI, GetTTSAPI } from "@/apis/train";
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
} from "@ui-kitten/components";
import { TouchableWebElement } from "@ui-kitten/components/devsupport";
import { Audio } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { View } from "react-native";

const BackIcon = (props: any): IconElement => (
  <Icon {...props} name="arrow-back-outline" />
);

const TrainDetailPage = () => {
  let loadingTexts2 = {};
  const { data } = useLocalSearchParams<{ data: string }>();
  const item: TrainText = JSON.parse(data);
  const [playedTexts, setPlayedTexts] = useState<{
    [key: number]: Audio.Sound;
  }>({});
  const [loadingTexts, setLoadingTexts] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const renderBackAction = (): TouchableWebElement => (
    <TopNavigationAction onPress={handleBackPress} icon={BackIcon} />
  );

  const handleBackPress = async () => {
    // 修复返回时音频继续播放的问题
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
      await playedTexts[playingIndex].pauseAsync();
    }
    if (playedTexts[key]) {
      setPlayingIndex(key);
      await playedTexts[key].replayAsync();
    } else {
      setLoadingTexts((prev) => ({ ...prev, [key]: true }));
      const res = await GetTTSAPI(text);
      const audioBase64 = res.data?.audioBase64;
      if (audioBase64) {
        const { sound } = await Audio.Sound.createAsync({
          uri: `data:audio/mp3;base64,${audioBase64}`,
        });
        setPlayedTexts((prev) => ({ ...prev, [key]: sound }));
        setPlayingIndex(key);
        if (!loadingTexts[-1]) {
          await sound.playAsync();
        }
      }
      setLoadingTexts((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <Layout className="h-full" level="1">
      <TopNavigation
        accessoryLeft={renderBackAction}
        alignment="center"
        title={item.title}
        subtitle={item.author}
      />
      <Layout level="2" className="flex-1 px-4 py-4">
        <Card>
          {item.text.split("\n").map((line, index) => (
            <View key={index} className="flex-row items-center my-2">
              <Text
                onPress={() => {
                  handleTextPlay(index, line);
                }}
                status={playingIndex === index ? "primary" : "basic"}
                category="h5"
              >
                {line}
              </Text>
              {loadingTexts[index] && <Spinner size="small" />}
            </View>
          ))}
        </Card>
      </Layout>
    </Layout>
  );
};

export default TrainDetailPage;
