import React, { useEffect } from 'react'

import {
  Modal as NativeModal,
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native'

interface ModalProps {
  modalVisible: boolean
  setModalVisible: (modalVisible: boolean) => void
  children: React.ReactNode
  onClose?: (...args: any[]) => any
}

export default function Modal({
  modalVisible,
  setModalVisible,
  children,
  onClose,
}: ModalProps) {
  useEffect(() => {
    if (onClose && modalVisible === false) {
      onClose()
    }
  }, [modalVisible])

  return (
    <NativeModal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>{children}</View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </NativeModal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 10,
    width: 280,
    maxWidth: '90%',
  },
})
