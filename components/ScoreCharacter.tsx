import { DysarthriaResultVO } from "@/apis/train";
import { Text } from "@ui-kitten/components";
import React from "react";
import { View } from "react-native";

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
  return (
    <View>
      <Text category="h6">
        声母:{" "}
        <Text
          category="h6"
          status={SM_DESCRIPTIONS[data.sm ? data.sm[0] : ""]?.status}
        >
          {SM_DESCRIPTIONS[data.sm ? data.sm[0] : ""]?.desc}
        </Text>
      </Text>
      <Text category="h6">
        韵母:{" "}
        <Text
          category="h6"
          status={YM_DESCRIPTIONS[data.ym ? data.ym[0] : ""]?.status}
        >
          {YM_DESCRIPTIONS[data.ym ? data.ym[0] : ""]?.desc}
        </Text>
      </Text>
      <Text category="h6">
        声调:{" "}
        <Text
          category="h6"
          status={SD_DESCRIPTIONS[data.sd ? data.sd[0] : ""]?.status}
        >
          {SD_DESCRIPTIONS[data.sd ? data.sd[0] : ""]?.desc}
        </Text>
      </Text>
      <Text category="h6">
        得分:{" "}
        <Text category="h6" status={getStatus(Number(data.total_score))}>
          {data.total_score}
        </Text>
      </Text>
    </View>
  );
};

export default ScoreText;
