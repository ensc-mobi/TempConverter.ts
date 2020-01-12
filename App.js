import React from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";

const scaleNames = {
  c: "Celsius",
  f: "Fahrenheit"
};

function toCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

// Convert a temperature using a given function
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return "";
  }
  const output = convert(input);
  // Keep the output rounded to the third decimal place:
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}

class BoilingResult extends React.Component {
  render() {
    const tempCelsius = this.props.tempCelsius;
    let message = "";
    if (!Number.isNaN(tempCelsius)) {
      message =
        tempCelsius >= 100
          ? "The water would boil"
          : "The water would not boil";
    }
    return <Text style={styles.text}>{message}</Text>;
  }
}

class TemperatureInput extends React.Component {
  _onChangeText = text => {
    // Callback passed as component prop is called
    this.props.onTemperatureChange(text);
  };

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    const placeholder = `Enter temperature in ${scaleNames[scale]}`;
    return (
      <TextInput
        style={styles.text}
        placeholder={placeholder}
        value={temperature}
        onChangeText={this._onChangeText}
      />
    );
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    // Common state is lifted in closest parent of TemperatureInput components
    // Temperature can be set either in Celsius or in Fahrenheit
    this.state = { temperature: "", scale: "c" };
  }

  _onCelsiusChange = temperature => {
    this.setState({ scale: "c", temperature });
  };

  _onFahrenheitChange = temperature => {
    this.setState({ scale: "f", temperature });
  };

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const tempCelsius =
      scale === "f" ? tryConvert(temperature, toCelsius) : temperature;
    const tempFahrenheit =
      scale === "c" ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <View>
        <TemperatureInput
          scale="c"
          temperature={tempCelsius}
          onTemperatureChange={this._onCelsiusChange}
        />
        <TemperatureInput
          scale="f"
          temperature={tempFahrenheit}
          onTemperatureChange={this._onFahrenheitChange}
        />
        <BoilingResult tempCelsius={parseFloat(tempCelsius)} />
      </View>
    );
  }
}

export default function App() {
  return (
    <View style={styles.container}>
      <Calculator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontSize: 22,
    paddingBottom: 10
  }
});
