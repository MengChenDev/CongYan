import { GetMicrosoftTTSAPI, GetTTSAPI } from "@/apis/train";
import { TrainText } from "@/store/train";
import {
  Card,
  Icon,
  IconElement,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import { TouchableWebElement } from "@ui-kitten/components/devsupport";
import { Audio } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";

const BackIcon = (props: any): IconElement => (
  <Icon {...props} name="arrow-back-outline" />
);

const TrainDetailPage = () => {
  const { data } = useLocalSearchParams<{ data: string }>();
  const item: TrainText = JSON.parse(data);
  const [playedTexts, setPlayedTexts] = useState<{
    [key: number]: Audio.Sound;
  }>({});

  const renderBackAction = (): TouchableWebElement => (
    <TopNavigationAction onPress={router.back} icon={BackIcon} />
  );

  const handleTextPlay = async (key: number, text: string) => {
    if (playedTexts[key]) {
      await playedTexts[key].replayAsync();
    } else {
      // 微软TTS，暂不支持安卓
      /*
      const audioData = await GetMicrosoftTTSAPI(
        text,
        "zh-CN",
        "zh-CN-YunxiNeural"
      );
      if (audioData) {
        const blob = new Blob([audioData], { type: "audio/mp3" });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          const { sound } = await Audio.Sound.createAsync(
            { uri: base64data },
            { shouldPlay: true }
          );
          setPlayedTexts((prev) => ({ ...prev, [key]: sound }));
          await sound.playAsync();
        };
      }*/

      const res = await GetTTSAPI(text);
      const audioBase64 = res.data?.audioBase64;
      if (audioBase64) {
        const { sound } = await Audio.Sound.createAsync({
          uri: `data:audio/mp3;base64,${audioBase64}`,
        });
        setPlayedTexts((prev) => ({ ...prev, [key]: sound }));
        await sound.playAsync();
      }
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
            <Text
              onPress={() => {
                handleTextPlay(index, line);
              }}
              key={index}
              category="h5"
            >
              {line}
            </Text>
          ))}
        </Card>
      </Layout>
    </Layout>
  );
};

export default TrainDetailPage;
