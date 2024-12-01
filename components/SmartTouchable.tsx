import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableNativeFeedbackProps,
  TouchableOpacityProps,
} from "react-native";

import { ReactNode } from "react";

type SmartTouchableProps = (TouchableNativeFeedbackProps | TouchableOpacityProps) & {
  children: ReactNode;
};

const SmartTouchable = ({ children, ...props }: SmartTouchableProps) => {
  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback {...props}>
        {children}
      </TouchableNativeFeedback>
    );
  } else {
    return (
      <TouchableOpacity {...props}>
        {children}
      </TouchableOpacity>
    );
  }
};

export default SmartTouchable;
