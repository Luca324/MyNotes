import { StyleSheet, TextInput as Input} from 'react-native';

export default function TextInput({value, onChangeText, styles, defaultValue = ''}) {
    return (<Input
            style={styles}
            value={value}
            onChangeText={onChangeText}
            defaultValue={defaultValue}></Input>)
}
