import React, { useEffect, useState } from 'react'

import { getAllTabs } from '@/database/databaseService'
import { Topic } from '@/types'

interface ContextProps {
  currentTopic: number
  setCurrentTopic: (topicId: number) => void
  allTabs: Topic[]
  setAllTabs: (tabs: Topic[]) => void
}

export const AppContext = React.createContext({} as ContextProps)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTopic, setCurrentTopic] = useState<number>(0)
  const [allTabs, setAllTabs] = useState<Topic[]>([])

  useEffect(() => {
    getAllTabs().then(setAllTabs)
  }, [setAllTabs])

  const contextValue = {
    currentTopic,
    setCurrentTopic,
    allTabs,
    setAllTabs,
  }
  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  )
}
