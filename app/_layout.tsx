// app/_layout.tsx
import { Stack } from 'expo-router'

import { AppProvider } from '@/components/AppProvider'

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Мои заметки',
            headerShown: false, // можно false сделать и header с title не будет
          }}
        />
        <Stack.Screen
          name="noteEditor"
          options={{
            title: 'Редактор заметок',
            headerShown: false,
          }}
        />
      </Stack>
    </AppProvider>
  )
}
