import React from "react"
import { StyleSheet, Text } from "react-native"

const types = {
  bold: "source-sans-pro-bold",
  semibold: "source-sans-pro-semibold",
  regular: "source-sans-pro-semibold"
}

/*
Example Use:
<StyledText type="regular" size={72} style={{ color: "white" }}>
    What ever text you want here
</StyledText>
*/

const StyledText = ({ children, style, type, size, ...rest }) => {
  const styles = StyleSheet.create({
    text: {
      fontFamily: types[type],
      fontSize: size,
    }
  })
  return (
    <Text style={{ ...styles.text, ...style }} {...rest}>
      {children}
    </Text>
  )
}

StyledText.defaultProps = {
  type: "regular",
  size: 16
}

export default StyledText
