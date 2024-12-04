import { DysarthriaResultVO } from "@/apis/train";
import { Text } from "@ui-kitten/components";
import React from "react";
import { View, TouchableOpacity, Alert } from "react-native";

const getStatus = (score: number) => {
  if (score >= 90) return "success";
  if (score >= 75) return "info";
  if (score >= 50) return "warning";
  return "danger";
};

const ScoreText = ({
  text,
  data,
}: {
  text: string;
  data: DysarthriaResultVO;
}) => {
  console.log(text, data);
  const handlePress = (index: number) => {
    alert(
      `Character: ${text[index]}\nSM: ${data.sm?.[index]}\nYM: ${data.ym?.[index]}\nSD: ${data.sd?.[index]}\nScore: ${data.single_score?.[index]}`
    );
  };

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {text.split("").filter(char => !(/[^\u4e00-\u9fa5]/.test(char) && /[^\w\s]/.test(char))).map((char, index) => {
        const status =
          data.single_score === undefined ||
          index >= data.single_score.length
            ? "basic"
            : getStatus(data.single_score[index] ?? 0);
        console.log(status, char, data.single_score?.[index]);
        return (
          <TouchableOpacity key={index} onPress={() => handlePress(index)}>
            <View>
              <Text status={status} style={{ margin: 2 }}>
                {char}
              </Text>
              <Text style={{ fontSize: 10 }}>{data.single_score?.[index]}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ScoreText;
