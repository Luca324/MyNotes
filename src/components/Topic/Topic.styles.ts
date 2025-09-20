import { StyleSheet, Text, View, Pressable } from 'react-native'

export const styles = StyleSheet.create({
  topic: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 2,
    marginHorizontal: 2,
    paddingHorizontal: 8,
  },

  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
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
    height: 36,
  },
  btn: {
    width: 24,
    color: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    padding: 10,
    width: '70%',
    backgroundColor: '#F4F4F4',
    borderWidth: 0,
    borderRadius: 8,
    height: 36,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalButton: {
    backgroundColor: 'white',
    width: 250,
    alignItems: 'center',
    color: 'black',
    padding: 4,
  },
  readyButton: {
    backgroundColor: '#a5b4fc',
    height: 36,
    borderRadius: 8,

    padding: 5,
  },
  underline: {
    // borderBottomColor: 'black',
    // borderBottomWidth: 1,
    textDecorationColor: 'black',
    textDecorationLine: 'underline',
  }
})
