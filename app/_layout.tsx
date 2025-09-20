// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Мои заметки',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="noteEditor" 
        options={{ 
          title: 'Редактор заметок',
          headerShown: true 
        }} 
      />
    </Stack>
  );
}