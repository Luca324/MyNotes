import React, { useState } from 'react'

import { useTopics } from '@/hooks/useNotes'

export const AppContext = React.createContext({})

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { topics, setTopics, createTopic, deleteTopic, renameTopic } =
    useTopics()
  const [allTabs, setAllTabs] = useState([])

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
