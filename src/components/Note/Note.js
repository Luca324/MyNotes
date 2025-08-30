import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { formatDate } from '@utils/sharedUtils';


export default function Note({ note }) {
    console.log('note', note)
    return (
        <View style={styles.note}>
            <View style={styles.header}>
                <Text style={styles.id}>id: {note.id}</Text>
                <Text style={styles.id}>{formatDate(note.date)}</Text>
            </View>
            <Text>{note.text}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    note: {
        width: "100%",
        backgroundColor: '#ffffff',
        borderRadius: 5,
        marginVertical: 2,
        marginHorizontal: 2,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    id: {
        fontSize: 14,
        color: '#666',
    }
});