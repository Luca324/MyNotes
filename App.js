import { StyleSheet, Text, View, Button } from 'react-native';

import { StatusBar } from 'expo-status-bar';


export default function App() {

  return (
    <View style={styles.container}>
      <Button title="Click me to save notes" onPress={() => saveNotes(defaultNotes)} />
      <Text>{notes}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
