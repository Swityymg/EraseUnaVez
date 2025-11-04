import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Animated, 
} from "react-native";

export default function Splash() {
  const appLogo = require("../assets/logominimal.png");

  const fadeAnim = useRef(new Animated.Value(0)).current;

 
  useEffect(() => {
    Animated.timing(
      fadeAnim, 
      {
        toValue: 1, 
        duration: 1500, 
        useNativeDriver: true, 
      }
    ).start(); 
  }, [fadeAnim]); 

  return (
    <View style={styles.centeredContent}>
      
      <Animated.Image
        source={appLogo}
        style={[styles.logo, { opacity: fadeAnim }]} 
        resizeMode="contain"
      />

      
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        Erase una vez
      </Animated.Text>

      
      <Animated.View style={[{ opacity: fadeAnim }]}>
        <ActivityIndicator
          size="small"
          color="#888888"
          style={styles.spinner}
        />
      </Animated.View>
    </View>
  );
}

// 
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