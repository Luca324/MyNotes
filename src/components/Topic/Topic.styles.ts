import { StyleSheet, Text, View, Pressable } from 'react-native'

export const styles = StyleSheet.create({
  topic: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 2,
    marginHorizontal: 2,
    paddingHorizontal: 8,
    elevation: 3,
  },

  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    gap: 8,
  },
  topicHeaderSubtopic: {
    marginVertical: 2,
  },
  topicNameContainer: {
    flex: 1,
  },
  createButtonPressable: {
    padding: 4,
    minWidth: 24,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  createNoteIcon: {
    color: '#666',
    fontSize: 22,
    fontWeight: '400',
    textAlign: 'center',
    includeFontPadding: false,
  },
  createTaskIcon: {
    color: '#666',
    fontSize: 20,
    fontWeight: '400',
    textAlign: 'center',
    includeFontPadding: false,
  },
  idText: {
    fontSize: 14,
    color: '#666',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
    height: 36,
    paddingHorizontal: 4,
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
    flex: 1,
    backgroundColor: '#F4F4F4',
    borderWidth: 0,
    borderRadius: 8,
    height: 36,
    minWidth: 0,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalButton: {
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
    color: 'black',
    padding: 4,
  },
  readyButton: {
    backgroundColor: '#818cf8',
    height: 36,
    borderRadius: 8,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  underline: {
    // borderBottomColor: 'black',
    // borderBottomWidth: 1,
    textDecorationColor: 'black',
    textDecorationLine: 'underline',
  }
})
