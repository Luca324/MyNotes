

const defaultNotes = {
    topics: [
        {
            id: 1,
            name: 'current home',
            notes: [
                {
                    text: 'room has to always be clean',
                    date: Date.now()
                },
                {
                    text: 'things close to me',
                    date: Date.now()
                }
            ]
        },
        {
            id: 1,
            name: 'future home',
            notes: [
                {
                    text: 'close to the metro',
                    date: Date.now()
                },
                {
                    text: 'hmm.... it has to be light! more sun!',
                    date: Date.now()
                }
            ]
        }
    ]
}

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState, useEffect } from 'react';
function useNotesStorage(init) {
    const [notesStorage, setNotesStorage] = useState(init)

    useEffect(() => {
        getNotesStorage().then(setNotesStorage)
    }, [])

    return [notesStorage, setNotesStorage]
}

function useTopics() {
    const [notes, setNotesStorage] = useState({})
    const [topics, setTopics] = useState([])

    useEffect(() => {
        getNotes().then(n => setTopics(n.topics))
    }, [notesStorage])

    useEffect(() => {
        setNotesStorage({ topics: topics })
    }, [topics])

    return [topics, setTopics]
}
function useTopics() {
    const [notesStorage, setNotesStorage] = useState({})
    const [topics, setTopics] = useState([])

    useEffect(() => {
        getNotes().then(n => setTopics(n.topics))
    }, [notesStorage])

    useEffect(() => {
        setNotesStorage({ topics: topics })
    }, [topics])

    return [topics, setTopics]
}


async function getNotes() {
    try {
        const notes = JSON.parse(AsyncStorage.getItem('notes'))
        console.log('got notes!')
        return notes
    } catch (e) {
        console.error('an error occured during getting notes: ', e)
    }
    return await JSON.parse(AsyncStorage.getItem('notes'))
}
async function saveNotes(notes) {
    try {
        const json = JSON.stringify(notes)
        await AsyncStorage.setItem('notes', json)
        console.log('notes successfully saved!')
    } catch (e) {
        console.error('an error occured during saving notes: ', e)
    }
}

function createTopic(topicName) {
    const [topics, setTopics] = useTopics({})
    const newTopic = {
        id: Date.now(),
        name: topicName,
        notes: []
    }
    setTopics(topics.concat(newTopic))
}
function deleteTopic(topicId) {
    const [topics, setTopics] = useTopics({})
    setTopics(topics.filter(topic => topic.id !== topicId))
}
function renameTopic(topicId, newName) {
    const [topics, setTopics] = useTopics({})

    setTopics(topics.reduce(topic => topic.id == topicId ? { ...topic, name: newName } : topic, []))
}

function createNote(topic, noteText) {

}