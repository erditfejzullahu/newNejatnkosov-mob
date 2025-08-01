import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const LoadingClientComponent = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#d97706" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

export default LoadingClientComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff', // optional
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});
