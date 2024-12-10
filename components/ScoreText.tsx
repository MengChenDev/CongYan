import { DysarthriaResultVO } from "@/apis/train";
import { Card, Modal, Text, Button } from "@ui-kitten/components";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Platform, StatusBar } from "react-native";

const getStatus = (score: number) => {
  if (score >= 90) return "success";
  if (score >= 75) return "info";
  if (score >= 50) return "warning";
  return "danger";
};
const SM_DESCRIPTIONS: {
  [key: string]: { desc: string; status: string };
} = {
  SM_SAME: { desc: "声母相同", status: "success" },
  SM_DIFF_PART: { desc: "声母发音部位不同", status: "warning" },
  SM_DIFF_METHOD: { desc: "声母发音方式不同", status: "info" },
  SM_DIFFERENT: { desc: "发音完全不同", status: "danger" },
};

const YM_DESCRIPTIONS: {
  [key: string]: { desc: string; status: string };
} = {
  YM_SAME: { desc: "完全相同", status: "success" },
  YM_SAME_LIKE: { desc: "发音方式和口型都相同", status: "info" },
  YM_DIFF_SHAPE: { desc: "发音结构相同，口型不同", status: "warning" },
  YM_DIFF_STRUCT: { desc: "发音口型相同，结构不同", status: "warning" },
  YM_DIFF_SMOOTH: {
    desc: "发音口型相同且粗结构相同，发音细结构不同",
    status: "info",
  },
  YM_DIFF_SHAPE_AND_SMOOTH: {
    desc: "发音粗结构相同，口型不同",
    status: "warning",
  },
  YM_DIFFERENT: { desc: "完全不同", status: "danger" },
};

const SD_DESCRIPTIONS: {
  [key: string]: { desc: string; status: string };
} = {
  SD_SAME: { desc: "发音相同", status: "success" },
  SD_DIFFERENT: { desc: "发音不同", status: "danger" },
};

const ScoreText = ({
  text,
  data = {} as DysarthriaResultVO,
}: {
  text: string;
  data: DysarthriaResultVO;
}) => {
  if (data == null) {
    data = {} as DysarthriaResultVO;
  }
  const [modalContent, setModalContent] = useState({
    character: "",
    sm: "",
    ym: "",
    sd: "",
    score: "",
    show: false,
  });

  if (data == null) {
    data = {};
  }

  const handleSpecializedPractice = () => {
    setModalContent({
      character: "",
      sm: "",
      ym: "",
      sd: "",
      score: "",
      show: false,
    });
    router.push({
      pathname: "/train/specialized",
      params: { character: modalContent.character },
    });
  };

  const handlePress = (charData: {
    character: string;
    sm: string;
    ym: string;
    sd: string;
    score: string;
  }) => {
    setModalContent({
      ...charData,
      show: true,
    });
  };

  let dataIndex = 0;

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {text.split("").map((char, index) => {
        if (/[^\u4e00-\u9fa5]/.test(char) && /[^\w\s]/.test(char)) {
          return (
            <Text key={index} category="h5" style={{ margin: 2 }}>
              {char}
            </Text>
          );
        }

        if (char.trim() === "") {
          return null;
        }

        const status =
          data.single_score === undefined ||
          dataIndex >= data.single_score.length
            ? "basic"
            : getStatus(data.single_score[dataIndex] ?? 0);

        const charData = {
          character: char,
          sm: data.sm?.[dataIndex] ?? "",
          ym: data.ym?.[dataIndex] ?? "",
          sd: data.sd?.[dataIndex] ?? "",
          score: data.single_score?.[dataIndex]?.toString() ?? "",
        };

        const element = (
          <TouchableOpacity key={index} onPress={() => handlePress(charData)}>
            <View>
              <Text status={status} category="h5" style={{ margin: 2 }}>
                {char}
              </Text>
              {/* <Text style={{ fontSize: 10 }}>
                {data.single_score?.[dataIndex]}
              </Text> */}
            </View>
          </TouchableOpacity>
        );

        dataIndex++;
        return element;
      })}

      <Modal
        visible={modalContent.show}
        backdropStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onBackdropPress={() =>
          setModalContent({
            character: "",
            sm: "",
            ym: "",
            sd: "",
            score: "",
            show: false,
          })
        }
      >
        <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" />
        <Card disabled={true}>
          <Text category="h6">
            字符: <Text category="h6">{modalContent.character}</Text>
          </Text>
          <Text category="h6">
            声母:{" "}
            <Text
              category="h6"
              status={SM_DESCRIPTIONS[modalContent.sm]?.status}
            >
              {SM_DESCRIPTIONS[modalContent.sm]?.desc}
            </Text>
          </Text>
          <Text category="h6">
            韵母:{" "}
            <Text
              category="h6"
              status={YM_DESCRIPTIONS[modalContent.ym]?.status}
            >
              {YM_DESCRIPTIONS[modalContent.ym]?.desc}
            </Text>
          </Text>
          <Text category="h6">
            声调:{" "}
            <Text
              category="h6"
              status={SD_DESCRIPTIONS[modalContent.sd]?.status}
            >
              {SD_DESCRIPTIONS[modalContent.sd]?.desc}
            </Text>
          </Text>
          <Text category="h6">
            得分:{" "}
            <Text category="h6" status={getStatus(Number(modalContent.score))}>
              {modalContent.score}
            </Text>
          </Text>
        </Card>
        <Button onPress={handleSpecializedPractice} className="mt-4">
          专项练习
        </Button>
      </Modal>
    </View>
  );
};

export default ScoreText;
