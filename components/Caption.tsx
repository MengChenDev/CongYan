import { Icon, IconElement, Text } from "@ui-kitten/components";
import React from "react";
import { View, StyleSheet } from "react-native";

const AlertIcon = (props: any): IconElement => (
  <Icon {...props} name="alert-circle-outline" />
);

interface CaptionProps {
  error: string;
  status?: "primary" | "success" | "info" | "warning" | "danger";
}

const Caption = ({ error, status }: CaptionProps) => {
  if (!error) return <></>;
  return (
    <View style={styles.captionContainer}>
      <AlertIcon {...styles.captionIcon} />
      <Text style={styles.captionText} status={status}>
        {error}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  captionContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  captionIcon: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  captionText: {
    fontSize: 12,
    color: "#8F9BB3"
  },
});

export default Caption;
