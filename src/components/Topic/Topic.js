import { StyleSheet, Text, View, Button, TextInput } from 'react-native';


import { useEffect, useState } from 'react';
import { getChildrenForTopic } from '@database/databaseService';
import Note from '../Note/Note';

export default function Topic({topic}) {
    const { id, name, notes } = topic
    const [children, setChildren] = useState([])
    useEffect(() => {
    try {
    // getChildrenForTopic(id).then(setChildren)
    } catch (e) {}

    }, [])

return (
    <View style={styles.topic}>
        <View style={styles.topicHeader}>
            <Text style={styles.idText}>id: {id}</Text>
            <Text style={styles.nameText}>name: {name}</Text>
            {notes.map(note => (
                <Note note={note} key={note.id}/>
            ))}
            <View style={styles.buttonContainer}>
                <Button
                    style={styles.btn}
                    title="delete topic"
                    onPress={() => deleteTopic(id)}
                    color="#FF3B30"
                />
                <Button
                    style={styles.btn}
                    title="add to navbar"
                    onPress={() => {}}
                    color="#007AFF"
                />
            </View>
        </View>
        <View>{children}</View>
    </View>
);
}
const styles = StyleSheet.create({
    topic: {
        width: "95%",
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginVertical: 2,
        marginHorizontal: 2,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    topicHeader: {
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 12,
    },
    idText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    nameText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    btn: {
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: '#007AFF',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        gap: 8,
    },
});