import React from "react";
import { Spinner } from "native-base";
import { View, Text, StyleSheet } from "react-native";
import * as firebase from "firebase";
import { firebaseConfig } from "../config";

export default class Loading extends React.Component {
  static navigationOptions = {
    title: "Loading",
    header: null
  };

  componentDidMount() {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.replace("Home");
      }
      this.props.navigation.replace("Login");
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner style={styles.spinner} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
