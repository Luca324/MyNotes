import { StyleSheet, Text, View, Pressable } from 'react-native'

export const styles = StyleSheet.create({
  topic: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 2,
    marginHorizontal: 2,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    gap: 8,
  },
  idText: {
    fontSize: 14,
    color: '#666',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  btn: {
    width: 24,
    color: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    margin: 12,
    padding: 10,
    width: '70%',
    backgroundColor: '#F4F4F4',
    borderWidth: 0,
    borderRadius: 4,
    height: 35,
  },
  horizontal: {
    flexDirection: 'row',
    gap: 8,
  },
})
