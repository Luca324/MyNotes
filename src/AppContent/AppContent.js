import React, { useEffect, useState, useContext, useRef } from 'react';

import { StyleSheet, Text, View, ScrollView, Pressable, Button} from 'react-native';

import {Link, useFocusEffect} from 'expo-router'

import Topic from '@components/Topic/Topic';
import { useKeyboard } from '@react-native-community/hooks';

import { AppContext } from '@/components/AppProvider';
import { FilePlus } from '@/components/Icons/FilePlus';
import Modal from '@/components/Modal/Modal';
import Note from '@/components/Note/Note';
import Tab from '@/components/Tab/Tab';
import Task from '@/components/Task/Task';
import { getChildTopics, getNotesForTopic } from '@/database/databaseService';
import { useNotes, useTopics } from '@/hooks/useNotes';
import TextInput from '@/shared/TextInput';

export default function AppContent() {
    const keyboard = useKeyboard();
    const [bottomPadding, setBottomPadding] = useState(0);

    useEffect(() => {
        if (keyboard.keyboardShown) {
            setBottomPadding(keyboard.keyboardHeight);
        } else {
            setBottomPadding(0);
        }
    }, [keyboard.keyboardShown, keyboard.keyboardHeight]);

    const { currentTopic, allTabs, setAllTabs, setCurrentTopic } = useContext(AppContext)
    const { topics, setTopics, createTopic, deleteTopic, renameTopic } = useTopics(currentTopic)

    const [newTopicName, setNewTopicName] = useState('')
    const { notes, setNotes, createNote, deleteNote, toggleTaskDone } = useNotes(currentTopic)

    const [createTopicModalVisible, setCreateTopicModalVisible] = useState(false)

    useEffect(() => {
        getChildTopics(currentTopic).then(setTopics)
        if (currentTopic !== 0) getNotesForTopic(currentTopic).then(setNotes)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTopic])

    // Обновляем данные при возврате на экран (например, после закрытия редактора заметок)
    useFocusEffect(
        React.useCallback(() => {
            getChildTopics(currentTopic).then(setTopics)
            if (currentTopic !== 0) {
                getNotesForTopic(currentTopic).then(setNotes)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [currentTopic])
    )

    // Очищаем поле при открытии модального окна
    useEffect(() => {
        if (createTopicModalVisible) {
            setNewTopicName('')
        }
    }, [createTopicModalVisible])

    function setAsTab(topic) {
        console.log('new tab:', topic)
        setAllTabs(allTabs => [...allTabs, topic])
    }

    // Создаем список всех доступных вкладок (включая "All")
    const allAvailableTabs = [{ id: 0, name: 'All' }, ...(allTabs || [])]

    // Находим текущую позицию в списке вкладок
    const currentTabIndex = allAvailableTabs.findIndex(tab => tab.id === currentTopic)

    // Функция для переключения на следующую/предыдущую вкладку
    const switchToTab = (direction) => {
        if (allAvailableTabs.length <= 1) return // Нет вкладок для переключения

        let newIndex
        if (direction === 'next') {
            // Свайп влево - следующая вкладка
            newIndex = currentTabIndex < allAvailableTabs.length - 1 ? currentTabIndex + 1 : 0
        } else {
            // Свайп вправо - предыдущая вкладка
            newIndex = currentTabIndex > 0 ? currentTabIndex - 1 : allAvailableTabs.length - 1
        }

        const newTab = allAvailableTabs[newIndex]
        if (newTab) {
            setCurrentTopic(newTab.id)
        }
    }

    // Обработчики для свайпов
    const touchStartX = useRef(0)

    const handleTouchStart = (evt) => {
        touchStartX.current = evt.nativeEvent.pageX
    }

    const handleTouchEnd = (evt) => {
        const touchEndX = evt.nativeEvent.pageX
        const deltaX = touchEndX - touchStartX.current
        const swipeThreshold = 50 // Минимальное расстояние для свайпа

        if (Math.abs(deltaX) > swipeThreshold) {
            if (deltaX > 0) {
                // Свайп вправо - предыдущая вкладка
                console.log('Swipe right - previous tab')
                switchToTab('prev')
            } else {
                // Свайп влево - следующая вкладка
                console.log('Swipe left - next tab')
                switchToTab('next')
            }
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.tabsScroll}
                contentContainerStyle={styles.tabsContainer}
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                <Tab key='tab-0' tab={{ id: 0, name: 'All', order_index: 0, topic_id: null }} deleteTopic={() => {}} />

                {allTabs && allTabs.map(tab =>
                    <Tab key={`tab-${tab.id}`} tab={tab} deleteTopic={deleteTopic} />
                )}
            </ScrollView>

            <View
                style={styles.scrollContainer}
            >
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={[
                        styles.scrollContent,
                        {
                            paddingBottom: bottomPadding + 80
                        }
                    ]}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="handled"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                {topics && Array.isArray(topics) ? (
                    topics.map(topic => (
                        <Topic key={topic.id} topic={topic} deleteTopic={deleteTopic} setAsTab={() => setAsTab(topic)} />
                    ))
                ) : (
                    <Text>Загрузка...</Text>
                )}
                {(() => {
                    // Разделяем заметки на задачи и обычные заметки
                    // SQLite возвращает числа (0/1) или null/undefined для новых полей
                    const tasks = notes.filter(note => {
                        const isTaskValue = note.is_task
                        // Проверяем все возможные варианты: true, 1, '1'
                        const isTask = isTaskValue === true || isTaskValue === 1 || String(isTaskValue) === '1'
                        if (isTask) {
                            console.log('AppContent: Found task:', note.id, 'is_task:', isTaskValue, 'done:', note.done)
                        }
                        return !!isTask
                    })
                    const regularNotes = notes.filter(note => {
                        const isTaskValue = note.is_task
                        // Если is_task null/undefined/0/false - это обычная заметка
                        const isTask = isTaskValue === true || isTaskValue === 1 || String(isTaskValue) === '1'
                        return !isTask
                    })
                    
                    const incompleteTasks = tasks.filter(task => {
                        const isDone = task.done === true || task.done === 1 || String(task.done) === '1'
                        return !isDone
                    })
                    const completedTasks = tasks.filter(task => {
                        const isDone = task.done === true || task.done === 1 || String(task.done) === '1'
                        return Boolean(isDone)
                    })
                    
                    return (
                        <>
                            {/* Невыполненные задачи */}
                            {incompleteTasks && incompleteTasks.map(task => (
                                <Task 
                                    key={task.id} 
                                    task={task} 
                                    topicId={currentTopic} 
                                    deleteTask={deleteNote} 
                                    toggleTaskDone={toggleTaskDone}
                                />
                            ))}
                            {/* Обычные заметки */}
                            {regularNotes && regularNotes.map(note => (
                                <Note note={note} deleteNote={deleteNote} key={note.id} topicId={currentTopic} />
                            ))}
                            {/* Выполненные задачи */}
                            {completedTasks.length > 0 && (
                                <View style={styles.completedTasksContainer}>
                                    <Text style={styles.completedTasksHeader}>Выполненные задачи</Text>
                                    {completedTasks.map(task => (
                                        <Task 
                                            key={task.id} 
                                            task={task} 
                                            topicId={currentTopic} 
                                            deleteTask={deleteNote} 
                                            toggleTaskDone={toggleTaskDone}
                                        />
                                    ))}
                                </View>
                            )}
                        </>
                    )
                })()}
                </ScrollView>
            </View>
            
            <Pressable style={styles.createTopic} onPress={() => setCreateTopicModalVisible(true)}>
                <FilePlus/>
            </Pressable>

            { currentTopic === 0 ? <></> : 
            <>
            <Link style={styles.createNote}
                      href={{ pathname: '/noteEditor', params: { topicId: currentTopic } }}
                      asChild
                    >
            <Pressable>
                <Text style={styles.createNoteText}>+</Text>
            </Pressable>
            </Link>
            <Link style={styles.createTask}
                      href={{ pathname: '/noteEditor', params: { topicId: currentTopic, isTask: 'true' } }}
                      asChild
                    >
            <Pressable>
                <Text style={styles.createTaskText}>✓</Text>
            </Pressable>
            </Link>
            </>}

            {createTopicModalVisible && <Modal modalVisible={createTopicModalVisible} setModalVisible={setCreateTopicModalVisible}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Создать тему</Text>
                    <TextInput
                        value={newTopicName}
                        setValue={setNewTopicName}
                        styles={styles.modalInput}
                        placeholder="Название темы"
                    />
                    <View style={styles.modalButtons}>
                        <Pressable
                            style={styles.modalCancelButton}
                            onPress={() => {
                                setNewTopicName('')
                                setCreateTopicModalVisible(false)
                            }}
                        >
                            <Text style={styles.modalCancelText}>Отмена</Text>
                        </Pressable>
                        <Pressable
                            style={styles.modalConfirmButton}
                            onPress={() => {
                                if (newTopicName && newTopicName.trim()) {
                                    createTopic(currentTopic, newTopicName.trim()).then(() => {
                                        setNewTopicName('')
                                        setCreateTopicModalVisible(false)
                                    })
                                }
                            }}
                        >
                            <Text style={styles.modalConfirmText}>Создать</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4', // Текущий - светло-серый
        // backgroundColor: '#FAFAFA', // Вариант 2 - почти белый
        // backgroundColor: '#F0F0F0', // Вариант 3 - светло-серый
        // backgroundColor: '#E8E8E8', // Вариант 4 - серый
        // backgroundColor: '#F5F5F5', // Вариант 5 - светло-серый
        // backgroundColor: '#FFFFFF', // Вариант 6 - белый
        // backgroundColor: '#F8F8F8', // Вариант 7 - очень светло-серый
        // backgroundColor: '#EEEEEE', // Вариант 8 - светло-серый
        // backgroundColor: '#F9F9F9', // Вариант 9 - почти белый
        // backgroundColor: '#E5E5E5', // Вариант 10 - серый
        marginTop: 36,
    },
    tabsScroll: {
        maxHeight: 36,
        marginBottom: 8,
    },
    tabsContainer: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 16,
    },
    scrollContainer: {
        flex: 1,
        width: "100%",
    },
    scroll: {
        flex: 1,
        width: "100%",
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        alignItems: 'flex-start', // Выравниваем по левому краю
    },
    createNote: {
        width: 50,
        height: 50,
        borderRadius: '50%',
        position: 'absolute',
        bottom: 40,
        right: 20,
        backgroundColor: '#818cf8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    createNoteText: {
        color: 'white',
        fontSize: 32
    },
    createTopic: {
        width: 50,
        height: 50,
        borderRadius: '50%',
        position: 'absolute',
        bottom: 40,
        left: 20,
        backgroundColor: '#818cf8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    createTask: {
        width: 50,
        height: 50,
        borderRadius: '50%',
        position: 'absolute',
        bottom: 40,
        right: '50%',
        marginRight: -25,
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
    },
    createTaskText: {
        color: 'white',
        fontSize: 24
    },
    completedTasksContainer: {
        width: '100%',
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    completedTasksHeader: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    modalContent: {
        width: '100%',
        padding: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalInput: {
        backgroundColor: '#F4F4F4',
        borderWidth: 0,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    modalCancelButton: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    modalCancelText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
    modalConfirmButton: {
        flex: 1,
        backgroundColor: '#818cf8',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    modalConfirmText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
});