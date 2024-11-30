import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface RadioButtonProps {
  selected: boolean;
  onPress: () => void;
}

const RadioButton = ({ selected, onPress }: RadioButtonProps) => {
  return (
    <TouchableOpacity style={styles.radioButton} onPress={onPress}>
      {selected ? <View style={styles.radioButtonInner} /> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#966440",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#966440",
  },
});

export default RadioButton;
