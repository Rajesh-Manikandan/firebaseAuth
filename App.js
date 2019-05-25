import React from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import Loading from "./screens/LoadingScreen";
import Login from "./screens/LoginScreen1";
import Home from "./screens/HomeScreen";

const mainNavigator = createStackNavigator({
  Loading: { screen: Loading },
  Login: { screen: Login },
  Home: { screen: Home }
});

const app = createAppContainer(mainNavigator);

export default app;
