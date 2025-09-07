import { StyleSheet, TextInput as Input, TextInputProps as RNTextInputProps, StyleProp, TextStyle } from "react-native";

interface TextInputProps extends RNTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  styles?: StyleProp<TextStyle>;
  defaultValue?: string;
}

export default function TextInput({
  value,
  onChangeText,
  styles = defaultStyles.input,
  defaultValue = "",
}: TextInputProps) {
  return (
    <Input
      multiline={true}
      style={styles}
      value={value}
      onChangeText={onChangeText}
      defaultValue={defaultValue}
    />
  );
}

const defaultStyles = StyleSheet.create({
  input: {
    margin: 12,
    padding: 10,
    width: "98%",
    backgroundColor: "#F4F4F4",
    borderWidth: 0,
    borderRadius: 4,
    height: 35,
  },
});