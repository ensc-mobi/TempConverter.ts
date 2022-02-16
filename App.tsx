import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";

// Possible temperature scales
enum Scale {
  Celsius = "Celsius",
  Fahrenheit = "Fahrenheit",
}

function toCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

function toFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

// Convert a temperature using a given function
function tryConvert(
  temperature: string,
  convert: (input: number) => number
): string {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return "";
  }
  const output = convert(input);
  // Keep the output rounded to the third decimal place:
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}

// Component displaying if the water would boil or not, depending on the temperature
// We use inline definition of props shape for convenience
class BoilingResult extends Component<{ tempCelsius: number }, {}> {
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

interface TemperatureInputProps {
  temperature: string;
  scale: Scale;
  onTemperatureChange: (text: string) => void;
}

// Component for displaying and inputting a temperature in a specific scale
class TemperatureInput extends React.Component<TemperatureInputProps, {}> {
  _onChangeText = (text: string) => {
    // Call callback passed as component prop
    this.props.onTemperatureChange(text);
  };

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    const placeholder = `Enter temperature in ${scale}`;
    return (
      <TextInput
        style={styles.text}
        placeholder={placeholder}
        onChangeText={this._onChangeText}
        value={temperature}
      />
    );
  }
}

interface CalculatorState {
  temperature: string;
  scale: Scale;
}

// Main component
class Calculator extends React.Component<{}, CalculatorState> {
  // Common state is lifted here, the closest parent of TemperatureInput components
  // Temperature can be set either in Celsius or in Fahrenheit
  state = { temperature: "", scale: Scale.Celsius };

  _onCelsiusChange = (temperature: string) => {
    this.setState({ scale: Scale.Celsius, temperature });
  };

  _onFahrenheitChange = (temperature: string) => {
    this.setState({ scale: Scale.Fahrenheit, temperature });
  };

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const tempCelsius =
      scale === Scale.Fahrenheit
        ? tryConvert(temperature, toCelsius)
        : temperature;
    const tempFahrenheit =
      scale === Scale.Celsius
        ? tryConvert(temperature, toFahrenheit)
        : temperature;

    return (
      <View>
        <TemperatureInput
          scale={Scale.Celsius}
          temperature={tempCelsius}
          onTemperatureChange={this._onCelsiusChange}
        />
        <TemperatureInput
          scale={Scale.Fahrenheit}
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
    justifyContent: "center",
  },
  text: {
    fontSize: 22,
    paddingBottom: 10,
  },
});
