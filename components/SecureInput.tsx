import { Icon, Input } from "@ui-kitten/components";
import React, { useState } from "react";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";

interface SecureInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  caption?: React.ReactNode;
  onChangeText?: (text: string) => void;
}

const SecureInput: React.FC<SecureInputProps> = ({
  label,
  placeholder,
  value,
  caption,
  onChangeText,
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureEntry = (): void => {
    setSecureTextEntry((prevState) => !prevState);
  };

  return (
    <Input
      style={styles.input}
      label={label}
      placeholder={placeholder}
      //@ts-ignore
      caption={caption}
      accessoryRight={(props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
          <Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
        </TouchableWithoutFeedback>
      )}
      value={value}
      secureTextEntry={secureTextEntry}
      onChangeText={onChangeText}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 4,
  },
});

export default SecureInput;
