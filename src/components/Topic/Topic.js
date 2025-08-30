import { StyleSheet, Text, View, Button, TextInput } from 'react-native';


import { useEffect, useState } from 'react';
import { getChildrenForTopic } from '@database/databaseService';

export default function Topic({topic}) {
    const { id, name, notes } = topic
    const [children, setChildren] = useState([])
    useEffect(() => {
    try {
    getChildrenForTopic(id).then(setChildren)
    } catch (e) {}

    }, [])

    return (
        <View style={styles.topic}>
            <View style={styles.topicHeader}>
                <Text>id: {id}</Text>
                <Text> name: {name}</Text>
                <Text> notes: {JSON.stringify(notes)}</Text>
                <Button
                    title="delete topic"
                    onPress={() => deleteTopic(id)}></Button>
                <Button
                    title="add to navbar"
                    onPress={() => {}}></Button>
            </View>
            <View>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    topic: {
        flex: 1,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topicHeader: {
        flex: 2,
        backgroundColor: '#fff',

    }
});
