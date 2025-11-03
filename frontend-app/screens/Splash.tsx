import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from "react-native";

export default function Splash() {
  const appLogo = require("../assets/logominimal.png");
  return (
    
      <View style={styles.centeredContent}>
        <Image source={appLogo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Erase una vez</Text>

        <ActivityIndicator
          size="small"
          color="#888888"
          style={styles.spinner}
        />
      </View>
   
  );
}

const styles = StyleSheet.create({
  
  centeredContent: {
    flex: 1,
    backgroundColor: "#FFFBF5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 24, 
    textAlign: "center",
  },
  spinner: {
    marginTop: 20, 
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});