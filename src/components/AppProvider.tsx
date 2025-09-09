import React, { useState } from 'react'

import { useTopics } from '@/hooks/useNotes'
import { Topic } from '@/types'

interface ContextProps {
    topics: Topic[],
    setTopics: (topics: Topic[]) => void,
    createTopic: (topicName: string, parentId?: number, orderIndex?: number) => void,
    deleteTopic: (topicId: number) => void,
    renameTopic: (topicId: number, newName: string) => void,
    allTabs: Topic[],
    setAllTabs: (tabs: Topic[]) => void,
}

export const AppContext = React.createContext({} as ContextProps)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { topics, setTopics, createTopic, deleteTopic, renameTopic } =
    useTopics()
  const [allTabs, setAllTabs] = useState<Topic[]>([])

  const contextValue = {
    topics,
    setTopics,
    createTopic,
    deleteTopic,
    renameTopic,
    allTabs,
    setAllTabs,
  }
  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}
