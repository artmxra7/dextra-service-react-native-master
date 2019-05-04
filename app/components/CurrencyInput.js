import React from "react";
import { StyleSheet, TextInput } from "react-native";
import PropTypes from "prop-types";
import { compose } from "lodash/fp";

import { currencyFormat, removeComma } from "../config/Helper";

const CurrencyInput = ({ style, value, onChangeText, placeholder }) => (
  <TextInput
    style={[styles.input, style]}
    underlineColorAndroid="transparent"
    keyboardType="numeric"
    value={currencyFormat(value)}
    placeholder={placeholder}
    onChangeText={text => {
      const backToNumber = compose(onChangeText, parseInt, removeComma);
      backToNumber(text || 0);
    }}
  />
);

CurrencyInput.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChangeText: PropTypes.func,
  style: PropTypes.object
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 2
  }
});

export default CurrencyInput;
