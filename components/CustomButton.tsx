import { Button, Spinner } from "@ui-kitten/components";
import { View, StyleSheet, ViewProps } from "react-native";

interface CustomButtonProps {
  loading?: boolean;
  children: React.ReactText;
  className?: string;
  style?: any;
  disabled?: boolean;
  appearance?: "filled" | "outline" | "ghost";
  onPress?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  loading,
  children,
  className,
  style,
  disabled,
  appearance,
  onPress,
}) => {
  return (
    <Button
      className={className}
      style={style}
      disabled={disabled || loading}
      appearance={appearance}
      accessoryLeft={loading ? <LoadingIndicator /> : undefined}
      onPress={onPress}
    >
      {children}
    </Button>
  );
};

const LoadingIndicator = (): React.ReactElement => (
  <View style={[styles.indicator]}>
    <Spinner size="small" />
  </View>
);

const styles = StyleSheet.create({
  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomButton;
