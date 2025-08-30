import { StyleSheet, TextInput as Input} from 'react-native';

export default function TextInput({value, onChangeText, defaultValue = ''}) {
    return (<Input
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            defaultValue={defaultValue}></Input>)
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    width: '100%',
    borderWidth: 1,
    padding: 10,
  },
});
