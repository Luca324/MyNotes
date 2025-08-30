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

import { useState, useEffect } from 'react';


export function useTopics(init = []) {
    const [topics, setTopics] = useState(init)

    useEffect(() => {
        getNotes().then(n => {
            console.log('n', n)
            setTopics(n.topics)
        })
    }, [])

    function createTopic(topicName) {
        const newTopic = {
            id: Date.now(),
            name: topicName,
            notes: []
        }
        setTopics(topics.concat(newTopic))
    }

    function deleteTopic(topicId) {
        console.log('deleting id:', topicId)

        setTopics(topics.filter(topic => {
            console.log('topic:', topic)
            return topic.id !== topicId

        }))
    }

    function renameTopic(topicId, newName) {
        setTopics(topics.reduce(topic => topic.id == topicId ? { ...topic, name: newName } : topic, []))
    }


    return { topics, setTopics, createTopic, deleteTopic, renameTopic }
}

export function useNotes(topicId = 0) {
    const [topics, setTopics] = useTopics()
    const [topic, setTopic] = useState({ id: 0, name: 'no topic', notes: [] })
    const [notes, setNotes] = useState([])

    useEffect(() => {
        const topic = topics.filter(n => n.id === topicId)[0]
        setTopic(topic)
        setNotes(topic.notes)
    }, [topics])

    useEffect(() => {
        const newTopic = { ...topic, notes }
        setTopic(newTopic)
        setTopics([...topics, newTopic])
    }, [notes])

    function createNote(noteText) {
        const newNote = {
            text: noteText,
            id: Date.now(),
            date: Date.now(),
        }
        setNotes(notes.concat(newNote))
    }

    function deleteNote(noteId) {
        setNotes(notes.filter(note => note.id !== noteId))
    }

    return {
        notes,
        setNotes,
        createNote,
        deleteNote
    }
}

async function getNotes() {
    try {
        let notes = {
            topics: [
                {
                    id: 1,
                    name: 'education',
                    notes: [
                        {
                            text: 'first: common education',
                            date: Date.now()
                        },
                        {
                            text: 'second: high education',
                            date: Date.now()
                        }
                    ]
                },
                {
                    id: 2,
                    name: 'work',
                    notes: [
                        {
                            text: 'nobody likes it',
                            date: Date.now()
                        },
                        {
                            text: 'but everybody does',
                            date: Date.now()
                        }
                    ]
                }
            ]
        }
        console.log('got notes!')
        return notes
    } catch (e) {
        console.error('an error occured during getting notes: ', e)
        return []
    }
}
// export async function saveNotes(notes) {
//     try {
//         const json = JSON.stringify(notes)
//         AsyncStorage.removeItem('notes').then(() => {
//             AsyncStorage.setItem('notes', json)
//         }
//         )

//     } catch (e) {
//         console.error('an error occured during saving notes: ', e)
//     }
// }