import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import * as firebase from "firebase";
import { Form, Input, Item, Label, Button } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { firebaseConfig, clientId } from "../config";
import { Google } from "expo";
import { AppAuth } from "expo-app-auth";

// This value should contain your REVERSE_CLIENT_ID
const { URLSchemes } = AppAuth;

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { signedIn: false, name: "", photoUrl: "" };
  }

  static navigationOptions = {
    title: "Login",
    header: null
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.replace("Home");
      }
    });
  }

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = googleUser => {
    console.log("Google Auth Response", googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );
        // Sign in with credential from the Google user.
        firebase
          .auth()
          .signInWithCredential(credential)
          .catch(({ message }) => {
            console.log(message);
          });
      } else {
        console.log("User already signed-in Firebase.");
      }
    });
  };

  googleSignIn = async () => {
    try {
      const { type, accessToken, user } = await Google.logInAsync({
        behavior: "web",
        clientId,
        scopes: ["profile", "email"]
      });

      if (type === "success") {
        /* `accessToken` is now valid and can be used to get data from the Google API with HTTP requests */
        console.log(user);
      } else console.log(type);
    } catch (e) {
      console.log("error", e);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require("../assets/logo.png")} />
          <Text style={styles.logoText}>Firebase Auth</Text>
        </View>
        <Button
          style={styles.googleButton}
          full
          rounded
          warning
          onPress={() => this.googleSignIn()}>
          <FontAwesome name="google" style={styles.googleIcon} size={20} />
          <Text style={styles.googleButtonText}>oogle Sign In</Text>
        </Button>
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
  },
  logoContainer: {
    justifyContent: "center"
  },
  logo: {
    height: 100,
    width: 70
  },
  logoText: {
    color: "#333"
  },
  googleButton: {
    marginHorizontal: 20,
    marginTop: 50
  },
  googleButtonText: {
    color: "#fff"
  },
  googleIcon: {
    color: "#fff"
  }
});
