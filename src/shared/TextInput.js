import { StyleSheet, TextInput as Input } from 'react-native';

export default function TextInput({ value, onChangeText, styles = defaultStyles.input, defaultValue = '' }) {
  return (
    <Input
    multiline={true}
      style={styles}
      value={value}
      onChangeText={onChangeText}
      defaultValue={defaultValue}>
    </Input>)
}

const defaultStyles = StyleSheet.create({
  input: {
    margin: 12,
    padding: 10,
    width: '98%',
    backgroundColor: '#F4F4F4',
    borderWidth: 0,
    borderRadius: 4,
    height: 35,
  },
});
