import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  width100: {
    width: '100%',
  },
  task: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 2,
    marginHorizontal: 2,
    padding: 10,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkboxContainer: {
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#818cf8',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#818cf8',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  taskTextContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  modalButton: {
    backgroundColor: 'white',
    width: 250,
    alignItems: 'center',
    color: 'black',
    padding: 4,
  },
})


