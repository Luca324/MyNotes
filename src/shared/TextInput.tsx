import React from 'react'

import {
  StyleSheet,
  TextInput as Input,
  TextInputProps as RNTextInputProps,
  StyleProp,
  TextStyle,
} from 'react-native'

interface TextInputProps extends RNTextInputProps {
  value: string
  setValue: (text: string) => void
  styles?: StyleProp<TextStyle>
  defaultValue?: string
}

export default function TextInput({
  value,
  setValue,
  styles = defaultStyles.input,
  defaultValue = '',
  placeholder = '',
}: TextInputProps) {
  return (
    <Input
      multiline={true}
      style={styles}
      value={value}
      onChangeText={setValue}
      defaultValue={defaultValue}
      placeholder={placeholder}
    />
  )
}

const defaultStyles = StyleSheet.create({
  input: {
    margin: 12,
    padding: 10,
    width: '98%',
    backgroundColor: '#F4F4F4',
    borderWidth: 0,
    borderRadius: 4,
    height: 35,
  },
})
